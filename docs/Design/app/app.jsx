/* ============================================================
   REFINED — app shell: phone, flow router, transitions
   ============================================================ */
const { useState: useS, useEffect: useE, useRef: useR } = React;

const FLOW = [
  { id: "intro",       comp: "ScreenIntro" },
  { id: "context",     comp: "ScreenContext" },
  { id: "archetype",   comp: "ScreenArchetype" },
  { id: "capture",     comp: "ScreenCapture" },
  { id: "analysis",    comp: "ScreenAnalysis" },
  { id: "review",      comp: "ScreenReview" },
  { id: "taste",       comp: "ScreenTaste" },
  { id: "reveal",      comp: "ScreenReveal" },
  { id: "signup",      comp: "ScreenSignup" },
  { id: "permissions", comp: "ScreenPermissions" },
];
const NAMED = { today: "ScreenToday", closet: "ScreenCloset", chat: "ScreenChat", me: "ScreenProfile", look: "ScreenLook",
  addsheet: "ScreenAddSheet", piece: "ScreenPiece", paywall: "ScreenPaywall", empty: "ScreenEmpty", loading: "ScreenLoading", error: "ScreenError" };
const LABELS = {
  intro: "01 · פתיחה", context: "02 · הקשר", archetype: "03 · ארכיטיפ",
  capture: "04 · צילום", analysis: "05 · ניתוח", review: "05b · סקירת פריטים", taste: "06 · טעם",
  reveal: "07 · זהות הסטייל", signup: "08 · הרשמה", permissions: "09 · התראות",
  today: "10 · היום", closet: "11 · הארון",
  look: "12 · לוק", chat: "13 · סטייליסט", me: "14 · פרופיל",
  addsheet: "הוספה לארון", piece: "פריט", paywall: "Refined Plus", empty: "ארון ריק", loading: "טעינה", error: "שגיאה",
};

function App() {
  const [screen, setScreen] = useS(() => {
    const s = localStorage.getItem("refined.screen");
    return s !== null ? (isNaN(+s) ? s : +s) : 0;
  });
  const [store, setStore] = useS({});
  const app = {
    get: (k) => store[k],
    set: (k, v) => setStore((s) => ({ ...s, [k]: v })),
  };
  useE(() => { localStorage.setItem("refined.screen", String(screen)); }, [screen]);

  const goIndex = (i) => setScreen(Math.max(0, Math.min(FLOW.length - 1, i)));
  const next = () => {
    if (typeof screen === "number") {
      if (screen >= FLOW.length - 1) setScreen("today");
      else goIndex(screen + 1);
    }
  };
  const back = () => {
    if (typeof screen === "number") goIndex(screen - 1);
    else setScreen(9); // back from today → permissions
  };
  const go = (target) => setScreen(target);

  // resolve current component
  let compName, currentId;
  if (typeof screen === "number") { compName = FLOW[screen].comp; currentId = FLOW[screen].id; }
  else { compName = NAMED[screen]; currentId = screen; }
  const Comp = window[compName];

  // phone scaling
  const [scale, setScale] = useS(1);
  useE(() => {
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 150) / 844, (window.innerWidth - 32) / 390);
      setScale(Math.max(0.4, s));
    };
    fit(); window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const flowKeys = Object.keys(LABELS);
  const flowIdx = flowKeys.indexOf(currentId);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(120% 90% at 50% 0%, #EFEAE2 0%, #E6DFD4 100%)", padding: "20px 0" }}>

      {/* device */}
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center top" }}>
        <div style={{
          width: 390, height: 844, borderRadius: 52, background: "var(--paper)", overflow: "hidden",
          position: "relative", boxShadow: "0 2px 6px rgba(27,23,20,0.10), 0 40px 90px -30px rgba(27,23,20,0.5)",
          border: "1px solid rgba(27,23,20,0.06)",
        }}>
          {/* status bar (minimal, bare-screen mode) */}
          <div style={{ position: "absolute", top: 0, insetInline: 0, height: 54, display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 30px", zIndex: 50, pointerEvents: "none" }}>
            <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--sans)" }}>9:41</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center", opacity: 0.85 }}>
              <svg width="18" height="12" viewBox="0 0 18 12"><g fill="var(--ink)"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4" width="3" height="8" rx="1"/><rect x="10" y="1.5" width="3" height="10.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35"/></g></svg>
              <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="3" fill="none" stroke="var(--ink)" strokeOpacity="0.5"/><rect x="2" y="2" width="15" height="8" rx="1.5" fill="var(--ink)"/><rect x="21.5" y="4" width="1.5" height="4" rx="0.75" fill="var(--ink)" opacity="0.5"/></svg>
            </div>
          </div>

          {/* screen content */}
          <div key={String(screen)} dir="rtl" className="screen-enter" style={{ position: "absolute", inset: 0, paddingTop: 44, display: "flex", flexDirection: "column" }}>
            {Comp ? <Comp next={next} back={typeof screen === "number" && screen > 0 ? back : (NAMED[screen] ? back : null)} app={app} go={go} /> : null}
          </div>
        </div>
      </div>

      {/* external chrome — outside the device */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
        <button onClick={() => typeof screen === "number" ? goIndex(screen - 1) : setScreen(9)} className="nav-btn" aria-label="הקודם">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7"/></svg>
        </button>
        <div style={{ minWidth: 150, textAlign: "center", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em", color: "#6E665C" }}>
          {LABELS[currentId] || currentId}
        </div>
        <button onClick={next} className="nav-btn" aria-label="הבא">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <button onClick={() => setScreen(0)} className="nav-btn" aria-label="התחלה מחדש" style={{ marginInlineStart: 4 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 1 2.3 5.6"/><path d="M4 20v-5h5"/></svg>
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
