export const symptoms = [
  { feature: "itching", label: "Itching", category: "Skin & Hair" },
  { feature: "skin_rash", label: "Skin rash", category: "Skin & Hair" },
  { feature: "nodal_skin_eruptions", label: "Nodal skin eruptions", category: "Skin & Hair" },
  { feature: "pus_filled_pimples", label: "Pus-filled pimples", category: "Skin & Hair" },
  { feature: "blackheads", label: "Blackheads", category: "Skin & Hair" },
  { feature: "skin_peeling", label: "Skin peeling", category: "Skin & Hair" },
  { feature: "blister", label: "Blisters", category: "Skin & Hair" },
  { feature: "continuous_sneezing", label: "Continuous sneezing", category: "Respiratory" },
  { feature: "cough", label: "Cough", category: "Respiratory" },
  { feature: "breathlessness", label: "Breathlessness", category: "Respiratory" },
  { feature: "phlegm", label: "Phlegm", category: "Respiratory" },
  { feature: "throat_irritation", label: "Throat irritation", category: "Respiratory" },
  { feature: "runny_nose", label: "Runny nose", category: "Respiratory" },
  { feature: "congestion", label: "Congestion", category: "Respiratory" },
  { feature: "stomach_pain", label: "Stomach pain", category: "Digestive" },
  { feature: "acidity", label: "Acidity", category: "Digestive" },
  { feature: "vomiting", label: "Vomiting", category: "Digestive" },
  { feature: "indigestion", label: "Indigestion", category: "Digestive" },
  { feature: "nausea", label: "Nausea", category: "Digestive" },
  { feature: "constipation", label: "Constipation", category: "Digestive" },
  { feature: "abdominal_pain", label: "Abdominal pain", category: "Digestive" },
  { feature: "diarrhoea", label: "Diarrhoea", category: "Digestive" },
  { feature: "loss_of_appetite", label: "Loss of appetite", category: "Digestive" },
  { feature: "mild_fever", label: "Fever", category: "General" },
  { feature: "high_fever", label: "High fever", category: "General" },
  { feature: "chills", label: "Chills", category: "General" },
  { feature: "shivering", label: "Shivering", category: "General" },
  { feature: "headache", label: "Headache", category: "General" },
  { feature: "fatigue", label: "Fatigue", category: "General" },
  { feature: "lethargy", label: "Lethargy", category: "General" },
  { feature: "joint_pain", label: "Joint pain", category: "General" },
  { feature: "muscle_pain", label: "Muscle pain", category: "General" },
  { feature: "dizziness", label: "Dizziness", category: "General" },
  { feature: "chest_pain", label: "Chest pain", category: "General" },
  { feature: "fast_heart_rate", label: "Fast heart rate", category: "General" },
  { feature: "back_pain", label: "Back pain", category: "General" },
  { feature: "weakness_in_limbs", label: "Weakness in limbs", category: "General" },
  { feature: "yellowish_skin", label: "Yellowish skin", category: "General" },
  { feature: "dark_urine", label: "Dark urine", category: "Urinary" },
  { feature: "burning_micturition", label: "Burning urination", category: "Urinary" },
  { feature: "bladder_discomfort", label: "Bladder discomfort", category: "Urinary" },
  { feature: "blurred_and_distorted_vision", label: "Blurred vision", category: "Other" },
  { feature: "swelled_lymph_nodes", label: "Swollen lymph nodes", category: "Other" },
  { feature: "pain_behind_the_eyes", label: "Pain behind the eyes", category: "Other" },
  { feature: "redness_of_eyes", label: "Redness of eyes", category: "Other" },
];

const additionalSymptomsByCategory = {
  "Skin & Hair": [
    "scurring",
    "silver_like_dusting",
    "small_dents_in_nails",
    "inflammatory_nails",
    "red_sore_around_nose",
    "yellow_crust_ooze",
  ],
  Respiratory: [
    "patches_in_throat",
    "sinus_pressure",
    "mucoid_sputum",
    "rusty_sputum",
    "blood_in_sputum",
    "loss_of_smell",
  ],
  Digestive: [
    "ulcers_on_tongue",
    "pain_during_bowel_movements",
    "pain_in_anal_region",
    "bloody_stool",
    "irritation_in_anus",
    "passage_of_gases",
    "stomach_bleeding",
    "distention_of_abdomen",
    "swelling_of_stomach",
    "belly_pain",
  ],
  Urinary: [
    "spotting_ urination",
    "yellow_urine",
    "foul_smell_of urine",
    "continuous_feel_of_urine",
    "polyuria",
  ],
};

const categorizedFeatures = new Set(symptoms.map(({ feature }) => feature));

function getSymptomLabel(feature) {
  const labels = {
    "spotting_ urination": "Spotting during urination",
    cold_hands_and_feets: "Cold hands and feet",
    "extra_marital_contacts": "Sexual contact history",
    "foul_smell_of urine": "Foul-smelling urine",
    "dischromic _patches": "Discolored skin patches",
    "fluid_overload.1": "Fluid overload (additional model feature)",
  };

  if (labels[feature]) return labels[feature];

  return feature
    .replace(/\.(\d+)$/, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

for (const [category, features] of Object.entries(additionalSymptomsByCategory)) {
  for (const feature of features) {
    categorizedFeatures.add(feature);
    symptoms.push({
      feature,
      label: getSymptomLabel(feature),
      category,
    });
  }
}

const additionalGeneralSymptoms = [
  "muscle_wasting",
  "weight_gain",
  "anxiety",
  "cold_hands_and_feets",
  "mood_swings",
  "weight_loss",
  "restlessness",
  "irregular_sugar_level",
  "sunken_eyes",
  "sweating",
  "dehydration",
  "yellowing_of_eyes",
  "acute_liver_failure",
  "fluid_overload",
  "malaise",
  "neck_pain",
  "cramps",
  "bruising",
  "obesity",
  "swollen_legs",
  "swollen_blood_vessels",
  "puffy_face_and_eyes",
  "enlarged_thyroid",
  "brittle_nails",
  "swollen_extremeties",
  "excessive_hunger",
  "extra_marital_contacts",
  "drying_and_tingling_lips",
  "slurred_speech",
  "knee_pain",
  "hip_joint_pain",
  "muscle_weakness",
  "stiff_neck",
  "swelling_joints",
  "movement_stiffness",
  "spinning_movements",
  "loss_of_balance",
  "unsteadiness",
  "weakness_of_one_body_side",
  "internal_itching",
  "toxic_look_(typhos)",
  "depression",
  "irritability",
  "altered_sensorium",
  "red_spots_over_body",
  "abnormal_menstruation",
  "dischromic _patches",
  "watering_from_eyes",
  "increased_appetite",
  "family_history",
  "lack_of_concentration",
  "visual_disturbances",
  "receiving_blood_transfusion",
  "receiving_unsterile_injections",
  "coma",
  "history_of_alcohol_consumption",
  "fluid_overload.1",
  "prominent_veins_on_calf",
  "palpitations",
  "painful_walking",
];

for (const feature of additionalGeneralSymptoms) {
  if (categorizedFeatures.has(feature)) continue;

  symptoms.push({
    feature,
    label: getSymptomLabel(feature),
    category: "General",
  });
}

export const quickSymptoms = [
  { label: "Itching", feature: "itching" },
  { label: "Fever", feature: "mild_fever" },
  { label: "Headache", feature: "headache" },
  { label: "Stomach pain", feature: "stomach_pain" },
];

export const educationTopics = [
  {
    name: "Seasonal allergies",
    category: "Respiratory",
    overview: "Seasonal allergies are immune-system responses to airborne triggers such as pollen. Symptoms and triggers vary from person to person.",
    symptoms: "Sneezing, a runny or blocked nose, and itchy or watery eyes may occur.",
    prevention: "When practical, reduce exposure to known triggers and follow local pollen guidance. A clinician or pharmacist can discuss suitable options.",
    emergency: "Seek urgent care for severe breathing difficulty, fainting, or rapidly worsening symptoms.",
    lifestyle: "Track when symptoms occur and discuss persistent or disruptive symptoms with a healthcare professional.",
  },
  {
    name: "Common cold",
    category: "Respiratory",
    overview: "A common cold is a viral infection of the upper respiratory tract. Many different viruses can cause cold-like symptoms.",
    symptoms: "A runny or blocked nose, cough, sore throat, sneezing, and sometimes a mild fever.",
    prevention: "Wash hands regularly, avoid sharing personal items, and cover coughs and sneezes.",
    emergency: "Seek urgent care for significant difficulty breathing, chest pain, confusion, or severe dehydration.",
    lifestyle: "Rest and fluids may support comfort. Ask a clinician for advice if symptoms are severe, persistent, or concerning.",
  },
  {
    name: "Migraine",
    category: "Neurological",
    overview: "Migraine is a neurological condition that can cause recurring episodes of head pain and other symptoms.",
    symptoms: "Throbbing head pain, sensitivity to light or sound, nausea, and sometimes visual changes.",
    prevention: "A clinician can help identify individual triggers and discuss a suitable prevention plan.",
    emergency: "Sudden severe headache, new weakness, confusion, fainting, or trouble speaking requires immediate medical assessment.",
    lifestyle: "Regular sleep, meals, and hydration may support general wellbeing. Keep a symptom diary to discuss with a professional.",
  },
  {
    name: "Acid reflux",
    category: "Digestive",
    overview: "Acid reflux occurs when stomach contents flow back into the esophagus. Occasional symptoms can have many causes.",
    symptoms: "Heartburn, a sour taste, or discomfort after eating may occur.",
    prevention: "Notice personal food or activity triggers and discuss frequent symptoms with a healthcare professional.",
    emergency: "New or severe chest discomfort, especially with breathlessness, sweating, or faintness, needs urgent assessment.",
    lifestyle: "Smaller meals and avoiding lying down soon after eating may help some people; seek individualized clinical advice.",
  },
  {
    name: "Eczema",
    category: "Skin & Hair",
    overview: "Eczema describes several conditions that can cause dry, itchy, and inflamed skin. It is not contagious.",
    symptoms: "Dryness, itching, redness, and sometimes cracked or irritated skin.",
    prevention: "Avoid known irritants where possible and use skin-care products recommended for your needs.",
    emergency: "Seek prompt care for rapidly spreading redness, severe pain, fever with a skin change, or signs of infection.",
    lifestyle: "Gentle skin care and advice from a qualified professional can help manage recurring symptoms.",
  },
  {
    name: "Gastroenteritis",
    category: "Digestive",
    overview: "Gastroenteritis is irritation of the stomach and intestines, often associated with an infection.",
    symptoms: "Diarrhoea, stomach cramps, nausea, and vomiting may occur.",
    prevention: "Handwashing and safe food handling help reduce the spread of some causes.",
    emergency: "Seek urgent care for blood in vomit or stool, severe dehydration, confusion, or severe abdominal pain.",
    lifestyle: "Fluids are important. Contact a healthcare professional for advice, especially for young children or vulnerable people.",
  },
];

export const categories = ["All", "Skin & Hair", "Respiratory", "Digestive", "General", "Urinary", "Other"];
export const severityOptions = ["Mild", "Moderate", "Severe"];
export const durationOptions = ["Today", "1-3 days", "1+ week"];
