# MedGuide AI - Project Report

## 1. Executive summary

MedGuide AI is a web-based educational prototype that accepts a user's selected
symptoms and returns a disease-class estimate from a pre-trained machine
learning model. The project combines a React/Vite user interface with a Flask
API and locally bundled scikit-learn models.

The current working web flow includes symptom search and category filters, a
three-step assessment, severity and duration context, a prediction result with
alternative model classes, urgent-symptom warnings, browser-local assessment
history, health education content, and an optional Google Maps search link.
Guests can use the application without signing in.

This is not a clinical product. The output is not a diagnosis, the displayed
model score is not a calibrated probability that a user has a condition, and
the application does not replace professional medical advice. Authentication,
doctor verification, connected medical referrals, and the second-opinion
service are not implemented.

## 2. Project objectives

- Provide a simple web interface for symptom selection.
- Convert selected symptoms to the feature format expected by the disease
  model.
- Return the model's leading disease class and up to three candidate classes.
- Communicate the educational and non-diagnostic nature of the results.
- Provide basic review, history, health education, and nearby-care navigation.
- Keep the prototype straightforward to install and run locally.

## 3. Scope and implementation status

### In the current running application

- React single-page application with routes for Home, Assessment, History,
  Education, and Results.
- Flask `POST /predict` endpoint.
- Bundled disease prediction model loaded from `model/`.
- Guest use without login.
- Assessment history stored in the user's browser `localStorage`.
- Client-side emergency warning for selected predefined symptoms.
- Google Maps search-link generation using a user-initiated browser location
  request.
- Legacy static frontend served from `/legacy.html` after a frontend build.

### Present in the repository but not connected to the web prediction flow

- A second medical-system recommendation model.
- Medical-system recommendation datasets and scripts.
- Specialist and complementary-recommendation dataset fields.
- Standalone scripts that demonstrate or explore the two-model pipeline.

### Not implemented

- Doctor/patient registration, login, authorization, or identity verification.
- Server-side profiles or cloud-synchronized assessment history.
- Integration of medical-system recommendations into the Flask API.
- Gemini or other AI second-opinion integration.
- Verified provider search or appointment scheduling.

## 4. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React, React DOM, React Router |
| Frontend tooling and styling | Vite, Tailwind CSS, Vite React plugin |
| Backend | Python, Flask, Flask-CORS |
| Machine learning and data | scikit-learn, pandas, joblib |
| Model persistence | Joblib pickle files under `model/` |
| Local history | Browser `localStorage` |
| Nearby-care handoff | Browser Geolocation API and Google Maps search URL |

## 5. Repository structure

```text
backend/
  app.py                  Flask web server and prediction API
  requirements.txt        Python dependencies
datasets/
  cleaned/                Cleaned disease/symptom data
  raw/                    Source disease training/test data
  recommendation/         Medical-system recommendation data
docs/
  PROJECT_REQUIREMENTS.md Project requirements and acceptance checks
  PROJECT_REPORT.md       This report
frontend/
  public/                 Legacy static frontend files
  src/
    App.jsx               React routes, screens, and UI behavior
    data.js               Symptom and health education content
    main.jsx              React entry point
    styles.css            Frontend styles
  index.html              Vite application shell
  package.json            Frontend scripts and dependencies
  vite.config.js          Development server configuration
model/
  disease_prediction_model.pkl
  medical_system_model.pkl
scripts/                  Data preparation, training, and exploration
package.json              Root npm workspace and convenience scripts
package-lock.json         Locked JavaScript dependency graph
```

## 6. System architecture

```text
Browser
  |
  | React UI (Vite in development; Flask-served build otherwise)
  |
  | POST /predict with JSON symptom list
  v
Flask API (backend/app.py)
  |
  | Normalize symptom names and map to model features
  | Build a one-row pandas DataFrame in training feature order
  v
Disease Random Forest model
  |
  | Predicted class, class probabilities, top three classes
  v
JSON response -> result page
```

In development, the root `npm run dev` command starts Vite and Flask together;
Vite proxies `/predict` to Flask. For a built web application, Vite creates
`frontend/dist`, and Flask serves that build and handles the API on the same
origin.

## 7. Data and machine-learning model

The disease training script, `scripts/train_disease_model.py`, reads
`datasets/cleaned/Disease_Symptom_Cleaned.csv`. It uses `prognosis` as the
target, performs a stratified 80/20 train/test split with `random_state=42`,
and trains a `RandomForestClassifier` with 300 estimators and balanced class
weights. The script prints accuracy and a classification report, then saves
the model to `model/disease_prediction_model.pkl`.

The bundled disease model was inspected for this report: it is a
`RandomForestClassifier` with 132 symptom features and 41 classes. The
backend uses the model's `feature_names_in_` to build its input columns and
`predict_proba` to produce the returned class scores.

The repository also contains a second `RandomForestClassifier` model for
medical-system categories (68 features and 3 classes), plus recommendation
datasets. The current Flask `/predict` endpoint loads only the disease model;
the second model and recommendation data are not part of the current UI
request/response path.

No new training evaluation was run as part of this report. Therefore, this
report does not claim a particular model accuracy or clinical validity.

## 8. Application workflow

1. The user opens the application as a guest; no account is requested.
2. On the assessment page, the user searches symptoms, filters by category,
   and selects one or more items.
3. If a predefined urgent symptom is selected (chest pain, breathlessness,
   coma, or altered sensorium), the UI displays a safety alert.
4. The user selects severity and duration, then reviews their entries.
5. The frontend submits `{"symptoms": ["feature_name", ...]}` to `POST
   /predict`.
6. Flask normalizes symptom labels, creates a zero-filled feature vector in the
   model's trained feature order, sets recognized features to one, and invokes
   the bundled model.
7. Flask returns the top prediction, score, top candidates, and matched and
   unmatched symptoms as JSON.
8. The result page explains the score's limitations, shows the user input, and
   offers save-to-history, nearby-care search, and print/export actions.
9. Saved history remains in browser `localStorage` on that device until the
   user deletes it or clears browser storage.

### API contract

**Request**

```http
POST /predict
Content-Type: application/json
```

```json
{
  "symptoms": ["headache", "skin_rash"]
}
```

**Successful response shape**

```json
{
  "success": true,
  "disease": "Example class",
  "confidence": 12.34,
  "top_predictions": [
    {"disease": "Example class", "confidence": 12.34}
  ],
  "matched_symptoms": ["headache", "skin_rash"],
  "unmatched_symptoms": []
}
```

The class and percentages vary with input; this example is illustrative, not a
specific prediction. An empty symptom list returns a client error. Invalid
JSON or a non-JSON request currently reaches the endpoint's general exception
handler and returns a JSON error with HTTP 500; this should be changed to a
client error as a backend hardening task. Unexpected prediction failures are
also returned as JSON server errors.

## 9. Installation and running

For a complete Windows walkthrough and copy-paste setup script, see the
[setup guide](SETUP_GUIDE.md).

### Prerequisites

- Python 3.11 or newer.
- Node.js and npm.
- Run all commands from the repository root unless noted.

### One-time setup (Windows PowerShell)

```powershell
py -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
npm install
```

### Development mode

```powershell
npm run dev
```

This starts the Flask backend and Vite frontend together. Open the Vite URL
printed in the terminal, normally `http://localhost:5173`. Press `Ctrl+C` to
stop both processes.

### Built app served by Flask

```powershell
npm run build
.\venv\Scripts\python.exe backend\app.py
```

Open `http://127.0.0.1:5000`. Flask serves the built React app and the
prediction API. A frontend build must exist before starting this mode.

## 10. Verification performed

The project has been exercised during development with:

- `npm run build` to confirm that the frontend compiles.
- Flask test-client requests for the application page, React page routes,
  legacy files, and `POST /predict`.
- Browser checks of the guided assessment, emergency warning, results view,
  and Vite-to-Flask prediction proxy.

These are functional integration checks, not clinical validation, formal
usability testing, penetration testing, or a full automated regression suite.

## 11. Limitations, safety, and privacy

- Predictions depend on a dataset-trained classifier and should not be used to
  diagnose, rule out, or treat a condition.
- The displayed class score is not established by this project to be a
  calibrated probability of a user's condition.
- Emergency alerts are based on a small predefined symptom set; absence of an
  alert does not establish that a situation is safe.
- Severity and duration are stored in the assessment record but are not model
  features sent to the prediction endpoint.
- The frontend symptom list and model feature names may not perfectly align;
  the API reports unmatched names but still evaluates the recognized feature
  vector.
- Invalid or non-JSON request bodies currently produce an HTTP 500 response
  because request parsing is covered by the endpoint's general exception
  handler; request validation should return a 4xx response instead.
- History is local to the browser and is not encrypted or synchronized by this
  application.
- Nearby-care results are provided by Google Maps after the user opens a link;
  provider data is not verified by MedGuide AI.
- Flask's built-in server is not appropriate for production deployment.
- The application has no user accounts or server-side access control.

## 12. Future work

1. Decide and implement a secure authentication provider for patient and doctor
   roles, including an explicit doctor-verification process; preserve guest
   access.
2. Review and clinically govern medical content, model data, and escalation
   language before any real-world use.
3. Evaluate the model with reproducible metrics, per-class analysis, dataset
   provenance, and calibration assessment.
4. Integrate the medical-system recommendation model only after reviewing its
   evidence and safety; do not imply clinical endorsement without validation.
5. Add automated frontend/backend tests and CI checks.
6. Add privacy controls and a deliberate data-retention policy before adding
   server-side accounts or history.
7. For deployment, configure a production WSGI server, HTTPS, environment-based
   secrets, logging, monitoring, and security review.

## 13. Conclusion

MedGuide AI currently works as a local, guest-accessible web prototype for
symptom entry and educational disease-class estimates. Its React frontend and
Flask API are integrated for both development and built-app use. The project
also includes supplementary recommendation assets, but those assets, login,
doctor verification, and AI second opinion are not yet integrated into the
current web workflow. Any extension toward clinical use requires independent
clinical, privacy, security, and regulatory review.
