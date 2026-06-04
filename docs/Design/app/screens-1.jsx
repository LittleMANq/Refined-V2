/* ============================================================
   REFINED — screens batch 1
   01b intro carousel · 01 welcome · 02 context · 03 archetype
   ============================================================ */

/* ---------- small floating-demo phone composition ---------- */
function MiniPhone({ children }) {
  return (
    <div style={{
      width: 140, height: 240, borderRadius: 30, background: "var(--ink)",
      padding: 5, boxShadow: "var(--shadow-float)", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 32, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.16)", zIndex: 4 }} />
      <div style={{ width: "100%", height: "100%", borderRadius: 25, overflow: "hidden", background: "var(--paper)", position: "relative", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}
const fillSlot = { position: "absolute", inset: 0, aspectRatio: "auto", borderRadius: 0 };

/* designed mini-screens shown inside the intro device */
const MiniAnalysis = (
  <>
    <div style={{ position: "relative", flex: 1 }}>
      <Slot tone="tone-b" rounded={0} style={fillSlot} />
      <div style={{ position: "absolute", left: 8, right: 8, top: "42%", height: 20, borderRadius: 99,
        background: "linear-gradient(rgba(176,137,83,0), rgba(176,137,83,0.5), rgba(176,137,83,0))" }} />
      <div style={{ position: "absolute", top: 9, insetInline: 0, textAlign: "center", fontFamily: "var(--mono)", fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(27,23,20,0.45)" }}>מנתחים…</div>
    </div>
    <div style={{ padding: "9px 11px 11px", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--gold)" }} />
        <span style={{ fontSize: 9.5, fontWeight: 600 }}>עונת אביב חם</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {["#E2D4BE", "#C9B69C", "#B08953", "#8C6B4F"].map((c) => (
          <span key={c} style={{ flex: 1, height: 13, borderRadius: 4, background: c }} />
        ))}
      </div>
    </div>
  </>
);
const MiniLook = (
  <div style={{ position: "relative", flex: 1 }}>
    <Slot tone="tone-a" rounded={0} style={fillSlot} />
    <div style={{ position: "absolute", top: 9, left: 9, width: 23, height: 23, borderRadius: 99, background: "rgba(250,247,242,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(27,23,20,0.18)" }}>
      <Icon name="heart" size={12} stroke="var(--gold)" />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 11px 13px",
      background: "linear-gradient(to top, rgba(27,23,20,0.66), rgba(27,23,20,0))" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 7.5, letterSpacing: "0.12em", color: "#EAD9BC", marginBottom: 3 }}>לוק 01 · יום</div>
      <div style={{ color: "var(--paper)", fontWeight: 500, fontSize: 12.5 }}>חום חולי וקליל</div>
    </div>
  </div>
);
const MiniCloset = (
  <>
    <div style={{ padding: "12px 12px 8px" }}>
      <div style={{ fontWeight: 600, fontSize: 11 }}>הארון שלי</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 7.5, letterSpacing: "0.1em", color: "var(--secondary)", marginTop: 2 }}>42 פריטים</div>
    </div>
    <div style={{ flex: 1, padding: "0 12px 12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridAutoRows: "1fr", gap: 5 }}>
      {["tone-a", "tone-c", "tone-b", "tone-c", "tone-b", "tone-a"].map((t, i) => (
        <Slot key={i} tone={t} rounded={7} style={{ aspectRatio: "auto", width: "100%", height: "100%" }} />
      ))}
    </div>
  </>
);

function FloatCard({ children, style }) {
  return (
    <div style={{
      position: "absolute", background: "#fff", borderRadius: 16,
      boxShadow: "var(--shadow-float)", padding: "11px 13px",
      display: "flex", alignItems: "center", gap: 9, ...style,
    }}>{children}</div>
  );
}

/* editorial flatlay hero for the welcome card */
const HeroFlatlay = (
  <div style={{ position: "relative", width: 258, height: 312, margin: "0 auto" }}>
    {/* layered back pieces */}
    <div style={{ position: "absolute", top: 62, right: 2, width: 92, transform: "rotate(9deg)" }}>
      <Slot tone="tone-b" rounded={15} style={{ width: 92, boxShadow: "var(--shadow-float)" }} />
    </div>
    <div style={{ position: "absolute", top: 54, left: 0, width: 86, transform: "rotate(-11deg)" }}>
      <Slot tone="tone-c" rounded={15} style={{ width: 86, boxShadow: "var(--shadow-float)" }} />
    </div>
    {/* hero center look */}
    <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%) rotate(-3deg)", width: 130, zIndex: 2 }}>
      <Slot tone="tone-a" rounded={18} style={{ width: 130, boxShadow: "var(--shadow-float)" }} label="LOOK 01" />
    </div>
    {/* floating color-season chip — real swatches */}
    <div style={{ position: "absolute", bottom: 6, left: 2, zIndex: 4, background: "#fff", borderRadius: 15, padding: "11px 13px", boxShadow: "var(--shadow-float)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--gold)" }} />
        <span style={{ fontSize: 10.5, fontWeight: 600 }}>אביב חם</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {["#E2D4BE", "#C9B69C", "#B08953", "#8C6B4F"].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: 5, background: c }} />
        ))}
      </div>
    </div>
    {/* floating insight chip */}
    <div style={{ position: "absolute", top: 2, right: 0, zIndex: 4, background: "#fff", borderRadius: 13, padding: "8px 11px", boxShadow: "var(--shadow-float)", display: "flex", alignItems: "center", gap: 7 }}>
      <Icon name="sparkle" size={14} stroke="var(--gold)" />
      <span style={{ fontSize: 10.5, fontWeight: 500 }}>פרופורציה מאוזנת</span>
    </div>
  </div>
);

const INTRO_SLIDES = [
  {
    kind: "hero",
    eyebrow: "סטייליסט אישי",
    title: "סטייל\nשמבין אותך",
    body: "כמה תמונות, ותוך דקה זהות סטייל ולוקים אמיתיים. בדיוק שלכם.",
    hero: HeroFlatlay,
  },
  {
    eyebrow: "ניתוח",
    title: "ניתוח אישי\nשמתחיל ממך",
    body: "גוף, פרופורציות וגוון עור. מבינים אותך לפני הבגדים.",
    tone: "tone-b", slotLabel: "FULL-BODY", screen: MiniAnalysis,
    floats: (
      <>
        <FloatCard style={{ top: 30, left: -22 }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, background: "var(--gold)" }} />
          <div>
            <div className="t-label-sm">עונת צבע</div>
            <div className="t-mono" style={{ color: "var(--secondary)", fontSize: 9 }}>אביב רך</div>
          </div>
        </FloatCard>
        <FloatCard style={{ bottom: 34, right: -26 }}>
          <Icon name="sparkle" size={16} stroke="var(--gold)" />
          <span className="t-label-sm">פרופורציה מאוזנת</span>
        </FloatCard>
      </>
    ),
  },
  {
    eyebrow: "לוקים",
    title: "לוקים שבנויים\nבדיוק עליך",
    body: "כל לוק מגיע עם הסבר קצר למה הוא עובד עבורך.",
    tone: "tone-a", slotLabel: "LOOK", screen: MiniLook,
    floats: (
      <>
        <FloatCard style={{ top: 26, right: -28, maxWidth: 150 }}>
          <Icon name="heart" size={16} stroke="var(--gold)" />
          <span className="t-label-sm">מתאים לקו הכתפיים שלך</span>
        </FloatCard>
        <FloatCard style={{ bottom: 30, left: -20, flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          <span className="t-mono" style={{ color: "var(--secondary)", fontSize: 9 }}>3 לוקים חדשים</span>
          <div style={{ display: "flex", gap: 5 }}>
            {["tone-a", "tone-c", "tone-b"].map((t, i) => (
              <Slot key={i} tone={t} style={{ width: 26, aspectRatio: "3/4", borderRadius: 6 }} />
            ))}
          </div>
        </FloatCard>
      </>
    ),
  },
  {
    eyebrow: "הארון",
    title: "סטייליסט שמכיר\nאת הארון שלך",
    body: "מצלמים פעם אחת, והבגדים שלכם הופכים ללוקים.",
    tone: "tone-c", slotLabel: "CLOSET", screen: MiniCloset,
    floats: (
      <>
        <FloatCard style={{ top: 34, left: -24, flexDirection: "column", alignItems: "flex-start", gap: 7 }}>
          <span className="t-mono" style={{ color: "var(--secondary)", fontSize: 9 }}>נמצאו 6 פריטים</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
            {[..."abcdef"].map((t, i) => (
              <Slot key={i} tone={["tone-a", "tone-b", "tone-c"][i % 3]} style={{ width: 20, aspectRatio: "3/4", borderRadius: 4 }} />
            ))}
          </div>
        </FloatCard>
        <FloatCard style={{ bottom: 40, right: -22 }}>
          <Icon name="hanger" size={16} stroke="var(--gold)" />
          <span className="t-label-sm">42 פריטים</span>
        </FloatCard>
      </>
    ),
  },
];

function HeroCarousel({ index, setIndex }) {
  const trackRef = useRef(null);
  const drag = useRef({ x: 0, dx: 0, active: false });
  const [dx, setDx] = useState(0);
  const n = INTRO_SLIDES.length;

  const onDown = (e) => {
    drag.current.active = true;
    drag.current.x = (e.touches ? e.touches[0].clientX : e.clientX);
    drag.current.dx = 0;
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    drag.current.dx = x - drag.current.x;
    setDx(drag.current.dx);
  };
  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const d = drag.current.dx;
    // RTL: dragging right (positive dx) → previous; left → next
    if (d < -50 && index < n - 1) setIndex(index + 1);
    else if (d > 50 && index > 0) setIndex(index - 1);
    setDx(0);
  };

  const V = 390, CARD_W = 290, GAP = 14;
  const CENTER_RIGHT = (V - CARD_W) / 2; // active card centered
  const dragging = drag.current.active;

  return (
    <div
      style={{ position: "relative", overflow: "hidden", flex: 1, display: "flex", alignItems: "center" }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
    >
      <div ref={trackRef} style={{ position: "relative", width: "100%", height: 540 }}>
        {INTRO_SLIDES.map((s, i) => {
          const activeCard = i === index;
          // RTL: higher index sits to the LEFT (greater 'right' offset)
          const rightPos = CENTER_RIGHT + (i - index) * (CARD_W + GAP) + dx;
          return (
            <div key={i} style={{
              width: CARD_W, height: 540, borderRadius: 30, overflow: "hidden",
              background: "var(--surface)", position: "absolute", top: 0, right: rightPos, userSelect: "none",
              boxShadow: activeCard ? "var(--shadow-card)" : "none",
              opacity: activeCard ? 1 : 0.5, transformOrigin: "center",
              transform: `scale(${activeCard ? 1 : 0.93})`,
              transition: dragging ? "none" : "right 0.55s var(--ease-cinema), opacity 0.5s var(--ease-cinema), transform 0.5s var(--ease-cinema)",
            }}>
              {/* soft tonal field */}
              <div style={{ position: "absolute", inset: 0, background: s.kind === "hero" ? "linear-gradient(165deg, #EFE8DD 0%, #E7DDCF 100%)" : (i % 2 ? "#EEE7DD" : "#ECE4D9") }} />

              {s.kind === "hero" ? (
                <>
                  {/* editorial flatlay cluster */}
                  <div style={{ position: "absolute", insetInline: 0, top: 30, display: "flex", justifyContent: "center" }}>{s.hero}</div>
                  {/* serif headline block */}
                  <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: "44px 26px 30px",
                    background: "linear-gradient(to top, rgba(232,221,207,0.98) 36%, rgba(232,221,207,0))" }}>
                    <div className="t-eyebrow" style={{ marginBottom: 12 }}>{s.eyebrow}</div>
                    <div style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 38, lineHeight: 1.06, whiteSpace: "pre-line", letterSpacing: "-0.01em" }}>{s.title}</div>
                    <div className="t-subtitle" style={{ marginTop: 12, fontSize: 15.5 }}>{s.body}</div>
                  </div>
                </>
              ) : (
                <>
                  {/* phone + floats */}
                  <div style={{ position: "absolute", insetInline: 0, top: 72, display: "flex", justifyContent: "center" }}>
                    <div style={{ position: "relative" }}>
                      <MiniPhone>{s.screen}</MiniPhone>
                      {s.floats}
                    </div>
                  </div>
                  {/* headline block */}
                  <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: "28px 26px 30px",
                    background: "linear-gradient(to top, rgba(241,236,228,0.96) 30%, rgba(241,236,228,0))" }}>
                    <div className="t-eyebrow" style={{ marginBottom: 12 }}>{s.eyebrow}</div>
                    <div className="t-head" style={{ fontWeight: 300, whiteSpace: "pre-line", fontSize: 29 }}>{s.title}</div>
                    <div className="t-subtitle" style={{ marginTop: 10, fontSize: 15.5 }}>{s.body}</div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScreenIntro({ next }) {
  const [index, setIndex] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", paddingTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 24px 18px" }}>
        <Wordmark size={17} />
        <button className="btn-text" onClick={next} style={{ padding: 0 }}>דלגו</button>
      </div>
      <HeroCarousel index={index} setIndex={setIndex} />
      {/* dots — RTL, active fills toward right */}
      <div style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "center", gap: 7, padding: "22px 0 10px" }}>
        {INTRO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`שקופית ${i + 1}`} style={{
            width: i === index ? 22 : 7, height: 7, borderRadius: 999, border: "none", cursor: "pointer",
            background: i === index ? "var(--gold)" : "var(--hairline)", transition: "all 0.4s var(--ease-cinema)", padding: 0,
          }} />
        ))}
      </div>
      <Footer>
        <Pill onClick={() => (index < INTRO_SLIDES.length - 1 ? setIndex(index + 1) : next())}>
          {index < INTRO_SLIDES.length - 1 ? "המשך" : "בואו נתחיל"}
        </Pill>
      </Footer>
    </div>
  );
}

/* ---------- wordmark ---------- */
function Wordmark({ size = 20, light }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: light ? "var(--paper)" : "var(--ink)" }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--gold)", display: "inline-block" }} />
      <span style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: size, letterSpacing: "0.02em" }}>Refined</span>
    </div>
  );
}

/* ---------- 01 Welcome ---------- */
function ScreenWelcome({ next }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ paddingTop: 26, paddingInline: 24 }}><Wordmark /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 30px" }}>
        <div className="t-eyebrow anim-rise" style={{ marginBottom: 22, animationDelay: "0.1s" }}>סטייליסט אישי</div>
        <h1 className="t-serif-hero anim-rise" style={{ margin: 0, animationDelay: "0.2s" }}>
          סטייל<br />שמבין אותך
        </h1>
        <p className="t-subtitle anim-rise" style={{ marginTop: 22, maxWidth: 280, animationDelay: "0.35s" }}>
          כמה תמונות טובות, ותוך דקה תקבלו ניתוח אישי, זהות סטייל וקבוצת לוקים אמיתיים. רגועים, מדויקים, בדיוק שלכם.
        </p>
      </div>
      <Footer>
        <div className="anim-rise" style={{ animationDelay: "0.5s" }}>
          <Pill onClick={next}>בואו נתחיל</Pill>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span className="t-label" style={{ color: "var(--secondary)" }}>כבר יש לכם חשבון? </span>
            <button className="btn-text" style={{ padding: 0, color: "var(--ink)" }}>התחברו</button>
          </div>
        </div>
      </Footer>
    </div>
  );
}

/* ---------- 02 Gender + style context ---------- */
const GENDERS = [
  { id: "w", label: "אישה" },
  { id: "m", label: "גבר" },
  { id: "x", label: "ללא הגדרה" },
];
const CONTEXTS = [
  { id: "work", label: "עבודה ומשרד" },
  { id: "casual", label: "יומיום וקז'ואל" },
  { id: "evening", label: "ערב ואירועים" },
  { id: "smart", label: "סמארט קז'ואל" },
];
function ScreenContext({ next, back, app }) {
  const [gender, setGender] = useState(app.get("gender") || "");
  const [ctx, setCtx] = useState(app.get("contexts") || []);
  const toggleCtx = (id) => setCtx((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);
  const ready = gender && ctx.length;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar onBack={back} step={1} total={7} />
      <ScreenBody style={{ padding: "24px 24px 0" }}>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>נעים להכיר</div>
        <h2 className="t-head" style={{ margin: 0, fontSize: 30 }}>מי מתלבש?</h2>
        <p className="t-subtitle" style={{ marginTop: 10, marginBottom: 26 }}>נתאים את הניתוח, הלוקים והשפה בדיוק אליכם.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 30 }}>
          {GENDERS.map((g) => {
            const on = gender === g.id;
            return (
              <button key={g.id} onClick={() => setGender(g.id)} style={{
                position: "relative", height: 104, borderRadius: 18, cursor: "pointer", border: "none",
                background: on ? "var(--gold-14)" : "#fff",
                boxShadow: on ? "0 0 0 1.5px var(--gold), 0 12px 26px -14px rgba(176,137,83,0.5)" : "var(--shadow-card)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                transition: "all 0.35s var(--ease-cinema)",
              }}>
                <span style={{ width: 32, height: 32, borderRadius: 99, background: on ? "var(--gold)" : "var(--surface)",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.35s var(--ease-cinema)" }}>
                  {on ? <Icon name="check" size={17} stroke="var(--paper)" /> : <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--secondary)" }} />}
                </span>
                <span style={{ fontWeight: 500, fontSize: 14, color: "var(--ink)" }}>{g.label}</span>
              </button>
            );
          })}
        </div>

        <div className="t-label" style={{ marginBottom: 13 }}>לאיזה רגעים מתלבשים בעיקר?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {CONTEXTS.map((c) => {
            const on = ctx.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggleCtx(c.id)} style={{
                position: "relative", height: 58, borderRadius: 15, border: "none", cursor: "pointer",
                background: on ? "var(--ink)" : "#fff", color: on ? "var(--paper)" : "var(--ink)",
                boxShadow: on ? "none" : "var(--shadow-card)",
                display: "flex", alignItems: "center", gap: 11, padding: "0 15px",
                fontFamily: "var(--sans)", fontWeight: 500, fontSize: 14, textAlign: "start",
                transition: "all 0.3s var(--ease-cinema)",
              }}>
                <span style={{ width: 20, height: 20, borderRadius: 99, flexShrink: 0,
                  border: on ? "none" : "1.5px solid var(--hairline)", background: on ? "var(--gold)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <Icon name="check" size={13} stroke="var(--paper)" />}
                </span>
                {c.label}
              </button>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </ScreenBody>
      <Footer>
        <Pill disabled={!ready} onClick={() => { app.set("gender", gender); app.set("contexts", ctx); next(); }}>המשך</Pill>
      </Footer>
    </div>
  );
}

/* ---------- 03 Archetype picker ---------- */
const ARCHETYPES = [
  { id: "quiet", label: "יוקרה שקטה", sub: "מינימליזם עשיר", tone: "tone-a" },
  { id: "street", label: "סטריט", sub: "עירוני ונועז", tone: "tone-b" },
  { id: "minimal", label: "מינימל", sub: "נקי ומדויק", tone: "tone-c" },
  { id: "high", label: "היי פאשן", sub: "אוונגרד מודגש", tone: "tone-b" },
  { id: "sport", label: "ספורט שיק", sub: "אתלוז'ר מוקפד", tone: "tone-a" },
  { id: "classic", label: "קלאסי", sub: "נצחי ושקול", tone: "tone-c" },
];
function ScreenArchetype({ next, back, app }) {
  const [sel, setSel] = useState(app.get("archetypes") || ["quiet", "minimal"]);
  const toggle = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar onBack={back} step={2} total={7} />
      <ScreenBody style={{ padding: "24px 24px 0" }}>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>ההשראה שלך</div>
        <h2 className="t-head" style={{ margin: 0, fontSize: 30 }}>מה מושך אותך?</h2>
        <p className="t-subtitle" style={{ marginTop: 10, marginBottom: 22 }}>בחרו את העולמות שמדברים אליכם. אפשר יותר מאחד.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          {ARCHETYPES.map((a) => {
            const on = sel.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggle(a.id)} style={{
                position: "relative", border: "none", padding: 0, background: "none", cursor: "pointer", borderRadius: 18,
                boxShadow: on ? "0 16px 30px -16px rgba(176,137,83,0.55)" : "var(--shadow-card)",
                transform: on ? "translateY(-2px)" : "none", transition: "all 0.35s var(--ease-cinema)",
              }}>
                <Slot tone={a.tone} rounded={18} style={{ width: "100%" }}>
                  <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: "26px 14px 14px",
                    background: "linear-gradient(to top, rgba(27,23,20,0.62), rgba(27,23,20,0))" }}>
                    <div style={{ color: "var(--paper)", fontWeight: 500, fontSize: 16 }}>{a.label}</div>
                    <div style={{ color: "rgba(250,247,242,0.78)", fontSize: 11.5, marginTop: 2, fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>{a.sub}</div>
                  </div>
                  <div className={`check-badge${on ? " check-badge--on" : ""}`}><Icon name="check" size={15} stroke="var(--paper)" /></div>
                </Slot>
                <div className={`ring-select${on ? " ring-select--on" : ""}`} style={{ borderRadius: 18 }} />
              </button>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </ScreenBody>
      <Footer>
        <Pill disabled={!sel.length} onClick={() => { app.set("archetypes", sel); next(); }}>
          {sel.length ? `המשך · נבחרו ${sel.length}` : "בחרו לפחות אחד"}
        </Pill>
      </Footer>
    </div>
  );
}

Object.assign(window, { ScreenIntro, ScreenWelcome, ScreenContext, ScreenArchetype, Wordmark, MiniPhone, FloatCard });
