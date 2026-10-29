# MedGuide AI - Project Requirements

## 1. Purpose

MedGuide AI is an educational web prototype for selecting symptoms and viewing a
machine-learning estimate. It is not a clinical diagnostic or treatment system.
This document describes the current requirements and the boundary between
implemented and planned functionality.

## 2. Stakeholders and users

- **Guest / general user:** can use the current web application without an
  account.
- **Patient:** a potential future account role; patient accounts and
  patient-specific data are not currently implemented.
- **Doctor / healthcare professional:** a potential future account role;
  doctor accounts, credential verification, and clinician tools are not
  currently implemented.
- **Project maintainer:** installs dependencies, starts the services, and
  optionally prepares datasets or trains models.

## 3. Functional requirements

### Implemented

| ID | Requirement | Current behavior |
|---|---|---|
| FR-01 | The application shall provide a browser-based user interface. | React single-page application served by Vite in development and Flask for a production build. |
| FR-02 | The user shall be able to browse, search, and select symptoms. | Symptoms are grouped into categories and sent as model feature names. |
| FR-03 | The user shall be able to provide severity and duration context. | These values appear in the review and result summaries; they are not currently model inputs. |
| FR-04 | The user shall be able to review selections before requesting an estimate. | The assessment presents symptom, details, and review steps. |
| FR-05 | The API shall accept symptom input and return an estimate. | `POST /predict` returns the primary class, score, top three classes, and matched/unmatched symptom lists. |
| FR-06 | The interface shall explain that model results are not a diagnosis. | Medical disclaimer and model-score explanation are displayed. |
| FR-07 | The interface shall warn on selected predefined urgent symptoms. | Alerts are shown for chest pain, breathlessness, coma, and altered sensorium. |
| FR-08 | The user shall be able to save and manage assessment history locally. | History uses browser `localStorage`; users can inspect, delete, or clear saved records. |
| FR-09 | The user shall be able to browse general health education content. | The current content is a small static frontend library. |
| FR-10 | The user shall be able to search nearby care. | The browser may request location and prepares a Google Maps search link; it is not a provider directory. |
| FR-11 | Guests shall be able to use the current app without signing in. | No authentication is required or implemented. |

### Not implemented / future scope

| ID | Requirement | Status |
|---|---|---|
| FR-12 | Doctor and patient registration, login, and role-based access | Not implemented; no auth provider or user database is configured. |
| FR-13 | Doctor credential verification or doctor-only features | Not implemented. |
| FR-14 | Medical-system, specialist, or yoga recommendations in the web prediction flow | Recommendation model and data files exist, but the current Flask API does not connect them to predictions. |
| FR-15 | AI/Gemini second opinion | Not configured or connected. |
| FR-16 | Server-side user accounts or cloud-synchronized assessment history | Not implemented; assessment history is stored only in the current browser. |
| FR-17 | Verified local provider listings or appointment booking | Not implemented. |

## 4. Non-functional requirements

- **Platform:** Windows setup is documented; Python 3.11 or newer and a
  compatible Node.js/npm installation are expected.
- **Python dependencies:** install with `python -m pip install -r
  backend/requirements.txt`.
- **Frontend dependencies:** install with `npm install` from the repository root.
- **Usability:** support a responsive browser UI, symptom search, category
  filters, keyboard-visible focus, and clear medical disclaimers.
- **Data handling:** current assessment history remains in browser storage on
  the device. It is not linked to an account or synchronized with a server.
- **Privacy:** nearby search coordinates are used to construct a Google Maps
  link; they are shared with Google Maps if the user opens that link.
- **Reliability:** prediction input must include JSON with a non-empty
  `symptoms` list. The API reports errors as JSON.
- **Safety:** predictions are educational estimates only. The app must not
  present them as confirmed diagnoses or as a substitute for professional care.
- **Deployment:** Flask's built-in server is for local development. A
  production deployment requires an appropriate WSGI server, HTTPS, secure
  configuration, and deployment-specific testing.

## 5. Software and hardware prerequisites

- Windows 10/11 or another OS with compatible Python and Node.js runtimes.
- Python 3.11 or newer.
- Node.js and npm (versions compatible with the Vite version in the lockfile).
- Internet access is needed for dependency installation and third-party Google
  Fonts / Google Maps use; local prediction uses the bundled model.
- Enough disk space for Python/Node dependencies, datasets, and the bundled
  model files.

## 6. Acceptance checks

1. `npm install` succeeds at the repository root.
2. `npm run build` succeeds at the repository root.
3. `npm run dev` starts the Vite frontend and Flask API together.
4. The assessment can be completed through symptom selection, details, review,
   and result display.
5. `POST /predict` with a valid symptom returns a successful prediction
   response.
6. An empty symptom list returns a client error; invalid request bodies never
   produce a successful prediction.
7. The result view identifies the estimate as non-diagnostic and explains the
   model score.
8. A guest can use the app without an account; login is not an acceptance
   requirement for the current prototype.

## 7. Dependency manifest

The Python runtime dependencies are defined in
[`../backend/requirements.txt`](../backend/requirements.txt). Frontend runtime
and build dependencies are declared in [`../package.json`](../package.json),
[`../frontend/package.json`](../frontend/package.json), and pinned by
[`../package-lock.json`](../package-lock.json).
