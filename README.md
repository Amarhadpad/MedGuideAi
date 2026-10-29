## MedGuide AI-Intelligent Medical Referral and Recommendation System

MedGuide AI is a machine-learning based project designed to predict a possible disease from selected symptoms and provide medical-system and specialist recommendations.

The project is being developed as a multi-stage system using Machine Learning, Python, Flask, and a web-based frontend.

## Setup (Windows)

See the [Windows setup guide](docs/SETUP_GUIDE.md) for prerequisites and a
copy-paste PowerShell script that installs dependencies and starts the
application. For later runs, open PowerShell in the repository root and run
`npm run dev`. The pre-trained model is included, so model training is not
required for normal use. Assessment history is saved in browser storage on the
current device.

The previous static frontend remains available at `/legacy.html`. It includes the project roadmap and the earlier Model 1 interface.

## Project structure

```text
backend/
  app.py
  requirements.txt
frontend/
  public/       # Static assets, including the legacy frontend
  src/          # React application
  package.json
  vite.config.js
datasets/       # Source and processed datasets
model/          # Trained model files
scripts/        # Data preparation and model scripts
```

## Project documentation

- [Project requirements](docs/PROJECT_REQUIREMENTS.md) - user, functional,
  non-functional, and setup requirements.
- [Project report](docs/PROJECT_REPORT.md) - architecture, data/model
  workflow, API, setup, current limitations, and future work.
- [Setup guide](docs/SETUP_GUIDE.md) - Windows prerequisites, copy-paste
  terminal setup script, run instructions, and troubleshooting.
- [Python dependency file](backend/requirements.txt) - packages needed by the
  Flask API and bundled model.

## Project Objectives

The main objectives of MedGuide AI are:

- Predict a possible disease based on selected symptoms.
- Provide the top disease predictions with confidence values.
- Recommend a primary medical system based on the prediction.
- Provide specialist recommendations.
- Provide complementary recommendations such as yoga-based practices where applicable.
- Provide explainable information about the prediction.
- Develop a simple web interface for users.

---

## System Architecture

The planned MedGuide AI pipeline is:

User Symptoms
      ↓
Data Preprocessing
      ↓
Model 1: Disease Prediction
      ↓
Predicted Disease
      ↓
Model 2: Medical System Recommendation
      ↓
Specialist Recommendation
      ↓
Complementary Recommendation

## Nearby-care search and project roadmap

The React frontend provides a nearby-care search. Choose a care type and allow browser location access to prepare Google Maps results; coordinates are shared with Google Maps only after you open the results. This is a map search, not a verified provider directory or appointment service. The legacy frontend's 13-item roadmap reflects the statuses provided for this project and does not imply that pending items are implemented. The current backend provides disease prediction only; medical-system referrals and a Gemini second opinion are not connected.
