/* ============================================================
   REFINED — screens batch 2
   04 capture · 05 item-extraction · 05b review · 06 taste
   ============================================================ */

/* ---------- 04 Photo capture ---------- */
function CaptureGuide() {
  const corner = (pos) => {
    const base = { position: "absolute", width: 24, height: 24, borderColor: "var(--gold)", borderStyle: "solid" };
    const m = {
      tl: { top: 16, left: 16, borderWidth: "2px 0 0 2px", borderTopLeftRadius: 7 },
      tr: { top: 16, right: 16, borderWidth: "2px 2px 0 0", borderTopRightRadius: 7 },
      bl: { bottom: 16, left: 16, borderWidth: "0 0 2px 2px", borderBottomLeftRadius: 7 },
      br: { bottom: 16, right: 16, borderWidth: "0 2px 2px 0", borderBottomRightRadius: 7 },
    };
    return <div style={{ ...base, ...m[pos] }} />;
  };
  return (
    <>
      {/* rule-of-thirds grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
        <div style={{ position: "absolute", top: "33.3%", insetInline: 0, height: 1, background: "var(--paper)" }} />
        <div style={{ position: "absolute", top: "66.6%", insetInline: 0, height: 1, background: "var(--paper)" }} />
        <div style={{ position: "absolute", left: "33.3%", insetBlock: 0, width: 1, background: "var(--paper)" }} />
        <div style={{ position: "absolute", left: "66.6%", insetBlock: 0, width: 1, background: "var(--paper)" }} />
      </div>
      {corner("tl")}{corner("tr")}{corner("bl")}{corner("br")}
      {/* refined body silhouette guide */}
      <svg viewBox="0 0 120 240" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.42 }}>
        <g fill="none" stroke="var(--paper)" strokeWidth="1.3" strokeDasharray="2.5 5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="60" cy="44" r="18" />
          <path d="M42 80 q18 -12 36 0 l8 18 -8 6 -2 64 q-22 9 -44 0 l-2 -64 -8 -6 z" />
          <line x1="50" y1="172" x2="48" y2="226" />
          <line x1="70" y1="172" x2="72" y2="226" />
        </g>
      </svg>
    </>
  );
}
function ScreenCapture({ next, back }) {
  const tips = ["גוף מלא בקדר", "תאורה טבעית", "רקע נקי"];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar onBack={back} step={3} total={7} />
      <ScreenBody style={{ padding: "22px 24px 0" }}>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>צילום</div>
        <h2 className="t-head" style={{ margin: 0, fontSize: 30 }}>תמונת גוף מלא</h2>
        <p className="t-subtitle" style={{ marginTop: 10, marginBottom: 20 }}>עמדו ישר, ידיים חופשיות. ככל שהתמונה ברורה יותר, הניתוח מדויק יותר.</p>

        <div style={{ position: "relative", margin: "0 auto", width: "100%", maxWidth: 286 }}>
          <div style={{ position: "relative", borderRadius: 26, overflow: "hidden", boxShadow: "var(--shadow-float)" }}>
            <Slot tone="ink" rounded={26} style={{ aspectRatio: "3 / 4.4", width: "100%" }}>
              <CaptureGuide />
              {/* status pill top */}
              <div style={{ position: "absolute", top: 14, insetInline: 0, display: "flex", justifyContent: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 12px", borderRadius: 99,
                  background: "rgba(27,23,20,0.5)", backdropFilter: "blur(6px)", color: "var(--paper)", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.08em" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--gold)" }} /> מצב גוף מלא
                </span>
              </div>
              {/* bottom hint on image */}
              <div style={{ position: "absolute", bottom: 14, insetInline: 0, textAlign: "center", color: "rgba(250,247,242,0.82)", fontSize: 11.5, fontWeight: 500 }}>
                עמדו במרכז המסגרת
              </div>
            </Slot>
          </div>
          {/* floating reference card */}
          <div style={{ position: "absolute", bottom: 20, left: -14, background: "#fff", borderRadius: 14, padding: 8, boxShadow: "var(--shadow-float)", display: "flex", alignItems: "center", gap: 8 }}>
            <Slot tone="tone-a" rounded={8} style={{ width: 30 }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="check" size={12} stroke="var(--gold)" />
                <span style={{ fontSize: 10.5, fontWeight: 600 }}>פוזה טובה</span>
              </div>
              <div className="t-mono" style={{ fontSize: 8, color: "var(--secondary)", marginTop: 2 }}>דוגמה</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {tips.map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 13px", borderRadius: 99,
              background: "var(--surface)", fontSize: 12.5, fontWeight: 500, color: "var(--ink)" }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--gold)" }} />{t}
            </span>
          ))}
        </div>
      </ScreenBody>
      <Footer>
        <Pill onClick={next}><Icon name="camera" size={20} stroke="var(--paper)" /> צלמו תמונה</Pill>
        <button className="pill pill--ghost" style={{ marginTop: 12 }} onClick={next}>
          <Icon name="gallery" size={20} /> בחרו מהגלריה
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 16, color: "var(--secondary)" }}>
          <Icon name="lock" size={15} stroke="var(--secondary)" />
          <span className="t-label-sm" style={{ color: "var(--secondary)" }}>התמונות נשארות פרטיות</span>
        </div>
      </Footer>
    </div>
  );
}

/* ---------- 05 Analysis loading — ITEM-EXTRACTION ANIMATION ---------- */
const PIECES = [
  { id: 1, label: "ז'קט",    tone: "tone-a", src: { top: 60,  left: 150 }, dst: { top: 12,  left: 6 },   hole: { top: 40,  left: 66 } },
  { id: 2, label: "חולצה",   tone: "tone-c", src: { top: 138, left: 158 }, dst: { top: 138, left: 0 },   hole: { top: 108, left: 74 } },
  { id: 3, label: "תיק",     tone: "tone-b", src: { top: 188, left: 122 }, dst: { top: 264, left: 8 },   hole: { top: 150, left: 36 } },
  { id: 4, label: "מכנסיים", tone: "tone-a", src: { top: 224, left: 154 }, dst: { top: 52,  left: 290 }, hole: { top: 196, left: 70 } },
  { id: 5, label: "נעליים",  tone: "tone-c", src: { top: 300, left: 150 }, dst: { top: 214, left: 294 }, hole: { top: 240, left: 66 } },
];
const PHASES = [
  "מיישרים את התמונה",
  "מנתחים פרופורציות וגובה",
  "קוראים את גוון העור",
  "מזהים את הפריטים שלבשתם",
  "מרכיבים את זהות הסטייל",
];
function ScreenAnalysis({ next }) {
  const [revealed, setRevealed] = useState(0);
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRevealed(0); setPhase(0); setDone(false);
    PHASES.forEach((_, i) => timers.current.push(setTimeout(() => setPhase(i), 350 + i * 900)));
    PIECES.forEach((_, i) => timers.current.push(setTimeout(() => setRevealed(i + 1), 900 + i * 760)));
    timers.current.push(setTimeout(() => setDone(true), 900 + PIECES.length * 760 + 500));
  }, []);

  useEffect(() => { run(); return () => timers.current.forEach(clearTimeout); }, [run]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "30px 24px 0", textAlign: "center" }}>
        <Wordmark size={16} />
      </div>

      {/* stage — fixed, centered composition */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 360, height: 392 }}>
          {/* center photo */}
          <div style={{ position: "absolute", top: 36, left: "50%", transform: "translateX(-50%)", width: 178, zIndex: 2 }}>
            <Slot tone="ink" rounded={20} style={{ width: 178, aspectRatio: "3 / 4.6" }} label="">
              {!done && <div className="scan-sweep" />}
              {/* region outlines appear as pieces lift */}
              {PIECES.map((pc, i) => i < revealed && (
                <div key={pc.id} style={{
                  position: "absolute", width: 46, height: 34, borderRadius: 8,
                  border: "1px dashed rgba(176,137,83,0.7)", opacity: 0.7,
                  top: pc.hole.top, left: pc.hole.left,
                  animation: "fade 0.5s both",
                }} />
              ))}
            </Slot>
          </div>

          {/* flying pieces */}
          {PIECES.map((pc, i) => {
            const out = i < revealed;
            return (
              <div key={pc.id} style={{
                position: "absolute", width: 66, borderRadius: 13, overflow: "hidden",
                top: out ? pc.dst.top : pc.src.top, left: out ? pc.dst.left : pc.src.left,
                transform: out ? "scale(1) rotate(0deg)" : "scale(0.45) rotate(-4deg)",
                opacity: out ? 1 : 0,
                boxShadow: out ? "var(--shadow-float)" : "none",
                transition: "top 0.9s var(--ease-cinema), left 0.9s var(--ease-cinema), transform 0.9s var(--ease-cinema), opacity 0.55s ease",
                zIndex: 5,
              }}>
                <Slot tone={pc.tone} rounded={13} style={{ width: 66 }}>
                  <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: "14px 7px 6px",
                    background: "linear-gradient(to top, rgba(27,23,20,0.55), transparent)" }}>
                    <span style={{ color: "var(--paper)", fontWeight: 500, fontSize: 10.5 }}>{pc.label}</span>
                  </div>
                </Slot>
                {/* connector line back to photo */}
              </div>
            );
          })}
        </div>
      </div>

      {/* progress phrase */}
      <div style={{ padding: "0 32px 8px", textAlign: "center" }}>
        <div className="t-body" style={{ fontWeight: 400, marginBottom: 10, minHeight: 26 }}>
          {done ? "הניתוח מוכן" : "מנתחים את הפרופורציות, הגוון והסטייל שלך…"}
        </div>
        <div style={{ height: 16, position: "relative", marginBottom: 18 }}>
          {PHASES.map((p, i) => (
            <div key={i} className="t-mono" style={{
              position: "absolute", insetInline: 0, color: "var(--gold)", fontSize: 10, letterSpacing: "0.1em",
              opacity: !done && i === phase ? 1 : 0, transform: i === phase ? "translateY(0)" : "translateY(4px)",
              transition: "all 0.5s var(--ease-cinema)",
            }}>{p}</div>
          ))}
        </div>
        <div style={{ width: 200, margin: "0 auto" }}>
          <div className="progress"><div className="progress__fill" style={{ width: `${(revealed / PIECES.length) * 100}%`, transition: "width 0.8s var(--ease-cinema)" }} /></div>
        </div>
      </div>

      <Footer>
        {done ? (
          <div className="anim-rise">
            <Pill onClick={next}>ראו מה מצאנו</Pill>
          </div>
        ) : (
          <button className="btn-text" onClick={run} style={{ display: "block", margin: "0 auto" }}>הצגה חוזרת</button>
        )}
      </Footer>
    </div>
  );
}

/* ---------- 05b Review pieces ---------- */
const DETECTED = [
  { id: 1, label: "ז'קט אוברסייז", detail: "צמר · בז' חולי", tone: "tone-a", dot: { top: "20%", left: "62%" } },
  { id: 2, label: "חולצת כותנה", detail: "כותנה · לבן שמנת", tone: "tone-c", dot: { top: "34%", left: "44%" } },
  { id: 3, label: "מכנסי ישר", detail: "טרילין · חום אדמה", tone: "tone-b", dot: { top: "58%", left: "55%" } },
  { id: 4, label: "תיק יד", detail: "עור · קוניאק", tone: "tone-a", dot: { top: "48%", left: "30%" } },
  { id: 5, label: "מגף צ'לסי", detail: "זמש · טאופ", tone: "tone-c", dot: { top: "86%", left: "52%" } },
  { id: 6, label: "חגורת עור", detail: "עור · חום כהה", tone: "tone-b", dot: { top: "52%", left: "60%" } },
];
function ScreenReview({ next, back, app }) {
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState({}); // id -> 'keep'|'remove'
  const [dx, setDx] = useState(0);
  const drag = useRef({ x: 0, active: false });
  const current = DETECTED[idx];
  const reviewedCount = Object.keys(status).length;
  const keptCount = Object.values(status).filter((s) => s === "keep").length;
  const allDone = reviewedCount >= DETECTED.length;

  const decide = (verdict) => {
    if (!current) return;
    setStatus((s) => ({ ...s, [current.id]: verdict }));
    setDx(0);
    setTimeout(() => setIdx((i) => Math.min(i + 1, DETECTED.length)), 60);
  };
  const onDown = (e) => { drag.current = { x: e.touches ? e.touches[0].clientX : e.clientX, active: true }; };
  const onMove = (e) => { if (!drag.current.active) return; const x = e.touches ? e.touches[0].clientX : e.clientX; setDx(x - drag.current.x); };
  const onUp = () => {
    if (!drag.current.active) return; drag.current.active = false;
    if (dx > 70) decide("keep"); else if (dx < -70) decide("remove"); else setDx(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar onBack={back} step={4} total={7} />
      <ScreenBody style={{ padding: "16px 24px 0" }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>סקירה</div>
        <h2 className="t-head" style={{ margin: 0, fontSize: 28 }}>מצאנו {DETECTED.length} פריטים</h2>
        <p className="t-subtitle" style={{ marginTop: 8, marginBottom: 16 }}>החליקו ימינה לשמור, שמאלה להסיר.</p>

        {/* photo with numbered dots */}
        <div style={{ position: "relative", width: 172, margin: "0 auto 14px" }}>
          <Slot tone="ink" rounded={18} style={{ width: 172, aspectRatio: "3 / 4.4", boxShadow: "var(--shadow-float)" }} label="">
            {!allDone && <div className="scan-sweep" style={{ animationDuration: "3.2s" }} />}
          </Slot>
          {DETECTED.map((d, i) => {
            const st = status[d.id];
            const isCurrent = i === idx && !allDone;
            return (
              <div key={d.id} className="dot" style={{
                top: d.dot.top, left: d.dot.left,
                background: st === "remove" ? "var(--surface)" : "var(--paper)",
                borderColor: st === "keep" ? "var(--gold)" : st === "remove" ? "var(--hairline)" : "var(--gold)",
                opacity: st === "remove" ? 0.4 : 1,
                boxShadow: isCurrent ? "0 0 0 4px var(--gold-14), 0 4px 12px rgba(27,23,20,0.25)" : "0 4px 12px rgba(27,23,20,0.25)",
                transform: `translate(50%,-50%) scale(${isCurrent ? 1.18 : 1})`,
                transition: "all 0.3s var(--ease-cinema)",
              }}>{st === "keep" ? <Icon name="check" size={13} /> : d.id}</div>
            );
          })}
        </div>

        {/* linked thumbnail rail */}
        <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 18 }}>
          {DETECTED.map((d, i) => {
            const st = status[d.id]; const isCur = i === idx && !allDone;
            return (
              <div key={d.id} style={{ position: "relative", width: 40, opacity: st === "remove" ? 0.35 : 1, transition: "all 0.3s var(--ease-cinema)", transform: isCur ? "translateY(-2px)" : "none" }}>
                <Slot tone={d.tone} rounded={9} style={{ width: 40, boxShadow: isCur ? "0 0 0 2px var(--gold), var(--shadow-card)" : "none" }} />
                {st === "keep" && <div style={{ position: "absolute", top: -5, insetInlineEnd: -5, width: 16, height: 16, borderRadius: 99, background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(27,23,20,0.25)" }}><Icon name="check" size={10} stroke="var(--paper)" /></div>}
              </div>
            );
          })}
        </div>

        {/* focused piece card / done state */}
        {!allDone ? (
          <div
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
            style={{
              userSelect: "none", cursor: "grab",
              transform: `translateX(${dx}px) rotate(${dx * 0.02}deg)`,
              transition: drag.current.active ? "none" : "transform 0.4s var(--ease-cinema)",
            }}>
            <div className="card" style={{ display: "flex", gap: 14, padding: 12, alignItems: "center", position: "relative", overflow: "hidden" }}>
              {/* swipe affordance tints */}
              <div style={{ position: "absolute", inset: 0, background: "var(--gold-14)", opacity: Math.max(0, dx / 120), transition: "opacity 0.1s" }} />
              <div style={{ position: "absolute", inset: 0, background: "var(--ink-06)", opacity: Math.max(0, -dx / 120) }} />
              <Slot tone={current.tone} rounded={12} style={{ width: 74, flexShrink: 0 }} />
              <div style={{ flex: 1, position: "relative" }}>
                <div className="t-mono" style={{ color: "var(--gold)", marginBottom: 6 }}>פריט {idx + 1} / {DETECTED.length}</div>
                <div style={{ fontWeight: 500, fontSize: 17 }}>{current.label}</div>
                <div className="t-subtitle" style={{ fontSize: 14, marginTop: 2 }}>{current.detail}</div>
                <button className="btn-text" style={{ padding: "8px 0 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="edit" size={15} /> ערוך פרטים
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <button className="pill pill--ghost" style={{ height: 50 }} onClick={() => decide("remove")}><Icon name="close" size={18} /> הסר</button>
              <button className="pill pill--surface" style={{ height: 50 }} onClick={() => decide("keep")}><Icon name="check" size={18} stroke="var(--gold)" /> שמור</button>
            </div>
          </div>
        ) : (
          <div className="card anim-rise" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--gold-14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Icon name="check" size={22} stroke="var(--gold)" />
            </div>
            <div style={{ fontWeight: 500, fontSize: 18 }}>שמרתם {keptCount} פריטים</div>
            <div className="t-subtitle" style={{ fontSize: 14, marginTop: 4 }}>הם מצטרפים לארון שלכם וישמשו ללוקים הבאים.</div>
          </div>
        )}
        <div style={{ height: 16 }} />
      </ScreenBody>
      <Footer>
        <Pill disabled={!allDone} onClick={() => { app.set("closetCount", keptCount); next(); }}>
          {allDone ? "הוסיפו לארון" : `נותרו ${DETECTED.length - reviewedCount} לבדיקה`}
        </Pill>
      </Footer>
    </div>
  );
}

/* ---------- 06 Taste questions ---------- */
const TASTE_A = [
  { id: "soft", label: "קווים רכים", note: "נופל, נוח, זורם", tone: "tone-c" },
  { id: "sharp", label: "קווים נקיים", note: "מובנה, חד, מדויק", tone: "tone-a" },
];
const FITS = [
  { id: "tailored", label: "צמוד לגוף" },
  { id: "regular", label: "רגיל" },
  { id: "relaxed", label: "רפוי" },
];
function ScreenTaste({ next, back, app }) {
  const [pick, setPick] = useState(app.get("taste") || "");
  const [fit, setFit] = useState(app.get("fit") || "");
  const ready = pick && fit;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar onBack={back} step={5} total={7} />
      <ScreenBody style={{ padding: "24px 24px 0" }}>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>טעם אישי</div>
        <h2 className="t-head" style={{ margin: 0, fontSize: 30 }}>מה קרוב יותר אליך?</h2>
        <p className="t-subtitle" style={{ marginTop: 10, marginBottom: 22 }}>שתי גישות, אותה אלגנטיות. בחרו את שלכם.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TASTE_A.map((t) => {
            const on = pick === t.id;
            return (
              <button key={t.id} onClick={() => setPick(t.id)} style={{ position: "relative", border: "none", background: "none", padding: 0, cursor: "pointer", borderRadius: 18, textAlign: "start" }}>
                <Slot tone={t.tone} rounded={18} label="EDITORIAL" style={{ width: "100%" }}>
                  <div className={`check-badge${on ? " check-badge--on" : ""}`}><Icon name="check" size={15} stroke="var(--paper)" /></div>
                </Slot>
                <div className={`ring-select${on ? " ring-select--on" : ""}`} style={{ borderRadius: 18 }} />
                <div style={{ padding: "10px 4px 0" }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{t.label}</div>
                  <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 2 }}>{t.note}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="t-label" style={{ margin: "28px 0 12px" }}>איך אתם אוהבים שהבגד יושב?</div>
        <div style={{ display: "flex", gap: 10 }}>
          {FITS.map((f) => (
            <button key={f.id} className={`chip${fit === f.id ? " chip--on" : ""}`} style={{ flex: 1, justifyContent: "center", height: 46 }} onClick={() => setFit(f.id)}>{f.label}</button>
          ))}
        </div>
      </ScreenBody>
      <Footer>
        <Pill disabled={!ready} onClick={() => { app.set("taste", pick); app.set("fit", fit); next(); }}>ראו את זהות הסטייל שלי</Pill>
      </Footer>
    </div>
  );
}

Object.assign(window, { ScreenCapture, ScreenAnalysis, ScreenReview, ScreenTaste });
