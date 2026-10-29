# MedGuide AI - Setup Guide

This guide covers local setup and running the web application on Windows using
PowerShell. The first-time setup script installs dependencies and starts the
development servers. You do not need to train either model to run the app;
the disease prediction model is included in the repository.

## 1. Install prerequisites

Install the following before continuing:

- **Python 3.11** and the Python Launcher for Windows (`py`).
- **Node.js LTS**, which includes npm.
- **Git**, if you plan to clone the repository.

Open a new PowerShell terminal after installing the prerequisites. Check that
the commands are available:

```powershell
py --version
node --version
npm --version
git --version
```

## 2. Get the project

If you already have the project folder, open PowerShell in that folder and
continue to the next section.

To clone the shared repository:

```powershell
git clone https://github.com/Amarhadpad/MedGuideAi.git
Set-Location MedGuideAi
```

Run the setup script from the repository root -- the directory containing
`package.json`, `backend`, `frontend`, and `model`.

## 3. First-time setup and start

Copy and paste this complete block into PowerShell from the repository root.
It checks the project location and required tools, creates the Python
environment if needed, installs Python and JavaScript dependencies, then
starts the development servers:

```powershell
$ErrorActionPreference = "Stop"

if (-not (Test-Path ".\backend\requirements.txt")) {
    throw "Run this script from the MedGuide AI repository root."
}
if (-not (Test-Path ".\model\disease_prediction_model.pkl")) {
    throw "The bundled disease model was not found at .\model\disease_prediction_model.pkl."
}
if (-not (Get-Command py -ErrorAction SilentlyContinue)) {
    throw "Python Launcher 'py' was not found. Install Python 3.11 and enable the launcher."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm was not found. Install Node.js LTS, then reopen PowerShell."
}

if (-not (Test-Path ".\venv\Scripts\python.exe")) {
    py -3.11 -m venv venv
    if ($LASTEXITCODE -ne 0) {
        throw "Could not create the Python 3.11 virtual environment."
    }
}

$pythonVersion = & ".\venv\Scripts\python.exe" -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"
if ([version]$pythonVersion -lt [version]"3.11") {
    throw "The project requires Python 3.11 or newer. The existing venv uses Python $pythonVersion; remove that venv and rerun this setup with Python 3.11 installed."
}

& ".\venv\Scripts\python.exe" -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    throw "Failed to upgrade pip."
}

& ".\venv\Scripts\python.exe" -m pip install -r ".\backend\requirements.txt"
if ($LASTEXITCODE -ne 0) {
    throw "Failed to install Python dependencies."
}

npm install
if ($LASTEXITCODE -ne 0) {
    throw "Failed to install JavaScript dependencies."
}

npm run dev
```

When Vite starts, open the URL printed in the terminal, usually
`http://localhost:5173`. The terminal runs both the Flask API and Vite; keep it
open while using the app. Press **Ctrl+C** in that terminal to stop both
servers.

## 4. Start the project later

After the one-time setup, open PowerShell in the repository root and run:

```powershell
npm run dev
```

The Python virtual environment and npm dependencies are reused.

## 5. Build and run the production frontend locally

To build the React frontend and serve it through Flask:

```powershell
npm run build
.\venv\Scripts\python.exe backend\app.py
```

Open `http://127.0.0.1:5000`. Stop Flask with **Ctrl+C**.

## 6. Troubleshooting

### `py -3.11` cannot find Python

Install Python 3.11 and enable the Python Launcher for Windows. If an existing
`venv` was created with an older or unsupported interpreter, remove only that
project's `venv` folder and rerun the setup block.

### `npm` or `node` is not recognized

Install Node.js LTS, close and reopen PowerShell, and check `node --version`
and `npm --version`.

### Port 5000 or 5173 is already in use

Stop the other development server using that port, then run `npm run dev`
again. Vite may choose a nearby available port and prints its URL in the
terminal.

### A prediction request fails

Check that both server processes started successfully in the terminal and
review the Flask output there. The development Vite server forwards
`/predict` requests to Flask on `127.0.0.1:5000`.

### Health and account notes

The current app is a guest-accessible educational prototype. Doctor/patient
accounts are not implemented. Prediction results are not diagnoses, and the
prototype should not be used in place of professional medical care.
