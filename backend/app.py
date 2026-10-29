from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import abort, send_from_directory
import joblib
import pandas as pd

PROJECT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"
FRONTEND_DIST_DIR = FRONTEND_DIR / "dist"

app = Flask(
    __name__,
    static_folder=str(FRONTEND_DIST_DIR / "assets"),
    static_url_path="/assets",
)
CORS(app)

# ==========================================
# Load Model 1
# ==========================================

MODEL_PATH = PROJECT_DIR / "model" / "disease_prediction_model.pkl"

model = joblib.load(MODEL_PATH)

# Exact feature names used during model training
FEATURES = list(model.feature_names_in_)


# ==========================================
# Normalize symptom names
# ==========================================

def normalize(text):
    return (
        str(text)
        .lower()
        .strip()
        .replace("_", " ")
        .replace("-", " ")
    )


# Create mapping:
# "skin rash" -> "skin_rash"
# "fever" -> "fever"
# etc.

FEATURE_MAP = {
    normalize(feature): feature
    for feature in FEATURES
}


# ==========================================
# Frontend Routes
# ==========================================

@app.route("/", methods=["GET"])
def home():
    if not (FRONTEND_DIST_DIR / "index.html").is_file():
        return jsonify({
            "error": "Frontend build not found. Run `npm run build` in the frontend directory."
        }), 503

    return send_from_directory(FRONTEND_DIST_DIR, "index.html")


@app.route("/legacy.html", methods=["GET"])
def legacy_frontend():
    return send_from_directory(FRONTEND_DIST_DIR, "legacy.html")


@app.route("/styles.css", methods=["GET"])
def legacy_styles():
    return send_from_directory(FRONTEND_DIST_DIR, "styles.css")


@app.route("/app.js", methods=["GET"])
def legacy_script():
    return send_from_directory(FRONTEND_DIST_DIR, "app.js")


@app.route("/<path:path>", methods=["GET"])
def frontend_route(path):
    if Path(path).suffix:
        abort(404)

    if not (FRONTEND_DIST_DIR / "index.html").is_file():
        return jsonify({
            "error": "Frontend build not found. Run `npm run build` in the frontend directory."
        }), 503

    return send_from_directory(FRONTEND_DIST_DIR, "index.html")


# ==========================================
# Disease Prediction
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No JSON data received."
            }), 400

        symptoms = data.get("symptoms", [])

        if not symptoms:
            return jsonify({
                "error": "Please select at least one symptom."
            }), 400


        # ==================================
        # Create input DataFrame
        # ==================================

        input_data = {
            feature: 0
            for feature in FEATURES
        }


        # ==================================
        # Set selected symptoms to 1
        # ==================================

        matched_symptoms = []
        unmatched_symptoms = []

        for symptom in symptoms:

            normalized = normalize(symptom)

            if normalized in FEATURE_MAP:

                actual_feature = FEATURE_MAP[normalized]

                input_data[actual_feature] = 1

                matched_symptoms.append(actual_feature)

            else:

                unmatched_symptoms.append(symptom)


        # ==================================
        # Convert to DataFrame
        # This preserves feature names
        # ==================================

        input_df = pd.DataFrame(
            [input_data],
            columns=FEATURES
        )


        # ==================================
        # Model 1 Prediction
        # ==================================

        prediction = model.predict(input_df)[0]


        # ==================================
        # Prediction probabilities
        # ==================================

        probabilities = model.predict_proba(input_df)[0]


        # ==================================
        # Top 3 predictions
        # ==================================

        top_indices = probabilities.argsort()[::-1][:3]

        top_predictions = []

        for index in top_indices:

            top_predictions.append({
                "disease": str(model.classes_[index]),
                "confidence": round(
                    float(probabilities[index]) * 100,
                    2
                )
            })


        # ==================================
        # Highest confidence
        # ==================================

        confidence = round(
            float(max(probabilities)) * 100,
            2
        )


        # ==================================
        # Return result
        # ==================================

        return jsonify({

            "success": True,

            "disease": str(prediction),

            "confidence": confidence,

            "top_predictions": top_predictions,

            "matched_symptoms": matched_symptoms,

            "unmatched_symptoms": unmatched_symptoms
        })


    except Exception as e:

        print("Prediction error:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# Start Flask
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )