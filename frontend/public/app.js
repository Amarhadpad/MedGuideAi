// ==========================================
// MedGuide AI - Model 1 Disease Prediction
// Uses ALL 132 Dataset-1 symptom features
// ==========================================

const symptoms = [
  { feature: "itching", label: "Itching" },
  { feature: "skin_rash", label: "Skin Rash" },
  { feature: "nodal_skin_eruptions", label: "Nodal Skin Eruptions" },
  { feature: "continuous_sneezing", label: "Continuous Sneezing" },
  { feature: "shivering", label: "Shivering" },
  { feature: "chills", label: "Chills" },
  { feature: "joint_pain", label: "Joint Pain" },
  { feature: "stomach_pain", label: "Stomach Pain" },
  { feature: "acidity", label: "Acidity" },
  { feature: "ulcers_on_tongue", label: "Ulcers On Tongue" },
  { feature: "muscle_wasting", label: "Muscle Wasting" },
  { feature: "vomiting", label: "Vomiting" },
  { feature: "burning_micturition", label: "Burning Micturition" },
  { feature: "spotting_ urination", label: "Spotting During Urination" },
  { feature: "fatigue", label: "Fatigue" },
  { feature: "weight_gain", label: "Weight Gain" },
  { feature: "anxiety", label: "Anxiety" },
  { feature: "cold_hands_and_feets", label: "Cold Hands And Feets" },
  { feature: "mood_swings", label: "Mood Swings" },
  { feature: "weight_loss", label: "Weight Loss" },
  { feature: "restlessness", label: "Restlessness" },
  { feature: "lethargy", label: "Lethargy" },
  { feature: "patches_in_throat", label: "Patches In Throat" },
  { feature: "irregular_sugar_level", label: "Irregular Sugar Level" },
  { feature: "cough", label: "Cough" },
  { feature: "high_fever", label: "High Fever" },
  { feature: "sunken_eyes", label: "Sunken Eyes" },
  { feature: "breathlessness", label: "Breathlessness" },
  { feature: "sweating", label: "Sweating" },
  { feature: "dehydration", label: "Dehydration" },
  { feature: "indigestion", label: "Indigestion" },
  { feature: "headache", label: "Headache" },
  { feature: "yellowish_skin", label: "Yellowish Skin" },
  { feature: "dark_urine", label: "Dark Urine" },
  { feature: "nausea", label: "Nausea" },
  { feature: "loss_of_appetite", label: "Loss Of Appetite" },
  { feature: "pain_behind_the_eyes", label: "Pain Behind The Eyes" },
  { feature: "back_pain", label: "Back Pain" },
  { feature: "constipation", label: "Constipation" },
  { feature: "abdominal_pain", label: "Abdominal Pain" },
  { feature: "diarrhoea", label: "Diarrhoea" },
  { feature: "mild_fever", label: "Mild Fever" },
  { feature: "yellowing_of_eyes", label: "Yellowing Of Eyes" },
  { feature: "acute_liver_failure", label: "Acute Liver Failure" },
  { feature: "fluid_overload", label: "Fluid Overload" },
  { feature: "swelling_of_stomach", label: "Swelling Of Stomach" },
  { feature: "swelled_lymph_nodes", label: "Swelled Lymph Nodes" },
  { feature: "malaise", label: "Malaise" },
  { feature: "blurred_and_distorted_vision", label: "Blurred And Distorted Vision" },
  { feature: "phlegm", label: "Phlegm" },
  { feature: "throat_irritation", label: "Throat Irritation" },
  { feature: "redness_of_eyes", label: "Redness Of Eyes" },
  { feature: "sinus_pressure", label: "Sinus Pressure" },
  { feature: "runny_nose", label: "Runny Nose" },
  { feature: "congestion", label: "Congestion" },
  { feature: "chest_pain", label: "Chest Pain" },
  { feature: "weakness_in_limbs", label: "Weakness In Limbs" },
  { feature: "fast_heart_rate", label: "Fast Heart Rate" },
  { feature: "pain_during_bowel_movements", label: "Pain During Bowel Movements" },
  { feature: "pain_in_anal_region", label: "Pain In Anal Region" },
  { feature: "bloody_stool", label: "Bloody Stool" },
  { feature: "irritation_in_anus", label: "Irritation In Anus" },
  { feature: "neck_pain", label: "Neck Pain" },
  { feature: "dizziness", label: "Dizziness" },
  { feature: "cramps", label: "Cramps" },
  { feature: "bruising", label: "Bruising" },
  { feature: "obesity", label: "Obesity" },
  { feature: "swollen_legs", label: "Swollen Legs" },
  { feature: "swollen_blood_vessels", label: "Swollen Blood Vessels" },
  { feature: "puffy_face_and_eyes", label: "Puffy Face And Eyes" },
  { feature: "enlarged_thyroid", label: "Enlarged Thyroid" },
  { feature: "brittle_nails", label: "Brittle Nails" },
  { feature: "excessive_hunger", label: "Excessive Hunger" },
  { feature: "extra_marital_contacts", label: "Extra-marital Contacts" },
  { feature: "drying_and_tingling_lips", label: "Drying And Tingling Lips" },
  { feature: "slurred_speech", label: "Slurred Speech" },
  { feature: "knee_pain", label: "Knee Pain" },
  { feature: "hip_joint_pain", label: "Hip Joint Pain" },
  { feature: "muscle_weakness", label: "Muscle Weakness" },
  { feature: "stiff_neck", label: "Stiff Neck" },
  { feature: "swelling_joints", label: "Swelling Joints" },
  { feature: "movement_stiffness", label: "Movement Stiffness" },
  { feature: "spinning_movements", label: "Spinning Movements" },
  { feature: "loss_of_balance", label: "Loss Of Balance" },
  { feature: "unsteadiness", label: "Unsteadiness" },
  { feature: "weakness_of_one_body_side", label: "Weakness Of One Body Side" },
  { feature: "loss_of_smell", label: "Loss Of Smell" },
  { feature: "bladder_discomfort", label: "Bladder Discomfort" },
  { feature: "foul_smell_of urine", label: "Foul Smell Of Urine" },
  { feature: "continuous_feel_of_urine", label: "Continuous Feel Of Urine" },
  { feature: "passage_of_gases", label: "Passage Of Gases" },
  { feature: "internal_itching", label: "Internal Itching" },
  { feature: "toxic_look_(typhos)", label: "Toxic Appearance" },
  { feature: "depression", label: "Depression" },
  { feature: "irritability", label: "Irritability" },
  { feature: "muscle_pain", label: "Muscle Pain" },
  { feature: "altered_sensorium", label: "Altered Sensorium" },
  { feature: "red_spots_over_body", label: "Red Spots Over Body" },
  { feature: "belly_pain", label: "Belly Pain" },
  { feature: "abnormal_menstruation", label: "Abnormal Menstruation" },
  { feature: "dischromic _patches", label: "Discolored Skin Patches" },
  { feature: "watering_from_eyes", label: "Watering From Eyes" },
  { feature: "increased_appetite", label: "Increased Appetite" },
  { feature: "polyuria", label: "Polyuria" },
  { feature: "family_history", label: "Family History" },
  { feature: "mucoid_sputum", label: "Mucoid Sputum" },
  { feature: "rusty_sputum", label: "Rusty Sputum" },
  { feature: "lack_of_concentration", label: "Lack Of Concentration" },
  { feature: "visual_disturbances", label: "Visual Disturbances" },
  { feature: "receiving_blood_transfusion", label: "Recent Blood Transfusion" },
  { feature: "receiving_unsterile_injections", label: "Unsterile Injections" },
  { feature: "coma", label: "Coma" },
  { feature: "stomach_bleeding", label: "Stomach Bleeding" },
  { feature: "distention_of_abdomen", label: "Distention Of Abdomen" },
  { feature: "history_of_alcohol_consumption", label: "History Of Alcohol Consumption" },
  { feature: "fluid_overload.1", label: "Fluid Overload Secondary" },
  { feature: "blood_in_sputum", label: "Blood In Sputum" },
  { feature: "prominent_veins_on_calf", label: "Prominent Veins On Calf" },
  { feature: "palpitations", label: "Palpitations" },
  { feature: "painful_walking", label: "Painful Walking" },
  { feature: "pus_filled_pimples", label: "Pus Filled Pimples" },
  { feature: "blackheads", label: "Blackheads" },
  { feature: "scurring", label: "Scurring" },
  { feature: "skin_peeling", label: "Skin Peeling" },
  { feature: "silver_like_dusting", label: "Silver Like Dusting" },
  { feature: "small_dents_in_nails", label: "Small Dents In Nails" },
  { feature: "inflammatory_nails", label: "Inflammatory Nails" },
  { feature: "blister", label: "Blister" },
  { feature: "red_sore_around_nose", label: "Red Sore Around Nose" },
  { feature: "yellow_crust_ooze", label: "Yellow Crust Ooze" }
];

const selected = new Set();

const symptomGrid = document.getElementById("symptom-grid");
const selectedArea = document.getElementById("selected-area");
const counter = document.getElementById("symptom-counter");
const search = document.getElementById("symptom-search");

const resultEmpty = document.getElementById("result-empty");
const resultContent = document.getElementById("result-content");
const resultDisease = document.getElementById("result-disease");
const resultReason = document.getElementById("result-reason");
const resultConfidence = document.getElementById("result-confidence");
const confidenceFill = document.getElementById("confidence-fill");
const topPredictions = document.getElementById("top-predictions");

function renderSymptoms(filter = "") {

  const query = filter.trim().toLowerCase();

  symptomGrid.innerHTML = "";

  symptoms
    .filter(symptom =>
      symptom.label.toLowerCase().includes(query) ||
      symptom.feature.toLowerCase().includes(query)
    )
    .forEach(symptom => {

      const button = document.createElement("button");

      button.type = "button";
      button.className =
        `symptom-button${selected.has(symptom.feature) ? " selected" : ""}`;

      button.textContent = symptom.label;
      button.title = symptom.feature;

      button.addEventListener("click", () => {
        toggleSymptom(symptom.feature);
      });

      symptomGrid.appendChild(button);
    });
}

function renderSelected() {

  selectedArea.innerHTML = "";

  if (selected.size === 0) {

    selectedArea.innerHTML =
      '<span class="empty-selection">Your selected symptoms will appear here</span>';

  } else {

    selected.forEach(feature => {

      const symptom = symptoms.find(
        item => item.feature === feature
      );

      if (!symptom) return;

      const chip = document.createElement("span");

      chip.className = "selected-chip";

      chip.textContent = symptom.label;

      const removeButton = document.createElement("button");

      removeButton.type = "button";
      removeButton.textContent = "×";

      removeButton.addEventListener("click", () => {
        toggleSymptom(feature);
      });

      chip.appendChild(removeButton);

      selectedArea.appendChild(chip);
    });
  }

  counter.textContent = `${selected.size} selected`;

  renderSymptoms(search.value);
}

function toggleSymptom(feature) {

  if (selected.has(feature)) {
    selected.delete(feature);
  } else {
    selected.add(feature);
  }

  renderSelected();
}

function displayTopPredictions(predictions) {

  if (!topPredictions) return;

  topPredictions.innerHTML = "";

  if (!predictions || predictions.length === 0) return;

  predictions.forEach((item, index) => {

    const row = document.createElement("div");

    row.className = "prediction-row";

    row.innerHTML = `
      <span>${index + 1}. ${item.disease}</span>
      <strong>${item.confidence}%</strong>
    `;

    topPredictions.appendChild(row);
  });
}

async function showResult() {

  if (selected.size === 0) {

    search.focus();

    search.setAttribute(
      "placeholder",
      "Choose at least one symptom"
    );

    return;
  }

  if (resultEmpty) {
    resultEmpty.classList.add("hidden");
  }

  if (resultContent) {
    resultContent.classList.remove("hidden");
  }

  if (resultDisease) {
    resultDisease.textContent = "Analyzing...";
  }

  if (resultConfidence) {
    resultConfidence.textContent = "--% confidence";
  }

  if (confidenceFill) {
    confidenceFill.style.width = "0%";
  }

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/predict",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          symptoms: Array.from(selected)
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "Prediction failed"
      );
    }

    if (resultDisease) {
      resultDisease.textContent = result.disease;
    }

    const confidence = Number(result.confidence);

    if (resultConfidence) {
      resultConfidence.textContent =
        `${confidence}% confidence`;
    }

    if (confidenceFill) {
      confidenceFill.style.width =
        `${Math.min(confidence, 100)}%`;
    }

    if (resultReason) {
      resultReason.textContent =
        `Model 1 predicted ${result.disease} with ${confidence}% confidence.`;
    }

    displayTopPredictions(
      result.top_predictions
    );

    console.log(
      "Model 1 result:",
      result
    );

  } catch (error) {

    console.error(
      "Prediction error:",
      error
    );

    if (resultDisease) {
      resultDisease.textContent =
        "Prediction unavailable";
    }

    if (resultConfidence) {
      resultConfidence.textContent =
        "--% confidence";
    }

    if (confidenceFill) {
      confidenceFill.style.width = "0%";
    }

    if (resultReason) {
      resultReason.textContent =
        "Unable to connect to Model 1. Please make sure Flask is running.";
    }
  }
}

if (search) {

  search.addEventListener(
    "input",
    event => {
      renderSymptoms(event.target.value);
    }
  );
}

const clearButton =
  document.getElementById("clear-symptoms");

if (clearButton) {

  clearButton.addEventListener(
    "click",
    () => {

      selected.clear();

      renderSelected();
    }
  );
}

const analyzeButton =
  document.getElementById("analyze-button");

if (analyzeButton) {

  analyzeButton.addEventListener(
    "click",
    showResult
  );
}

const nearbyQuery = document.getElementById("nearby-query");
const nearbyButton = document.getElementById("find-nearby-button");
const nearbyStatus = document.getElementById("nearby-status");
const nearbyMap = document.getElementById("nearby-map");
const mapPlaceholder = document.getElementById("map-placeholder");
const googleMapsLink = document.getElementById("google-maps-link");

function clearNearbyResults() {
  googleMapsLink.classList.add("hidden");
  nearbyMap.classList.add("hidden");
  nearbyMap.removeAttribute("src");
  mapPlaceholder.classList.remove("hidden");
}

function showGoogleMapsSearch(query, coordinates) {
  const search = coordinates
    ? `${query} near ${coordinates.latitude},${coordinates.longitude}`
    : `${query} near me`;
  const encodedSearch = new URLSearchParams({ query: search }).toString();
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&${encodedSearch}`;

  googleMapsLink.href = mapSearchUrl;
  googleMapsLink.classList.remove("hidden");

  if (coordinates) {
    const embedQuery = new URLSearchParams({
      q: search,
      output: "embed"
    });
    nearbyMap.src = `https://maps.google.com/maps?${embedQuery.toString()}`;
    nearbyMap.classList.remove("hidden");
    mapPlaceholder.classList.add("hidden");
  }
}

if (nearbyButton && nearbyQuery && nearbyStatus) {
  nearbyButton.addEventListener("click", () => {
    clearNearbyResults();
    const query = nearbyQuery.value.trim();

    if (!query) {
      nearbyStatus.textContent = "Enter a type of care to search, such as doctor or hospital.";
      nearbyQuery.focus();
      return;
    }

    if (!navigator.geolocation) {
      nearbyStatus.textContent =
        "Location is not available in this browser. You can still search Google Maps for places near you.";
      showGoogleMapsSearch(query);
      return;
    }

    nearbyButton.disabled = true;
    nearbyStatus.textContent = "Requesting your location...";

    navigator.geolocation.getCurrentPosition(
      position => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        showGoogleMapsSearch(query, coordinates);
        nearbyStatus.textContent =
          "Nearby results are shown by Google Maps. Check provider details and availability directly.";
        nearbyButton.disabled = false;
      },
      error => {
        const messages = {
          1: "Location permission was denied. Allow location access in your browser settings, or search Google Maps for places near you.",
          2: "Your location could not be determined. Try again or search Google Maps for places near you.",
          3: "The location request timed out. Try again or search Google Maps for places near you."
        };

        nearbyStatus.textContent =
          messages[error.code] || "Unable to get your location. You can still search Google Maps for places near you.";
        showGoogleMapsSearch(query);
        nearbyButton.disabled = false;
      },
      {
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 10000
      }
    );
  });
}

renderSymptoms();
renderSelected();
