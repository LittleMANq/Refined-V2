/* ============================================================
   REFINED — gallery: all screens in device frames
   ============================================================ */
const { useState: useGS } = React;

const STATUS = (
  <div style={{ position: "absolute", top: 0, insetInline: 0, height: 54, display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 30px", zIndex: 50, pointerEvents: "none" }}>
    <span style={{ fontSize: 15, fontWeight: 600 }}>9:41</span>
    <div style={{ display: "flex", gap: 6, alignItems: "center", opacity: 0.85 }}>
      <svg width="18" height="12" viewBox="0 0 18 12"><g fill="#1B1714"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4" width="3" height="8" rx="1"/><rect x="10" y="1.5" width="3" height="10.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35"/></g></svg>
      <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="3" fill="none" stroke="#1B1714" strokeOpacity="0.5"/><rect x="2" y="2" width="15" height="8" rx="1.5" fill="#1B1714"/><rect x="21.5" y="4" width="1.5" height="4" rx="0.75" fill="#1B1714" opacity="0.5"/></svg>
    </div>
  </div>
);

function Frame({ comp, label, scale = 0.62 }) {
  const [store, setStore] = useGS({
    gender: "w", contexts: ["work", "evening"], archetypes: ["quiet", "minimal"],
    taste: "sharp", fit: "tailored", closetCount: 5,
  });
  const app = { get: (k) => store[k], set: (k, v) => setStore((s) => ({ ...s, [k]: v })) };
  const Comp = window[comp];
  const noop = () => {};
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em", color: "#6E665C" }}>{label}</div>
      <div style={{ width: 390 * scale, height: 844 * scale }}>
        <div style={{
          width: 390, height: 844, borderRadius: 52, background: "var(--paper)", overflow: "hidden",
          position: "relative", boxShadow: "0 2px 6px rgba(27,23,20,0.10), 0 36px 80px -30px rgba(27,23,20,0.45)",
          border: "1px solid rgba(27,23,20,0.06)", transform: `scale(${scale})`, transformOrigin: "top left",
        }}>
          {STATUS}
          <div dir="rtl" style={{ position: "absolute", inset: 0, paddingTop: 44, display: "flex", flexDirection: "column" }}>
            <Comp next={noop} back={noop} go={noop} app={app} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ONBOARDING = [
  ["ScreenIntro", "01 · פתיחה"],
  ["ScreenContext", "02 · הקשר"],
  ["ScreenArchetype", "03 · ארכיטיפ"],
  ["ScreenCapture", "04 · צילום"],
  ["ScreenAnalysis", "05 · ניתוח · אנימציה"],
  ["ScreenReview", "05b · סקירת פריטים"],
  ["ScreenTaste", "06 · טעם"],
  ["ScreenReveal", "07 · זהות הסטייל"],
  ["ScreenSignup", "08 · הרשמה"],
  ["ScreenPermissions", "09 · התראות"],
];
const APP_SCREENS = [
  ["ScreenToday", "10 · היום"],
  ["ScreenLook", "12 · לוק · נימוק"],
  ["ScreenChat", "13 · סטייליסט"],
  ["ScreenProfile", "14 · פרופיל"],
  ["ScreenCloset", "11 · הארון"],
];
const STATE_SCREENS = [
  ["ScreenAddSheet", "הוספה לארון"],
  ["ScreenPiece", "פריט בודד"],
  ["ScreenPaywall", "Refined Plus"],
  ["ScreenEmpty", "ארון ריק"],
  ["ScreenLoading", "טעינה"],
  ["ScreenError", "שגיאת ניתוח"],
];

function Section({ title, sub, items }) {
  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 34, paddingInlineStart: 4 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 30, color: "var(--ink)" }}>{title}</h2>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--secondary)" }}>{sub}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "44px 36px" }}>
        {items.map(([comp, label]) => <Frame key={comp + label} comp={comp} label={label} />)}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <div dir="rtl" style={{ minHeight: "100vh", padding: "56px 48px 80px", maxWidth: 1280, margin: "0 auto" }}>
      <header style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 22 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--gold)" }} />
          <span style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 21, letterSpacing: "0.02em" }}>Refined</span>
        </div>
        <h1 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 46, lineHeight: 1.05, maxWidth: 640 }}>
          סטייליסט אישי. כל המסכים.
        </h1>
        <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--secondary)", maxWidth: 540 }}>
          זרימת אונבורדינג מלאה ומסכים פעילים, בעברית ומימין לשמאל. כל מסך חי וניתן ללחיצה. לחוויה המלאה עם המעברים והאנימציות, פתחו את האב טיפוס.
        </p>
        <a href="Refined.html" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, height: 48, padding: "0 26px",
          borderRadius: 999, background: "var(--ink)", color: "var(--paper)", textDecoration: "none", fontWeight: 500, fontSize: 15 }}>
          פתחו את האב טיפוס האינטראקטיבי
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
        </a>
      </header>
      <Section title="אונבורדינג" sub="onboarding flow" items={ONBOARDING} />
      <Section title="האפליקציה" sub="logged in" items={APP_SCREENS} />
      <Section title="מצבים ומסכים" sub="states & secondary" items={STATE_SCREENS} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Gallery />);
