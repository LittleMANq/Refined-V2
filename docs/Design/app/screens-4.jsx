/* ============================================================
   REFINED — screens batch 4 (logged-in core)
   A Look detail · B Stylist chat · C Profile / You
   ============================================================ */

const PALETTE4 = [
  { hex: "#F3ECE0", name: "שמנת" },
  { hex: "#E2D4BE", name: "חול" },
  { hex: "#C9B69C", name: "טאופ" },
  { hex: "#B08953", name: "זהב עתיק" },
  { hex: "#8C6B4F", name: "קוניאק" },
  { hex: "#3A322B", name: "אספרסו" },
];

/* ---------- A · Look detail ---------- */
const LOOK_PIECES = [
  { label: "ז'קט בז'", sub: "צמר", tone: "tone-a" },
  { label: "חולצת קרם", sub: "כותנה", tone: "tone-c" },
  { label: "מכנס ישר", sub: "שחור", tone: "tone-b" },
  { label: "מגף צ'לסי", sub: "זמש", tone: "tone-a" },
];
const RATIONALE = [
  { icon: "sparkle", title: "פרופורציה", line: "אוברסייז למעלה ורפוי למטה, מאוזן ומאריך את הקו." },
  { icon: "heart", title: "הפלטה שלך", line: "קרם חם על בסיס שחור, מחמיא בדיוק לגוון העור שלך." },
  { icon: "sun", title: "האירוע", line: "סמארט קז'ואל שמתאים לפגישת צהריים וגם לערב." },
];
function ScreenLook({ go, back }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px 8px" }}>
        <button onClick={() => go && go("today")} aria-label="חזרה" style={{ background: "none", border: "none", padding: 6, margin: -6, cursor: "pointer", color: "var(--ink)", display: "flex" }}>
          <Icon name="back" size={24} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="t-mono" style={{ color: "var(--secondary)", fontSize: 9.5 }}>הלוק של היום</div>
        </div>
        <button aria-label="שמרו" style={{ background: "none", border: "none", padding: 6, margin: -6, cursor: "pointer", color: "var(--ink)", display: "flex" }}>
          <Icon name="heart" size={22} />
        </button>
      </div>

      <ScreenBody style={{ padding: "8px 22px 0" }}>
        {/* hero look */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-float)" }}>
          <Slot tone="tone-a" rounded={24} style={{ width: "100%", aspectRatio: "3 / 4" }} label="">
            <div style={{ position: "absolute", top: 14, insetInlineStart: 14 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 13px", borderRadius: 99,
                background: "rgba(250,247,242,0.92)", backdropFilter: "blur(6px)", fontSize: 12, fontWeight: 600 }}>
                <Icon name="sparkle" size={14} stroke="var(--gold)" /> למה זה?
              </span>
            </div>
            <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: "46px 18px 18px",
              background: "linear-gradient(to top, rgba(27,23,20,0.66), rgba(27,23,20,0))" }}>
              <div className="t-mono" style={{ color: "#EAD9BC", marginBottom: 7 }}>סמארט קז'ואל · 24°</div>
              <div style={{ color: "var(--paper)", fontFamily: "var(--serif)", fontWeight: 500, fontSize: 27, lineHeight: 1.1 }}>חום חולי וקווים נקיים</div>
            </div>
          </Slot>
        </div>

        {/* pieces */}
        <div style={{ marginTop: 22 }}>
          <div className="t-label" style={{ marginBottom: 12 }}>מורכב מ-{LOOK_PIECES.length} פריטים מהארון שלך</div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 11, overflowX: "auto", paddingBottom: 2 }}>
            {LOOK_PIECES.map((p, i) => (
              <div key={i} style={{ width: 82, flexShrink: 0 }}>
                <Slot tone={p.tone} rounded={13} style={{ width: 82 }} label="" />
                <div style={{ fontWeight: 500, fontSize: 12.5, marginTop: 7 }}>{p.label}</div>
                <div className="t-mono" style={{ color: "var(--secondary)", fontSize: 8.5, marginTop: 1 }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* THE REASONING — focal */}
        <div className="card" style={{ marginTop: 22, padding: "20px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ width: 30, height: 30, borderRadius: 99, background: "var(--gold-14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="sparkle" size={16} stroke="var(--gold)" />
            </span>
            <span className="t-eyebrow">למה הלוק הזה עובד לך</span>
          </div>
          <p style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 400, fontSize: 20, lineHeight: 1.55, color: "var(--ink)" }}>
            הג'ינס הרפוי בשחור עם החולצה האוברסייז בקרם מאזנים את הפרופורציות שלך, מאריכים את הקו ושומרים על האסתטיקה הנקייה והשקטה שאת אוהבת. הקרם החם מחמיא לגוון העור שלך, וזה בדיוק הרגיסטר הנכון לפגישת צהריים.
          </p>
          <div className="hr" style={{ margin: "18px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {RATIONALE.map((r) => (
              <div key={r.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--gold)", marginTop: 7, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                  <div className="t-subtitle" style={{ fontSize: 13.5, marginTop: 1, lineHeight: 1.45 }}>{r.line}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 18 }} />
      </ScreenBody>

      <Footer>
        <div style={{ display: "flex", gap: 11, marginBottom: 11 }}>
          <button className="pill pill--surface" style={{ height: 50, fontSize: 15 }}><Icon name="heart" size={18} stroke="var(--gold)" /> שמרו</button>
          <button className="pill pill--surface" style={{ height: 50, fontSize: 15 }}><Icon name="check" size={18} stroke="var(--gold)" /> לבשתי</button>
        </div>
        <Pill onClick={() => {}}><Icon name="swap" size={19} stroke="var(--paper)" /> החליפו לוק</Pill>
      </Footer>
    </div>
  );
}

/* ---------- B · Stylist chat ---------- */
const CHAT_CHIPS = ["מה ללבוש לדייט הערב?", "תכין לי לוק לעבודה", "מה חסר לי בארון?"];
function StylistAvatar({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 99, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name="sparkle" size={size * 0.5} stroke="var(--gold)" />
    </div>
  );
}
function Bubble({ who, children }) {
  const me = who === "me";
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", gap: 9 }}>
      {!me && <StylistAvatar size={30} />}
      <div style={{
        maxWidth: 250, padding: "11px 14px", borderRadius: 18,
        borderEndEndRadius: me ? 6 : 18, borderEndStartRadius: me ? 18 : 6,
        background: me ? "var(--ink)" : "#fff", color: me ? "var(--paper)" : "var(--ink)",
        boxShadow: me ? "none" : "var(--shadow-card)", fontSize: 14.5, lineHeight: 1.5,
      }}>{children}</div>
    </div>
  );
}
function ChatLookCard() {
  return (
    <div style={{ marginTop: 10, background: "var(--surface)", borderRadius: 14, padding: 10 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 9 }}>
        {["tone-a", "tone-c", "tone-b"].map((t, i) => (
          <Slot key={i} tone={t} rounded={8} style={{ width: 48, boxShadow: "var(--shadow-card)" }} label="" />
        ))}
      </div>
      <div style={{ fontWeight: 600, fontSize: 13.5 }}>לוק מהבוקר עד הערב</div>
      <div className="t-subtitle" style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.4 }}>הז'קט הבז' עם המכנס הישר, נקי ומחמיא לפלטה שלך.</div>
    </div>
  );
}
function ScreenChat({ go }) {
  const [text, setText] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "18px 22px 14px", borderBottom: "1px solid var(--hairline)" }}>
        <StylistAvatar size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>הסטייליסט שלך</div>
          <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 1 }}>מכיר את הארון והפלטה שלך</div>
        </div>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--gold)" }} />
      </div>

      <ScreenBody style={{ padding: "20px 22px 0", gap: 14 }}>
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <span className="t-mono" style={{ color: "var(--secondary)", fontSize: 9.5 }}>היום · 9:41</span>
        </div>
        <Bubble who="them">בוקר טוב, נועה. לאן את מתלבשת היום?</Bubble>
        <Bubble who="me">פגישה בצהריים, ואז דרינקס עם חברות.</Bubble>
        <Bubble who="them">
          מושלם. הרכבתי לך לוק אחד שיחזיק מהבוקר עד הערב, הכל מהארון שלך:
          <ChatLookCard />
        </Bubble>
        <Bubble who="them">רוצה שאחליף את הנעליים למשהו ערבי יותר לקראת הדרינקס?</Bubble>
        <div style={{ height: 6 }} />
      </ScreenBody>

      {/* suggested chips + input */}
      <div style={{ padding: "8px 0 0" }}>
        <div className="no-scrollbar" style={{ display: "flex", gap: 9, overflowX: "auto", padding: "0 22px 12px" }}>
          {CHAT_CHIPS.map((c) => (
            <button key={c} className="chip" style={{ flexShrink: 0, height: 36 }} onClick={() => setText(c)}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 22px calc(16px + env(safe-area-inset-bottom))" }}>
          <input
            value={text} onChange={(e) => setText(e.target.value)} dir="rtl" placeholder="שאלו כל דבר…"
            style={{ flex: 1, height: 52, borderRadius: 999, border: "1px solid var(--hairline)", background: "var(--paper)",
              padding: "0 20px", fontFamily: "var(--sans)", fontSize: 15, color: "var(--ink)", outline: "none" }}
          />
          <button aria-label="שליחה" style={{ width: 52, height: 52, borderRadius: 999, border: "none", background: "var(--gold)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "var(--shadow-pill)" }}>
            <Icon name="send" size={20} stroke="var(--paper)" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- C · Profile / You ---------- */
const SETTINGS = [
  { icon: "heart", label: "החשבון שלי", sub: "נועה · ערכו פרטים" },
  { icon: "bell", label: "התראות", sub: "לוק יומי, 8:00" },
  { icon: "lock", label: "פרטיות ותמונות", sub: "התמונות נשארות פרטיות" },
];
function ScreenProfile({ go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ScreenBody style={{ padding: "26px 22px 0" }}>
        {/* identity hero */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 12 }}>זהות הסטייל שלך</div>
            <h1 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 40, lineHeight: 1.02 }}>מינימל<br />יוקרתי</h1>
          </div>
          <button className="chip" style={{ height: 38, marginTop: 30 }}><Icon name="edit" size={15} /> ערכו</button>
        </div>
        <p className="t-subtitle" style={{ marginTop: 16, marginBottom: 26 }}>נקי ומדויק, בלי מאמץ. בסיס שקט עם נגיעות יוקרה.</p>

        {/* palette */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <span className="t-label">הפלטה שלך</span>
            <span className="t-mono" style={{ color: "var(--gold)" }}>אביב חם</span>
          </div>
          <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            {PALETTE4.map((c) => <div key={c.hex} style={{ flex: 1, height: 52, background: c.hex }} />)}
          </div>
        </div>

        {/* archetypes */}
        <div style={{ marginBottom: 26 }}>
          <div className="t-label" style={{ marginBottom: 12 }}>העולמות שלך</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {["יוקרה שקטה", "מינימל", "קלאסי"].map((a) => (
              <span key={a} className="chip chip--on" style={{ height: 38 }}>{a}</span>
            ))}
          </div>
        </div>

        {/* style evolution — coming soon */}
        <div className="card" style={{ padding: 18, marginBottom: 26, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span className="t-label">התפתחות הסטייל</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--gold)", background: "var(--gold-14)", padding: "4px 9px", borderRadius: 99 }}>בקרוב</span>
          </div>
          {/* quiet timeline visual */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 56, opacity: 0.55 }}>
            {[26, 34, 30, 42, 38, 50, 46].map((h, i) => (
              <div key={i} style={{ flex: 1, height: h, borderRadius: 6, background: i === 6 ? "var(--gold)" : "var(--surface)" }} />
            ))}
          </div>
          <div className="t-subtitle" style={{ fontSize: 13.5, marginTop: 14, lineHeight: 1.45 }}>נראה איך הסטייל שלך מתפתח לאורך הזמן, עם כל לוק שתלבשי.</div>
        </div>

        {/* settings */}
        <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
          {SETTINGS.map((s, i) => (
            <div key={s.label}>
              {i > 0 && <div className="hr" style={{ marginInline: 16 }} />}
              <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "15px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "start" }}>
                <span style={{ width: 36, height: 36, borderRadius: 11, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={s.icon} size={18} stroke="var(--gold)" />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontWeight: 500, fontSize: 15 }}>{s.label}</span>
                  <span className="t-label-sm" style={{ color: "var(--secondary)" }}>{s.sub}</span>
                </span>
                <Icon name="chevronLeft" size={18} stroke="var(--secondary)" />
              </button>
            </div>
          ))}
        </div>

        {/* subscription */}
        <div onClick={() => go && go("paywall")} className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 13, marginBottom: 18, background: "var(--ink)", cursor: "pointer" }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(176,137,83,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="sparkle" size={20} stroke="var(--gold)" />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "var(--paper)", fontWeight: 600, fontSize: 15 }}>Refined Plus</div>
            <div style={{ color: "rgba(250,247,242,0.7)", fontSize: 12.5, marginTop: 2 }}>לוקים ללא הגבלה וסטייליסט תמיד זמין</div>
          </div>
          <Icon name="chevronLeft" size={18} stroke="rgba(250,247,242,0.7)" />
        </div>
      </ScreenBody>
      <TabBar active="me" onChange={(t) => go && go(t)} />
    </div>
  );
}

Object.assign(window, { ScreenLook, ScreenChat, ScreenProfile });
