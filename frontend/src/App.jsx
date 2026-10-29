import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  categories,
  educationTopics,
  quickSymptoms,
  severityOptions,
  symptoms,
  durationOptions,
} from "./data.js";

const API_URL = "/predict";
const HISTORY_KEY = "medguide-assessment-history";
const criticalSymptoms = new Set(["chest_pain", "breathlessness", "coma", "altered_sensorium"]);

function Icon({ name, className = "h-5 w-5" }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5h6a1.5 1.5 0 0 0-3-1 1.5 1.5 0 0 0-3 1ZM9 11h6M9 15h6" /></>,
    history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h8" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    alert: <><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3ZM19 14l1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
    heart: <><path d="M20.8 8.6c0 5.3-8.8 11-8.8 11s-8.8-5.7-8.8-11A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" /><path d="M4 12h4l2-3 3.5 6 2-3H20" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name] || paths.heart}
    </svg>
  );
}

function Brand({ inverse = false }) {
  return (
    <Link aria-label="MedGuide AI home" className="flex shrink-0 items-center gap-2.5" to="/">
      <span className={`grid h-10 w-10 place-items-center rounded-[14px] ${inverse ? "bg-white/10 text-[#7bd0c5]" : "bg-[#e2f4f1] text-med-teal"}`}>
        <Icon className="h-6 w-6" name="heart" />
      </span>
      <span className={`font-display text-[17px] font-extrabold tracking-[-0.04em] ${inverse ? "text-white" : "text-med-navy"}`}>
        MedGuide <span className={inverse ? "text-[#7bd0c5]" : "text-med-teal"}>AI</span>
      </span>
    </Link>
  );
}

function Header() {
  const links = [
    { to: "/", label: "Home", icon: "home", end: true },
    { to: "/assessment", label: "Assessment", icon: "clipboard" },
    { to: "/history", label: "History", icon: "history" },
    { to: "/education", label: "Education", icon: "book" },
  ];

  return (
    <header className="no-print sticky top-0 z-30 border-b border-[#e4eeee] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1000px] items-center justify-between gap-5 px-4 sm:px-7">
        <Brand />
        <nav aria-label="Main navigation" className="flex items-center gap-1 overflow-x-auto sm:gap-2">
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition sm:px-3.5 ${
                  isActive ? "bg-[#e5f4f2] text-med-teal-dark" : "text-[#6b8088] hover:bg-[#f1f7f6] hover:text-med-navy"
                }`
              }
              end={end}
              key={to}
              to={to}
            >
              <Icon className="h-4 w-4" name={icon} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-med-teal">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.045em] text-med-navy sm:text-[38px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b8088]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <section className={`rounded-3xl border border-[#e4eeee] bg-white p-5 shadow-[0_8px_28px_rgba(11,49,70,0.055)] sm:p-6 ${className}`}>{children}</section>;
}

function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#f1ddb1] bg-[#fff8e9] p-4 text-sm leading-6 text-[#6c5627]">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#b77b13]" name="shield" />
      <p><strong>Medical disclaimer:</strong> Statistical estimates and health information are for educational purposes only and are not a clinical diagnosis. Seek professional medical advice for health concerns.</p>
    </div>
  );
}

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (!Array.isArray(saved)) throw new Error("Saved assessment history is not in the expected format.");
    return { records: saved, error: "" };
  } catch (error) {
    return { records: [], error: `Assessment history could not be loaded: ${error.message}` };
  }
}

function App() {
  const initialHistory = useMemo(loadHistory, []);
  const [history, setHistory] = useState(initialHistory.records);
  const [selected, setSelected] = useState([]);
  const [severity, setSeverity] = useState("Moderate");
  const [duration, setDuration] = useState("Today");
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState(initialHistory.error);
  const [loading, setLoading] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [nearbyQuery, setNearbyQuery] = useState("doctor");
  const [nearbyStatus, setNearbyStatus] = useState("");
  const [nearbyUrl, setNearbyUrl] = useState("");
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      setNotice(`Assessment history could not be saved in this browser: ${error.message}`);
    }
  }, [history]);

  function toggleSymptom(feature) {
    setSelected((current) =>
      current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature],
    );
  }

  function startQuickAssessment(feature) {
    setSelected((current) => current.includes(feature) ? current : [...current, feature]);
    navigate("/assessment");
  }

  async function analyzeSymptoms() {
    if (!selected.length) return;
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || `Prediction request failed (${response.status}).`);
      }

      const assessment = {
        ...payload,
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        symptoms: [...selected],
        severity,
        duration,
      };
      setResult(assessment);
      navigate("/result");
    } catch (error) {
      setNotice(`Unable to analyze symptoms. ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function saveAssessment(assessment) {
    if (!assessment) return;
    setHistory((current) => [assessment, ...current.filter((item) => item.id !== assessment.id)]);
    setNotice("Assessment saved to this browser's history.");
  }

  function openNearby() {
    setNearbyQuery("doctor");
    setNearbyStatus("Your location is requested only after you choose “Use my location”.");
    setNearbyUrl("");
    setNearbyOpen(true);
  }

  function searchNearby() {
    const query = nearbyQuery.trim();
    if (!query) {
      setNearbyStatus("Enter a care type to search, such as doctor, hospital, or clinic.");
      return;
    }
    if (!navigator.geolocation) {
      setNearbyStatus("Location is unavailable in this browser. You can still search Google Maps near you.");
      setNearbyUrl(`https://www.google.com/maps/search/?api=1&${new URLSearchParams({ query: `${query} near me` })}`);
      return;
    }

    setNearbyLoading(true);
    setNearbyStatus("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const search = `${query} near ${coords.latitude},${coords.longitude}`;
        setNearbyUrl(`https://www.google.com/maps/search/?api=1&${new URLSearchParams({ query: search })}`);
        setNearbyStatus("Google Maps will receive your location when you open the results.");
        setNearbyLoading(false);
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. You can still search Google Maps near you.",
          2: "Your location could not be determined. You can still search Google Maps near you.",
          3: "The location request timed out. You can still search Google Maps near you.",
        };
        setNearbyStatus(messages[error.code] || `Unable to get your location: ${error.message}`);
        setNearbyUrl(`https://www.google.com/maps/search/?api=1&${new URLSearchParams({ query: `${query} near me` })}`);
        setNearbyLoading(false);
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 },
    );
  }

  function deleteAssessment(id) {
    setHistory((current) => current.filter((item) => item.id !== id));
  }

  function clearHistory() {
    if (history.length && window.confirm("Clear all saved assessments from this browser?")) {
      setHistory([]);
      setNotice("Assessment history cleared.");
    }
  }

  return (
    <div className="min-h-screen bg-med-canvas text-med-navy">
      <Header />
      <main className="mx-auto min-h-[calc(100vh-72px)] max-w-[1000px] px-4 pb-14 pt-7 sm:px-7 sm:pt-10">
        {notice && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-[#d6e8e4] bg-white px-4 py-3 text-sm text-med-navy" role="status">
            <span>{notice}</span>
            <button aria-label="Dismiss message" className="text-[#668087] hover:text-med-navy" onClick={() => setNotice("")}><Icon name="close" /></button>
          </div>
        )}
        <Routes>
          <Route
            element={
              <HomePage
                history={history}
                onNearby={openNearby}
                onQuickSelect={startQuickAssessment}
              />
            }
            path="/"
          />
          <Route
            element={
              <AssessmentPage
                duration={duration}
                loading={loading}
                onAnalyze={analyzeSymptoms}
                onDuration={setDuration}
                onSeverity={setSeverity}
                onToggle={toggleSymptom}
                selected={selected}
                severity={severity}
              />
            }
            path="/assessment"
          />
          <Route element={<ResultPage assessment={result} onNearby={openNearby} onSave={saveAssessment} />} path="/result" />
          <Route
            element={<HistoryPage history={history} onClear={clearHistory} onDelete={deleteAssessment} />}
            path="/history"
          />
          <Route element={<EducationPage />} path="/education" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
        <footer className="no-print mt-12 border-t border-[#e3ecec] pt-5 text-center text-xs leading-5 text-[#80939a]">
          MedGuide AI · Educational prototype · Not a substitute for professional medical care
        </footer>
      </main>
      {nearbyOpen && (
        <NearbyDialog
          loading={nearbyLoading}
          onClose={() => setNearbyOpen(false)}
          onSearch={searchNearby}
          query={nearbyQuery}
          setQuery={setNearbyQuery}
          status={nearbyStatus}
          url={nearbyUrl}
        />
      )}
    </div>
  );
}

function HomePage({ history, onNearby, onQuickSelect }) {
  const latest = history[0];
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-med-navy px-6 py-8 text-white shadow-[0_18px_45px_rgba(11,49,70,0.18)] sm:px-10 sm:py-10">
        <div aria-hidden="true" className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10 sm:right-6 sm:top-[-72px]">
          <div className="absolute inset-8 rounded-full border border-white/10" />
          <div className="absolute inset-16 rounded-full bg-[#168c8b]/20" />
        </div>
        <div className="relative max-w-[650px]">
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <Brand inverse />
            <span className="rounded-full border border-[#8bd2c8]/30 bg-[#168c8b]/20 px-3 py-1 text-[11px] font-bold tracking-wide text-[#9ce0d4]">
              <Icon className="mr-1 inline h-3.5 w-3.5" name="sparkles" /> AI powered
            </span>
          </div>
          <p className="mb-3 text-sm font-semibold text-[#9dd8d2]">A thoughtful first step toward understanding your health</p>
          <h1 className="max-w-[620px] font-display text-[34px] font-extrabold leading-[1.12] tracking-[-0.045em] text-white sm:text-[48px]">
            Make sense of your symptoms.
          </h1>
          <p className="mt-4 max-w-[530px] text-sm leading-6 text-[#c5d6dc] sm:text-base">
            Explore an AI-generated estimate based on symptoms you select, then use reliable health education to guide a conversation with a clinician.
          </p>
          <Link className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-med-teal px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#1b9b99]" to="/assessment">
            Start new assessment <Icon name="arrow" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="quick-select-title">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-med-teal">Get started</p>
            <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-med-navy" id="quick-select-title">Quick select</h2>
          </div>
          <Link className="text-sm font-semibold text-med-teal hover:text-med-teal-dark" to="/assessment">Browse all symptoms</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickSymptoms.map(({ label, feature }) => (
            <button className="flex shrink-0 items-center gap-2 rounded-full border border-[#d7e7e5] bg-white px-4 py-2.5 text-sm font-semibold text-[#47616a] shadow-sm transition hover:border-med-teal hover:text-med-teal" key={feature} onClick={() => onQuickSelect(feature)}>
              <Icon className="h-4 w-4 text-med-teal" name="plus" /> {label}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Quick actions" className="grid gap-4 sm:grid-cols-2">
        <Link className="group flex items-center justify-between rounded-3xl border border-[#e4eeee] bg-white p-5 shadow-[0_8px_28px_rgba(11,49,70,0.055)] transition hover:-translate-y-0.5 hover:shadow-md" to="/history">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e6f4f2] text-med-teal"><Icon name="history" /></span>
            <span><span className="block font-display font-bold text-med-navy">Assessment history</span><span className="mt-1 block text-sm text-[#73878e]">{history.length} saved {history.length === 1 ? "record" : "records"}</span></span>
          </div>
          <Icon className="h-5 w-5 text-[#91a3a8] transition group-hover:translate-x-1 group-hover:text-med-teal" name="arrow" />
        </Link>
        <button className="group flex items-center justify-between rounded-3xl border border-[#f1e2d0] bg-white p-5 text-left shadow-[0_8px_28px_rgba(11,49,70,0.055)] transition hover:-translate-y-0.5 hover:shadow-md" onClick={onNearby}>
          <span className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff3e4] text-med-amber"><Icon name="pin" /></span>
            <span><span className="block font-display font-bold text-med-navy">Find nearby doctors</span><span className="mt-1 block text-sm text-[#73878e]">Hospitals &amp; clinics</span></span>
          </span>
          <Icon className="h-5 w-5 text-[#91a3a8] transition group-hover:translate-x-1 group-hover:text-med-amber" name="arrow" />
        </button>
      </section>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-med-teal">Your activity</p>
            <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-med-navy">Recent assessment</h2>
          </div>
          <Link className="text-sm font-semibold text-med-teal hover:text-med-teal-dark" to="/history">View history</Link>
        </div>
        {latest ? (
          <Link className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f5f9f8] p-4 transition hover:bg-[#edf6f4]" to="/history">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-med-teal shadow-sm"><Icon name="heart" /></span>
              <div><p className="font-bold text-med-navy">{latest.disease}</p><p className="mt-1 text-xs text-[#72868d]">{new Date(latest.date).toLocaleDateString()} · {latest.symptoms.length} symptoms</p></div>
            </div>
            <span className="rounded-full bg-[#e2f4f1] px-3 py-1.5 text-sm font-bold text-med-teal-dark">{latest.confidence}% estimate</span>
          </Link>
        ) : (
          <div className="rounded-2xl bg-[#f5f9f8] px-4 py-5 text-sm text-[#73878e]">
            Your first assessment will appear here after you complete and save an analysis.
          </div>
        )}
      </Card>
      <Disclaimer />
    </div>
  );
}

function AssessmentPage({ selected, onToggle, severity, onSeverity, duration, onDuration, onAnalyze, loading }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [step, setStep] = useState(1);
  const filtered = useMemo(() => symptoms.filter((symptom) =>
    (category === "All" || symptom.category === category) &&
    `${symptom.label} ${symptom.feature} ${symptom.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [category, query]);
  const selectedItems = symptoms.filter((symptom) => selected.includes(symptom.feature));
  const urgentItems = selectedItems.filter((symptom) => criticalSymptoms.has(symptom.feature));
  const steps = ["Symptoms", "Details", "Review"];

  function changeStep(nextStep) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pb-28">
      <PageTitle
        eyebrow={`Step ${step} of ${steps.length} · ${steps[step - 1]}`}
        title="Symptom assessment"
        description={step === 1
          ? "Select all symptoms you are experiencing. This information is used to create an educational estimate."
          : step === 2
            ? "Add some context about how you feel. These details are saved with your assessment."
            : "Check your selections before submitting them for an educational estimate."}
      />
      <ol aria-label="Assessment progress" className="mb-6 grid grid-cols-3 gap-2">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const complete = stepNumber < step;
          const current = stepNumber === step;
          return (
            <li aria-current={current ? "step" : undefined} className={`rounded-2xl border px-3 py-3 text-center text-xs font-bold sm:text-sm ${current ? "border-med-teal bg-[#e7f5f2] text-med-teal-dark" : complete ? "border-[#cfe7e2] bg-white text-med-teal" : "border-[#e4eeee] bg-white text-[#82949a]"}`} key={label}>
              <span className="mr-1.5">{complete ? "✓" : stepNumber}</span>{label}
            </li>
          );
        })}
      </ol>
      <div className="space-y-5">
        {step === 1 && <>
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#dce9e8] bg-white px-4 shadow-sm focus-within:border-med-teal focus-within:ring-4 focus-within:ring-[#168c8b]/10">
          <Icon className="h-5 w-5 text-[#82979c]" name="search" />
          <input className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#94a4a8]" onChange={(event) => setQuery(event.target.value)} placeholder="Search symptoms..." type="search" value={query} />
          {query && <button aria-label="Clear search" className="text-[#82979c]" onClick={() => setQuery("")} type="button"><Icon className="h-4 w-4" name="close" /></button>}
        </label>

        {selectedItems.length > 0 && (
          <Card className="!p-4 sm:!p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-med-navy">Selected symptoms <span className="ml-1 text-[#83979b]">({selectedItems.length})</span></p>
              <button className="text-xs font-bold text-med-teal hover:text-med-teal-dark" onClick={() => selectedItems.forEach((item) => onToggle(item.feature))} type="button">Clear all</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e4f4f1] py-1.5 pl-3 pr-1.5 text-xs font-semibold text-med-teal-dark" key={item.feature}>
                  {item.label}<button aria-label={`Remove ${item.label}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-[#cce8e4]" onClick={() => onToggle(item.feature)} type="button"><Icon className="h-3 w-3" name="close" /></button>
                </span>
              ))}
            </div>
          </Card>
        )}

        {urgentItems.length > 0 && (
          <div className="flex gap-3 rounded-2xl border border-[#efc5c1] bg-[#fff0ef] p-4 text-med-red" role="alert">
            <Icon className="h-5 w-5 shrink-0" name="alert" />
            <div>
              <p className="text-sm font-bold">Possible emergency symptom selected</p>
              <p className="mt-1 text-sm leading-6">You selected {urgentItems.map(({ label }) => label.toLowerCase()).join(", ")}. If this is happening now, is severe, or is worsening, seek immediate medical help or contact your local emergency services. Do not wait for an app result.</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter symptoms by category">
          {categories.map((item) => (
            <button aria-selected={category === item} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${category === item ? "bg-med-teal text-white shadow-sm" : "border border-[#dce9e8] bg-white text-[#667d85] hover:border-med-teal hover:text-med-teal"}`} key={item} onClick={() => setCategory(item)} role="tab" type="button">{item}</button>
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-med-navy">{category === "All" ? "All symptoms" : category}</h2>
            <span className="text-xs text-[#85989e]">{filtered.length} available</span>
          </div>
          <div className="space-y-2">
            {filtered.map((symptom) => {
              const checked = selected.includes(symptom.feature);
              return (
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${checked ? "border-[#9ed2ce] bg-[#f0f9f7]" : "border-[#e4eeee] bg-white hover:border-[#bddbd8]"}`} key={symptom.feature}>
                  <input checked={checked} className="h-[18px] w-[18px] accent-med-teal" onChange={() => onToggle(symptom.feature)} type="checkbox" />
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-med-navy">{symptom.label}</span><span className="mt-0.5 block text-xs text-[#84969b]">{symptom.category}</span></span>
                  {checked && <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d9f0ec] text-med-teal"><Icon className="h-4 w-4" name="check" /></span>}
                </label>
              );
            })}
            {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbdcda] bg-white px-5 py-10 text-center text-sm text-[#73878e]">No symptoms match that search. Try another term.</div>}
          </div>
        </div>
        <Disclaimer />
        </>}

        {step === 2 && <>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectorCard label="How severe?" icon="alert" options={severityOptions} selected={severity} onChange={onSeverity} />
          <SelectorCard label="How long?" icon="clock" options={durationOptions} selected={duration} onChange={onDuration} />
        </div>
        <Card>
          <h2 className="font-display text-lg font-extrabold text-med-navy">Symptoms selected</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedItems.map(({ feature, label }) => <span className="rounded-full bg-[#e4f4f1] px-3 py-1.5 text-xs font-semibold text-med-teal-dark" key={feature}>{label}</span>)}
          </div>
          {urgentItems.length > 0 && <p className="mt-4 text-sm font-semibold leading-6 text-med-red">You selected a possible emergency symptom. Please seek urgent care if it is happening now or feels severe; don’t wait for an estimate.</p>}
        </Card>
        </>}

        {step === 3 && <>
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="font-display text-lg font-extrabold text-med-navy">Review your information</h2><p className="mt-1 text-sm text-[#71858b]">{selectedItems.length} {selectedItems.length === 1 ? "symptom" : "symptoms"} selected</p></div>
              <button className="text-sm font-bold text-med-teal hover:text-med-teal-dark" onClick={() => changeStep(1)} type="button">Edit symptoms</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedItems.map(({ feature, label }) => <span className="rounded-full bg-[#e4f4f1] px-3 py-1.5 text-xs font-semibold text-med-teal-dark" key={feature}>{label}</span>)}
            </div>
            <div className="mt-5 grid gap-3 border-t border-[#edf2f1] pt-4 sm:grid-cols-2">
              <p className="text-sm text-[#71858b]"><strong className="text-med-navy">Severity:</strong> {severity}</p>
              <p className="text-sm text-[#71858b]"><strong className="text-med-navy">Duration:</strong> {duration}</p>
            </div>
            <button className="mt-4 text-sm font-bold text-med-teal hover:text-med-teal-dark" onClick={() => changeStep(2)} type="button">Edit details</button>
          </Card>
          {urgentItems.length > 0 && (
            <div className="flex gap-3 rounded-2xl border border-[#efc5c1] bg-[#fff0ef] p-4 text-med-red" role="alert">
              <Icon className="h-5 w-5 shrink-0" name="alert" />
              <p className="text-sm leading-6"><strong>Possible emergency symptom:</strong> If {urgentItems.map(({ label }) => label.toLowerCase()).join(", ")} is happening now, is severe, or is worsening, seek immediate medical help. Do not wait for an app result.</p>
            </div>
          )}
          <Disclaimer />
        </>}
      </div>
      <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-[#e2eceb] bg-white/95 px-4 py-3 backdrop-blur sm:sticky sm:mt-5 sm:rounded-2xl sm:border sm:bg-white/95 sm:px-5">
        <div className="mx-auto flex max-w-[946px] items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#73878e]">{selected.length} selected</span>
          <div className="flex items-center gap-2">
            {step > 1 && <button className="min-h-11 rounded-full border border-[#cbdcda] bg-white px-5 text-sm font-bold text-med-navy transition hover:bg-[#f5f9f8]" disabled={loading} onClick={() => changeStep(step - 1)} type="button">Back</button>}
            {step < 3
              ? <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-med-teal px-6 text-sm font-bold text-white shadow-md transition hover:bg-med-teal-dark disabled:cursor-not-allowed disabled:opacity-45" disabled={!selected.length} onClick={() => changeStep(step + 1)} type="button">Next <Icon className="h-4 w-4" name="arrow" /></button>
              : <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-med-teal px-6 text-sm font-bold text-white shadow-md transition hover:bg-med-teal-dark disabled:cursor-not-allowed disabled:opacity-45" disabled={loading} onClick={onAnalyze} type="button">{loading ? "Analyzing..." : "Get educational estimate"} {!loading && <Icon className="h-4 w-4" name="arrow" />}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectorCard({ label, icon, options, selected, onChange }) {
  return (
    <Card className="!p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-med-navy"><Icon className="h-4 w-4 text-med-teal" name={icon} />{label}</p>
      <div className="flex gap-2">
        {options.map((option) => (
          <button aria-pressed={selected === option} className={`min-h-9 flex-1 rounded-full px-2 text-xs font-semibold transition ${selected === option ? "bg-[#e2f4f1] text-med-teal-dark ring-1 ring-[#9fd4cf]" : "bg-[#f4f8f7] text-[#71858b] hover:bg-[#eaf2f1]"}`} key={option} onClick={() => onChange(option)} type="button">{option}</button>
        ))}
      </div>
    </Card>
  );
}

function ResultPage({ assessment, onNearby, onSave }) {
  if (!assessment) {
    return (
      <div className="py-10 text-center">
        <Card className="mx-auto max-w-xl">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e5f4f2] text-med-teal"><Icon className="h-7 w-7" name="clipboard" /></span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-med-navy">No assessment to show</h1>
          <p className="mt-2 text-sm text-[#71858b]">Select symptoms and complete an assessment to see results here.</p>
          <Link className="mt-5 inline-flex rounded-full bg-med-teal px-5 py-3 text-sm font-bold text-white" to="/assessment">Start assessment</Link>
        </Card>
      </div>
    );
  }
  const isEmergency = assessment.symptoms.some((symptom) => criticalSymptoms.has(symptom));
  const alternatives = (assessment.top_predictions || []).filter((item) => item.disease !== assessment.disease).slice(0, 2);
  const confidence = Math.max(0, Math.min(Number(assessment.confidence) || 0, 100));
  const labels = assessment.symptoms.map((feature) => symptoms.find((item) => item.feature === feature)?.label || feature.replaceAll("_", " "));

  return (
    <div className="space-y-5">
      <PageTitle eyebrow="Your assessment" title="Prediction results" description="This model output is an estimate based on the symptoms you selected, not a confirmed diagnosis." />
      {isEmergency && (
        <div className="flex gap-3 rounded-3xl border border-[#efc5c1] bg-[#fff0ef] p-5 text-med-red" role="alert">
          <Icon className="h-6 w-6 shrink-0" name="alert" />
          <div><p className="font-display font-extrabold">Possible emergency symptom</p><p className="mt-1 text-sm leading-6">If the selected symptom is happening now, is severe, or is worsening, seek immediate medical help or contact your local emergency services. Do not delay care based on this app or its prediction.</p></div>
        </div>
      )}

      <Card className="print-card overflow-hidden !p-0">
        <div className="bg-med-teal px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white">Primary model prediction</div>
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#81949a]">Most likely estimate</p><h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-med-navy sm:text-3xl">{assessment.disease}</h2></div>
            <span className="rounded-full bg-[#e4f4f1] px-3 py-1.5 text-sm font-bold text-med-teal-dark">{confidence.toFixed(2)}%</span>
          </div>
          <div aria-label={`Confidence estimate ${confidence}%`} className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#e8f0ef]" role="img"><div className="h-full rounded-full bg-med-teal transition-all" style={{ width: `${confidence}%` }} /></div>
          <p className="mt-3 rounded-xl bg-[#f5f9f8] p-3 text-xs leading-5 text-[#71858b]">The percentage is the model’s score among its trained categories. It is not the probability that you have this condition, may not be calibrated, and cannot confirm or rule out a diagnosis.</p>
          <div className="mt-5 border-t border-[#edf2f1] pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#81949a]">Alternative differential candidates</p>
            {alternatives.length ? alternatives.map((item, index) => (
              <div className="flex items-center gap-3 border-b border-[#f0f4f3] py-3 last:border-0" key={`${item.disease}-${index}`}>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f1f6f5] text-xs font-bold text-[#71858b]">{index + 1}</span><span className="flex-1 text-sm font-semibold text-med-navy">{item.disease}</span><span className="text-sm font-bold text-[#71858b]">{item.confidence}%</span>
              </div>
            )) : <p className="text-sm text-[#71858b]">No alternative candidates were returned.</p>}
          </div>
        </div>
      </Card>

      <Card className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e8f3f5] text-med-navy"><Icon name="clipboard" /></span>
        <div><h2 className="font-display font-extrabold text-med-navy">Medical referral guidance</h2><p className="mt-1 text-sm leading-6 text-[#6e8289]">A medical-system or specialist recommendation is not available from the current prediction model. Discuss your symptoms with a licensed healthcare professional.</p></div>
      </Card>

      <Card>
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#e7f2fb] text-[#3173a3]"><Icon name="sparkles" /></span><div><h2 className="font-display font-extrabold text-med-navy">AI second opinion</h2><p className="text-xs text-[#82949a]">Optional service · not connected</p></div></div>
        <p className="mt-3 text-sm leading-6 text-[#6e8289]">A second-opinion service is not configured in this prototype. Do not rely on an automated estimate instead of professional medical advice.</p>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-display font-extrabold text-med-navy">Your input summary</h2><span className="text-xs text-[#82949a]">{new Date(assessment.date).toLocaleDateString()}</span></div>
        <div className="flex flex-wrap gap-2">{labels.map((label, index) => <span className="rounded-full bg-[#f2f7f6] px-3 py-1.5 text-xs font-semibold text-[#526c74]" key={`${label}-${index}`}>{label}</span>)}</div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#edf2f1] pt-3 text-sm text-[#71858b]"><span><strong className="text-med-navy">Severity:</strong> {assessment.severity}</span><span><strong className="text-med-navy">Duration:</strong> {assessment.duration}</span></div>
      </Card>
      <div className="no-print grid gap-3">
        <button className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-med-amber px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#bd6500]" onClick={onNearby}><Icon name="pin" /> Find nearby doctors</button>
        <button className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-med-teal px-5 text-sm font-bold text-white shadow-sm transition hover:bg-med-teal-dark" onClick={() => onSave(assessment)}><Icon name="check" /> Save assessment to history</button>
        <button className="min-h-12 rounded-full border border-[#cbdcda] bg-white px-5 text-sm font-bold text-med-navy transition hover:bg-[#f5f9f8]" onClick={() => window.print()}>Export PDF</button>
      </div>
      <Disclaimer />
    </div>
  );
}

function HistoryPage({ history, onClear, onDelete }) {
  const [active, setActive] = useState(null);
  return (
    <>
      <PageTitle
        action={history.length > 0 && <button className="text-sm font-bold text-med-teal hover:text-med-teal-dark" onClick={onClear}>Clear all</button>}
        description="Saved on this device only. Your assessments are not sent to an account."
        title="Assessment history"
      />
      {history.length ? (
        <div className="space-y-3">
          {history.map((item) => {
            const labels = item.symptoms.map((feature) => symptoms.find((row) => row.feature === feature)?.label || feature.replaceAll("_", " "));
            return (
              <article className="flex items-center gap-3 rounded-3xl border border-[#e4eeee] bg-white p-4 shadow-[0_8px_28px_rgba(11,49,70,0.04)] sm:gap-4 sm:p-5" key={item.id}>
                <button className="min-w-0 flex-1 text-left" onClick={() => setActive(item)}>
                  <span className="flex flex-wrap items-center gap-2"><span className="font-display font-extrabold text-med-navy">{item.disease}</span><span className="rounded-full bg-[#e4f4f1] px-2.5 py-1 text-xs font-bold text-med-teal-dark">{item.confidence}%</span></span>
                  <span className="mt-1 block text-xs text-[#81949a]">{new Date(item.date).toLocaleString()}</span>
                  <span className="mt-2 block truncate text-sm text-[#6e8289]">{labels.join(", ")}</span>
                </button>
                <button aria-label={`Delete ${item.disease} assessment`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#8a9ba0] transition hover:bg-[#fff0ef] hover:text-med-red" onClick={() => onDelete(item.id)}><Icon name="trash" /></button>
              </article>
            );
          })}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e5f4f2] text-med-teal"><Icon className="h-7 w-7" name="history" /></span>
          <h2 className="mt-4 font-display text-xl font-extrabold text-med-navy">No saved assessments yet</h2>
          <p className="mt-2 text-sm text-[#71858b]">Save a prediction to keep it here on this device.</p>
          <Link className="mt-5 inline-flex rounded-full bg-med-teal px-5 py-3 text-sm font-bold text-white" to="/assessment">Start an assessment</Link>
        </Card>
      )}
      {active && <AssessmentDialog assessment={active} onClose={() => setActive(null)} />}
    </>
  );
}

function AssessmentDialog({ assessment, onClose }) {
  const labels = assessment.symptoms.map((feature) => symptoms.find((item) => item.feature === feature)?.label || feature.replaceAll("_", " "));
  return (
    <Dialog onClose={onClose} title="Assessment details">
      <p className="font-display text-xl font-extrabold text-med-navy">{assessment.disease}</p>
      <p className="mt-1 text-sm text-[#71858b]">{new Date(assessment.date).toLocaleString()} · {assessment.confidence}% estimate</p>
      <h3 className="mt-5 text-sm font-bold text-med-navy">Symptoms</h3>
      <div className="mt-2 flex flex-wrap gap-2">{labels.map((label, index) => <span className="rounded-full bg-[#e4f4f1] px-3 py-1.5 text-xs font-semibold text-med-teal-dark" key={`${label}-${index}`}>{label}</span>)}</div>
      <div className="mt-4 rounded-2xl bg-[#f4f8f7] p-4 text-sm text-[#526c74]"><p><strong>Severity:</strong> {assessment.severity}</p><p className="mt-2"><strong>Duration:</strong> {assessment.duration}</p></div>
      <p className="mt-4 text-xs leading-5 text-[#82949a]">This saved estimate is for educational purposes only and is not a diagnosis.</p>
    </Dialog>
  );
}

function EducationPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);
  const topics = educationTopics.filter((topic) => `${topic.name} ${topic.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <PageTitle eyebrow="Learn & understand" title="Health education library" description="Clear, general information to support informed conversations with a healthcare professional." />
      <label className="mb-5 flex h-12 items-center gap-3 rounded-2xl border border-[#dce9e8] bg-white px-4 shadow-sm focus-within:border-med-teal focus-within:ring-4 focus-within:ring-[#168c8b]/10">
        <Icon className="h-5 w-5 text-[#82979c]" name="search" />
        <input className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#94a4a8]" onChange={(event) => setQuery(event.target.value)} placeholder="Search conditions or topics..." type="search" value={query} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <button className="group rounded-3xl border border-[#e4eeee] bg-white p-5 text-left shadow-[0_8px_28px_rgba(11,49,70,0.04)] transition hover:-translate-y-0.5 hover:border-[#b8dbd7] hover:shadow-md" key={topic.name} onClick={() => setActive(topic)}>
            <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#e6f4f2] text-med-teal"><Icon name="book" /></span><span className="rounded-full bg-[#f1f6f5] px-3 py-1 text-[11px] font-bold text-[#6b8088]">{topic.category}</span></div>
            <span className="mt-4 block font-display text-lg font-extrabold text-med-navy">{topic.name}</span>
            <span className="mt-2 block text-sm leading-6 text-[#71858b]">{topic.overview}</span>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-med-teal group-hover:text-med-teal-dark">Read overview <Icon className="h-4 w-4" name="arrow" /></span>
          </button>
        ))}
        {topics.length === 0 && <Card className="py-10 text-center text-sm text-[#71858b] sm:col-span-2">No topics match your search.</Card>}
      </div>
      <div className="mt-6"><Disclaimer /></div>
      {active && <EducationDialog onClose={() => setActive(null)} topic={active} />}
    </>
  );
}

function EducationDialog({ topic, onClose }) {
  const sections = [
    ["Overview", topic.overview, false],
    ["Common symptoms", topic.symptoms, false],
    ["Preventive measures", topic.prevention, false],
    ["When to seek emergency care", topic.emergency, true],
    ["General lifestyle advice", topic.lifestyle, false],
  ];
  return (
    <Dialog onClose={onClose} title={topic.name}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-med-teal">{topic.category}</p>
      <div className="mt-4 space-y-4">
        {sections.map(([heading, content, urgent]) => (
          <section className={`border-l-2 pl-4 ${urgent ? "border-med-red" : "border-[#c5e1dd]"}`} key={heading}>
            <h3 className={`font-display text-sm font-extrabold ${urgent ? "text-med-red" : "text-med-navy"}`}>{heading}</h3>
            <p className={`mt-1 text-sm leading-6 ${urgent ? "text-[#9d332d]" : "text-[#6e8289]"}`}>{content}</p>
          </section>
        ))}
      </div>
      <p className="mt-5 text-xs leading-5 text-[#82949a]">This overview is general education, not personalized medical advice. Speak with a qualified healthcare professional about your situation.</p>
    </Dialog>
  );
}

function Dialog({ title, children, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-[#092536]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section aria-labelledby="dialog-title" aria-modal="true" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7" role="dialog">
        <div className="mb-5 flex items-start justify-between gap-3"><h2 className="font-display text-xl font-extrabold text-med-navy" id="dialog-title">{title}</h2><button aria-label="Close dialog" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f2f7f6] text-[#687d84] hover:text-med-navy" onClick={onClose}><Icon name="close" /></button></div>
        {children}
      </section>
    </div>
  );
}

function NearbyDialog({ query, setQuery, onSearch, loading, status, url, onClose }) {
  return (
    <Dialog onClose={onClose} title="Find nearby healthcare">
      <p className="text-sm leading-6 text-[#6e8289]">Search Google Maps for doctors, hospitals, clinics, or another type of care. Your location is requested only when you choose to search.</p>
      <label className="mt-5 block text-xs font-bold text-med-navy" htmlFor="nearby-care-query">What are you looking for?</label>
      <input className="mt-2 h-12 w-full rounded-2xl border border-[#dce9e8] px-4 text-sm outline-none focus:border-med-teal focus:ring-4 focus:ring-[#168c8b]/10" id="nearby-care-query" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onSearch(); }} placeholder="e.g. cardiologist, clinic" value={query} />
      <button className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-med-amber px-5 text-sm font-bold text-white transition hover:bg-[#bd6500] disabled:opacity-60" disabled={loading} onClick={onSearch}>{loading ? "Requesting location..." : "Use my location"} <Icon name="pin" /></button>
      {status && <p className="mt-3 text-xs leading-5 text-[#71858b]" role="status">{status}</p>}
      {url && <a className="mt-4 flex min-h-11 items-center justify-center rounded-full border border-[#eed1ad] bg-[#fff8ef] px-4 text-sm font-bold text-[#a75b08] hover:bg-[#fff1dd]" href={url} rel="noreferrer" target="_blank">Open results in Google Maps ↗</a>}
      <p className="mt-4 text-xs leading-5 text-[#82949a]">Google Maps provides third-party results. Check provider details and availability directly. This is not a verified directory or appointment service.</p>
    </Dialog>
  );
}

function NotFoundPage() {
  return <Card className="py-12 text-center"><h1 className="font-display text-2xl font-extrabold text-med-navy">Page not found</h1><Link className="mt-4 inline-flex text-sm font-bold text-med-teal" to="/">Return home</Link></Card>;
}

export default App;
