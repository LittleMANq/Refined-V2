/* ============================================================
   REFINED — screens batch 3
   07 Style Identity reveal (HERO) · 08 sign-up · 09 perms
   10 Today · 11 Closet
   ============================================================ */

/* personal palette — warm muted neutrals only (on-brand, no green/purple) */
const PALETTE = [
  { hex: "#F3ECE0", name: "שמנת" },
  { hex: "#E2D4BE", name: "חול" },
  { hex: "#C9B69C", name: "טאופ" },
  { hex: "#B08953", name: "זהב עתיק" },
  { hex: "#8C6B4F", name: "קוניאק" },
  { hex: "#3A322B", name: "אספרסו" },
];
const REVEAL_LOOKS = [
  { tone: "tone-a", title: "לוק יום רגוע", why: "קווים נקיים שמאריכים את הקו שלך" },
  { tone: "tone-c", title: "ערב מינימלי", why: "מונוכרום חם שמחמיא לגוון שלך" },
  { tone: "tone-b", title: "סוף שבוע", why: "נפח מדוד עם בד נופל ונעים" },
];

function ScreenReveal({ next, back, app }) {
  const [on, setOn] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 60);
    const t2 = setTimeout(() => setSettled(true), 4200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);
  const replay = () => { setSettled(false); setOn(false); setTimeout(() => setOn(true), 60); setTimeout(() => setSettled(true), 4200); };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
      <TopBar onBack={back} step={6} total={7} />
      <ScreenBody className={`${on ? "stage-on" : ""}${settled ? " stage-settled" : ""}`} style={{ padding: "0 24px 0" }}>

        {/* ===== BEAT 1 — the moment: name alone, full view ===== */}
        <div style={{ position: "relative", minHeight: 648, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          {/* dreamy flatlay framing the name */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <FlatlayFloat on={on} style={{ top: 96,  left: -10, rotate: "-10deg", w: 78, tone: "tone-a", d: "0.35s" }} />
            <FlatlayFloat on={on} style={{ top: 70,  right: -12, rotate: "9deg",  w: 88, tone: "tone-c", d: "0.45s" }} />
            <FlatlayFloat on={on} style={{ top: 296, left: 6,    rotate: "7deg",  w: 64, tone: "tone-b", d: "0.6s" }} />
            <FlatlayFloat on={on} style={{ top: 312, right: 10,  rotate: "-8deg", w: 70, tone: "tone-a", d: "0.7s" }} />
            {/* paper glow keeps the name crisp */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 300,
              background: "radial-gradient(ellipse at center, var(--paper) 40%, var(--paper-0) 74%)" }} />
          </div>

          <div style={{ position: "relative" }}>
            <div className="stage-item t-eyebrow" style={{ "--d": "0.1s", marginBottom: 22 }}>זהות הסטייל שלך</div>
            {/* single gold accent detail */}
            <div className="stage-item" style={{ "--d": "0.4s", display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <span style={{ width: 28, height: 1, background: "var(--gold)" }} />
              <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--gold)", margin: "-2px 8px 0" }} />
              <span style={{ width: 28, height: 1, background: "var(--gold)" }} />
            </div>
            <h1 className="stage-item" style={{ "--d": "0.7s", margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 60, lineHeight: 1.0, letterSpacing: "-0.015em" }}>
              מינימל<br />יוקרתי
            </h1>
            <div className="stage-item t-mono" style={{ "--d": "1.15s", marginTop: 26, color: "var(--secondary)" }}>אביב חם · קו נקי</div>
          </div>

          {/* scroll hint */}
          <div className="stage-item scroll-hint" style={{ "--d": "1.6s", position: "absolute", bottom: 8, insetInline: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "var(--secondary)" }}>
            <span className="t-mono" style={{ fontSize: 9.5 }}>גללו לגלות עוד</span>
            <Icon name="chevronDown" size={18} stroke="var(--gold)" />
          </div>
        </div>

        {/* ===== BEAT 2 — the details ===== */}
        <div className="hr" style={{ marginBottom: 28 }} />

        <p className="stage-item" style={{ "--d": "0s", margin: "0 0 32px", fontFamily: "var(--serif)", fontWeight: 400, fontSize: 22, lineHeight: 1.5, color: "var(--ink)" }}>
          נקי ומדויק, בלי מאמץ. בסיס שקט עם נגיעות יוקרה.
        </p>

        {/* COLOR PALETTE */}
        <div className="stage-item" style={{ "--d": "0.1s", marginBottom: 34 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <span className="t-label">הצבעים שמחמיאים לך</span>
            <span className="t-mono" style={{ color: "var(--gold)" }}>אביב חם</span>
          </div>
          <div style={{ display: "flex", gap: 0, borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            {PALETTE.map((c) => (
              <div key={c.hex} style={{ flex: 1 }}>
                <div style={{ height: 60, background: c.hex }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 9 }}>
            {PALETTE.map((c) => (
              <div key={c.hex} className="t-mono" style={{ flex: 1, textAlign: "center", color: "var(--secondary)", fontSize: 8.5 }}>{c.name}</div>
            ))}
          </div>
        </div>

        {/* THREE FIRST LOOKS */}
        <div className="stage-item" style={{ "--d": "0.2s", marginBottom: 14 }}>
          <div className="t-label">שלושת הלוקים הראשונים שלך</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {REVEAL_LOOKS.map((l, i) => (
            <div key={i} className="stage-item card" style={{ "--d": `${0.3 + i * 0.12}s`, display: "flex", gap: 14, padding: 12, alignItems: "center" }}>
              <Slot tone={l.tone} rounded={13} style={{ width: 80, flexShrink: 0 }} label="LOOK" />
              <div style={{ flex: 1 }}>
                <div className="t-mono" style={{ color: "var(--gold)", marginBottom: 6 }}>לוק {String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontWeight: 500, fontSize: 17 }}>{l.title}</div>
                <div className="t-subtitle" style={{ fontSize: 14, marginTop: 3, lineHeight: 1.45 }}>{l.why}</div>
              </div>
            </div>
          ))}
        </div>

        {/* confirm */}
        <div className="stage-item" style={{ "--d": "0.7s", textAlign: "center", padding: "30px 0 10px" }}>
          <div className="t-subtitle" style={{ marginBottom: 14 }}>מרגיש נכון?</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="chip chip--on" style={{ height: 42, padding: "0 22px" }}><Icon name="check" size={16} /> בול עליי</button>
            <button className="chip" style={{ height: 42, padding: "0 22px" }} onClick={replay}><Icon name="swap" size={16} /> כוונון עדין</button>
          </div>
        </div>
        <div style={{ height: 10 }} />
      </ScreenBody>
      <Footer>
        <div style={{ position: "absolute", insetInline: 0, top: -34, height: 34, background: "linear-gradient(to top, var(--paper), var(--paper-0))", pointerEvents: "none" }} />
        <Pill onClick={next}>שמרו את זהות הסטייל שלי</Pill>
      </Footer>
    </div>
  );
}
function FlatlayFloat({ on, style }) {
  const { top, left, right, rotate, w, tone, d } = style;
  return (
    <div style={{
      position: "absolute", top, left, right, width: w,
      transform: on ? `rotate(${rotate}) scale(1)` : `rotate(${rotate}) scale(0.7)`,
      opacity: on ? 0.78 : 0,
      transition: `all 1.2s var(--ease-cinema)`, transitionDelay: d,
    }}>
      <Slot tone={tone} rounded={13} style={{ width: w, boxShadow: "var(--shadow-float)" }} />
    </div>
  );
}

/* ---------- 08 Soft sign-up ---------- */
function ScreenSignup({ next, back }) {
  const [email, setEmail] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar onBack={back} />
      <ScreenBody style={{ padding: "10px 24px 0" }}>
        {/* identity reminder — a real preview of what's being saved */}
        <div className="card" style={{ padding: 14, marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <Slot tone="tone-a" rounded={12} style={{ width: 54, flexShrink: 0 }} label="" />
            <div style={{ flex: 1 }}>
              <div className="t-mono" style={{ color: "var(--gold)", marginBottom: 5 }}>זהות הסטייל שלך</div>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 22, lineHeight: 1 }}>מינימל יוקרתי</div>
            </div>
          </div>
          <div className="hr" style={{ margin: "13px 0" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="t-label-sm" style={{ color: "var(--secondary)" }}>הפלטה שלך</span>
            <div style={{ display: "flex", gap: 5 }}>
              {["#E2D4BE", "#C9B69C", "#B08953", "#8C6B4F", "#3A322B"].map((c) => (
                <span key={c} style={{ width: 18, height: 18, borderRadius: 6, background: c }} />
              ))}
            </div>
          </div>
        </div>

        <h2 className="t-head" style={{ margin: 0, fontSize: 28 }}>שמרו את זהות<br />הסטייל שלכם</h2>
        <p className="t-subtitle" style={{ marginTop: 10, marginBottom: 26 }}>כדי שנשמור את הניתוח, הארון והלוקים שלכם, ונחזיר אתכם בדיוק לאן שהפסקתם.</p>

        <button className="pill" onClick={next}><Icon name="apple" size={20} stroke="var(--paper)" /> המשיכו עם אפל</button>
        <button className="pill pill--ghost" style={{ marginTop: 12 }} onClick={next}><Icon name="google" size={20} /> המשיכו עם גוגל</button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0" }}>
          <div className="hr" style={{ flex: 1 }} />
          <span className="t-label-sm" style={{ color: "var(--secondary)" }}>או</span>
          <div className="hr" style={{ flex: 1 }} />
        </div>

        <div style={{ position: "relative" }}>
          <input
            value={email} onChange={(e) => setEmail(e.target.value)} dir="rtl"
            placeholder="האימייל שלכם" inputMode="email"
            style={{ width: "100%", height: 56, borderRadius: 999, border: "1px solid var(--hairline)", background: "var(--paper)",
              padding: "0 22px", fontFamily: "var(--sans)", fontSize: 16, color: "var(--ink)", outline: "none" }}
          />
        </div>
      </ScreenBody>
      <Footer>
        <Pill variant={email ? undefined : "surface"} onClick={next}>המשיכו עם אימייל</Pill>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button className="btn-text" onClick={next}>אולי אחר כך</button>
        </div>
      </Footer>
    </div>
  );
}

/* ---------- 09 Permissions ---------- */
function ScreenPermissions({ next, back }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar onBack={back} />
      <ScreenBody style={{ padding: "10px 24px 0", alignItems: "stretch" }}>
        {/* realistic morning notification preview */}
        <div style={{ position: "relative", height: 244, marginTop: 14, marginBottom: 6 }}>
          {/* supporting look card behind */}
          <div className="card anim-rise" style={{ position: "absolute", top: 118, left: 34, right: 34, padding: 10, display: "flex", gap: 11, alignItems: "center", animationDelay: "0.5s" }}>
            <Slot tone="tone-a" rounded={10} style={{ width: 48, flexShrink: 0 }} label="" />
            <div style={{ flex: 1 }}>
              <div className="t-mono" style={{ color: "var(--gold)" }}>לוק יומי</div>
              <div className="t-label-sm" style={{ marginTop: 3 }}>חום חולי, קליל ל-24°</div>
            </div>
            <Icon name="chevronLeft" size={16} stroke="var(--secondary)" />
          </div>
          {/* the notification itself, in front */}
          <div className="card anim-rise" style={{ position: "absolute", top: 14, left: 10, right: 10, padding: "13px 14px", boxShadow: "var(--shadow-float)", animationDelay: "0.25s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="sun" size={17} stroke="var(--gold)" />
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--secondary)" }}>REFINED</span>
              <span style={{ marginInlineStart: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--secondary)" }}>עכשיו</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 3 }}>הלוק של היום מוכן</div>
            <div className="t-subtitle" style={{ fontSize: 13, lineHeight: 1.45 }}>בוקר טוב, נועה. מזג אוויר נעים היום, הנה מה שילך לך מצוין.</div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "10px 6px 0" }}>
          <div style={{ width: 48, height: 48, borderRadius: 99, background: "var(--gold-14)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Icon name="bell" size={24} stroke="var(--gold)" />
          </div>
          <h2 className="t-head" style={{ margin: 0, fontSize: 29 }}>קבלו לוק מותאם<br />בכל בוקר</h2>
          <p className="t-subtitle" style={{ marginTop: 12, maxWidth: 290, marginInline: "auto" }}>
            התראה רגועה אחת ביום, מותאמת למזג האוויר וליומן שלכם. בלי רעש מיותר.
          </p>
        </div>
      </ScreenBody>
      <Footer>
        <Pill onClick={next}>אפשרו התראות</Pill>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button className="btn-text" onClick={next}>לא עכשיו</button>
        </div>
      </Footer>
    </div>
  );
}

/* ---------- shared tab bar ---------- */
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "today", label: "היום", icon: "sun" },
    { id: "closet", label: "הארון", icon: "hanger" },
    { id: "chat", label: "סטייליסט", icon: "chat" },
    { id: "me", label: "אני", icon: "heart" },
  ];
  return (
    <div style={{ display: "flex", borderTop: "1px solid var(--hairline)", padding: "10px 12px calc(12px + env(safe-area-inset-bottom))", background: "var(--paper)" }}>
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 5, color: on ? "var(--ink)" : "var(--secondary)", padding: 4,
          }}>
            <Icon name={t.icon} size={22} stroke={on ? "var(--gold)" : "var(--secondary)"} />
            <span style={{ fontSize: 11, fontWeight: 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 10 Today ---------- */
function ScreenToday({ go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ScreenBody style={{ padding: "26px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-mono" style={{ color: "var(--secondary)", marginBottom: 6 }}>יום רביעי · 4 ביוני</div>
            <h2 className="t-title" style={{ margin: 0, whiteSpace: "nowrap" }}>בוקר טוב, נועה</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexShrink: 0 }} className="chip" >
            <Icon name="sun" size={16} stroke="var(--gold)" /><span className="t-label-sm">24°</span>
          </div>
        </div>

        {/* today's look hero */}
        <div style={{ marginTop: 22 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>הלוק של היום</div>
          <div className="card" style={{ overflow: "hidden" }}>
            <Slot tone="tone-a" rounded={0} style={{ width: "100%", aspectRatio: "3 / 4", borderRadius: 0 }} label="TODAY LOOK">
              <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: "40px 18px 18px",
                background: "linear-gradient(to top, rgba(27,23,20,0.62), rgba(27,23,20,0))" }}>
                <div style={{ color: "var(--paper)", fontWeight: 500, fontSize: 19 }}>חום חולי וקווים נקיים</div>
                <div style={{ color: "rgba(250,247,242,0.85)", fontSize: 14, marginTop: 4 }}>קליל לחום של היום, ומחמיא לגוון שלך.</div>
              </div>
            </Slot>
            <div style={{ display: "flex", padding: 12, gap: 10 }}>
              <button className="pill pill--surface" style={{ height: 46, fontSize: 15 }}><Icon name="swap" size={18} /> לוק אחר</button>
              <button className="pill" style={{ height: 46, fontSize: 15 }} onClick={() => go && go("look")}>הפרטים</button>
            </div>
          </div>
        </div>

        {/* quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, paddingBottom: 16 }}>
          <button className="card" onClick={() => go && go("closet")} style={{ border: "none", textAlign: "start", padding: 16, cursor: "pointer", background: "#fff" }}>
            <Icon name="hanger" size={22} stroke="var(--gold)" />
            <div style={{ fontWeight: 500, fontSize: 15, marginTop: 10 }}>הארון שלי</div>
            <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 2 }}>42 פריטים</div>
          </button>
          <button className="card" style={{ border: "none", textAlign: "start", padding: 16, cursor: "pointer", background: "#fff" }}>
            <Icon name="sparkle" size={22} stroke="var(--gold)" />
            <div style={{ fontWeight: 500, fontSize: 15, marginTop: 10 }}>לוק לאירוע</div>
            <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 2 }}>ספרו לי לאן</div>
          </button>
        </div>
      </ScreenBody>
      <TabBar active="today" onChange={(t) => go && go(t)} />
    </div>
  );
}

/* ---------- 11 Closet ---------- */
const CLOSET_FILTERS = ["הכל", "עליוניות", "מכנסיים", "שמלות", "נעליים", "אקססוריז"];
const CLOSET_ITEMS = [
  { label: "ז'קט צמר", sub: "בז' חולי", tone: "tone-a" },
  { label: "חולצת כותנה", sub: "לבן שמנת", tone: "tone-c" },
  { label: "מכנסי ישר", sub: "חום אדמה", tone: "tone-b" },
  { label: "סריג דק", sub: "טאופ", tone: "tone-a" },
  { label: "חצאית מידי", sub: "קאמל", tone: "tone-c" },
  { label: "מגף צ'לסי", sub: "טאופ", tone: "tone-b" },
  { label: "תיק יד", sub: "קוניאק", tone: "tone-a" },
  { label: "מעיל ארוך", sub: "פחם", tone: "tone-c" },
];
function ScreenCloset({ go }) {
  const [filter, setFilter] = useState("הכל");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="t-title" style={{ margin: 0, whiteSpace: "nowrap" }}>הארון שלי</h2>
          <button onClick={() => go && go("addsheet")} aria-label="הוספה" style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "none", borderRadius: 99, padding: "7px 14px", cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 500, fontSize: 13.5, color: "var(--ink)" }}>
            <Icon name="plus" size={16} stroke="var(--gold)" /> הוספה
          </button>
        </div>
      </div>
      <div className="no-scrollbar" style={{ display: "flex", gap: 9, padding: "16px 24px", overflowX: "auto" }}>
        {CLOSET_FILTERS.map((f) => (
          <button key={f} className={`chip${filter === f ? " chip--on" : ""}`} style={{ flexShrink: 0 }} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <ScreenBody style={{ padding: "4px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {CLOSET_ITEMS.map((it, i) => (
            <div key={i} onClick={() => go && go("piece")} style={{ cursor: "pointer" }}>
              <Slot tone={it.tone} rounded={16} label="GARMENT" style={{ width: "100%" }} />
              <div style={{ padding: "10px 2px 0" }}>
                <div style={{ fontWeight: 500, fontSize: 14.5 }}>{it.label}</div>
                <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 2 }}>{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </ScreenBody>
      <TabBar active="closet" onChange={(t) => go && go(t)} />
    </div>
  );
}

Object.assign(window, { ScreenReveal, ScreenSignup, ScreenPermissions, ScreenToday, ScreenCloset, TabBar });
