## MedGuide AI-Intelligent Medical Referral and Recommendation System

MedGuide AI is a machine-learning based project designed to predict a possible disease from selected symptoms and provide medical-system and specialist recommendations.

The project is being developed as a multi-stage system using Machine Learning, Python, Flask, and a web-based frontend.

## Setup (Windows)

Python 3.11 or newer is required. From the project root, create a virtual environment and install the dependencies:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
npm install
```

Build the web frontend:

```powershell
npm run build
```

Start the complete web application from the project root:

```powershell
python backend/app.py
```

Open `http://127.0.0.1:5000`. Flask serves both the built React frontend and the prediction API, so only one server is needed to use the application.

For frontend development with Vite hot reload, run both servers together:

```powershell
npm run dev
```

`npm run dev` starts Flask and Vite together. Open the local URL printed by Vite (normally `http://localhost:5173`); Vite proxies prediction requests to Flask. Press `Ctrl+C` to stop both servers. The pre-trained model is included, so model training is not required for normal use. Assessment history is saved in browser storage on the current device.

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
