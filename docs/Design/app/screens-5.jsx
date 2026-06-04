/* ============================================================
   REFINED — screens batch 5 (secondary screens & states)
   1 Add sheet · 2 Piece detail · 3 Paywall
   4 Empty · 5 Loading · 6 Error
   ============================================================ */

/* ---------- 1 · Add-to-closet bottom sheet ---------- */
const ADD_METHODS = [
  { id: "camera", icon: "camera", label: "צלמו פריט", sub: "תמונה אחת והוא בארון" },
  { id: "gallery", icon: "image", label: "מהגלריה", sub: "בחרו תמונה קיימת" },
  { id: "gmail", icon: "mail", label: "ייבוא מ-Gmail", sub: "מאישורי הזמנות" },
  { id: "barcode", icon: "barcode", label: "סריקת ברקוד", sub: "סורקים תווית" },
];
function ScreenAddSheet({ go }) {
  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {/* dimmed closet backdrop */}
      <div style={{ position: "absolute", inset: 0, padding: "60px 22px 0", filter: "blur(1px)", opacity: 0.5 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {["tone-a", "tone-c", "tone-b", "tone-a"].map((t, i) => <Slot key={i} tone={t} rounded={16} style={{ width: "100%" }} />)}
        </div>
      </div>
      <div className="scrim-in" onClick={() => go && go("closet")} style={{ position: "absolute", inset: 0, background: "rgba(27,23,20,0.34)" }} />

      {/* sheet */}
      <div className="sheet-up" style={{ position: "absolute", insetInline: 0, bottom: 0, background: "var(--paper)",
        borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "12px 22px calc(26px + env(safe-area-inset-bottom))",
        boxShadow: "0 -20px 50px -20px rgba(27,23,20,0.4)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: "var(--hairline)", margin: "0 auto 18px" }} />
        <div className="t-eyebrow" style={{ marginBottom: 10 }}>הוסיפו לארון</div>
        <h2 className="t-head" style={{ margin: "0 0 6px", fontSize: 26 }}>איך נוסיף את הפריט?</h2>
        <p className="t-subtitle" style={{ margin: "0 0 20px", fontSize: 15 }}>בכל דרך, אנחנו מזהים את הפריט ומתאימים לו לוקים.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {ADD_METHODS.map((m) => (
            <button key={m.id} onClick={() => go && go("loading")} className="card" style={{ border: "none", cursor: "pointer", textAlign: "start", padding: 16 }}>
              <span style={{ width: 42, height: 42, borderRadius: 13, background: "var(--gold-14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={m.icon} size={21} stroke="var(--gold)" />
              </span>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{m.label}</div>
              <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 3 }}>{m.sub}</div>
            </button>
          ))}
        </div>
        <button className="btn-text" onClick={() => go && go("closet")} style={{ display: "block", margin: "16px auto 0" }}>ביטול</button>
      </div>
    </div>
  );
}

/* ---------- 2 · Piece detail ---------- */
const PIECE_ATTRS = [
  { k: "סוג", v: "ז'קט אוברסייז" },
  { k: "צבע", v: "בז' חולי" },
  { k: "בד", v: "צמר מצונן" },
  { k: "פורמליות", v: "סמארט קז'ואל" },
];
function ScreenPiece({ go, back }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px 8px" }}>
        <button onClick={() => go && go("closet")} aria-label="חזרה" style={{ background: "none", border: "none", padding: 6, margin: -6, cursor: "pointer", color: "var(--ink)", display: "flex" }}>
          <Icon name="back" size={24} />
        </button>
        <div className="t-mono" style={{ color: "var(--secondary)", fontSize: 9.5 }}>פריט מהארון</div>
        <button aria-label="עריכה" style={{ background: "none", border: "none", padding: 6, margin: -6, cursor: "pointer", color: "var(--ink)", display: "flex" }}>
          <Icon name="edit" size={21} />
        </button>
      </div>
      <ScreenBody style={{ padding: "8px 22px 0" }}>
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-float)" }}>
          <Slot tone="tone-a" rounded={24} style={{ width: "100%", aspectRatio: "3 / 4" }} label="">
            <div style={{ position: "absolute", top: 14, insetInlineStart: 14 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 12px", borderRadius: 99, background: "rgba(250,247,242,0.92)", backdropFilter: "blur(6px)", fontSize: 11, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--gold)" }} /> נלבש 12 פעמים
              </span>
            </div>
          </Slot>
        </div>

        <h2 className="t-head" style={{ margin: "20px 0 0", fontSize: 27 }}>ז'קט אוברסייז</h2>
        <div className="t-subtitle" style={{ marginTop: 4 }}>אחד מפריטי הליבה של הסטייל שלך.</div>

        <div className="card" style={{ marginTop: 18, overflow: "hidden" }}>
          {PIECE_ATTRS.map((a, i) => (
            <div key={a.k}>
              {i > 0 && <div className="hr" style={{ marginInline: 16 }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "14px 16px" }}>
                <span className="t-label-sm" style={{ color: "var(--secondary)", flexShrink: 0 }}>{a.k}</span>
                <span style={{ fontWeight: 500, fontSize: 14.5, whiteSpace: "nowrap" }}>{a.v}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="t-label" style={{ marginBottom: 12 }}>לוקים עם הפריט</div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 11, overflowX: "auto", paddingBottom: 2 }}>
            {[["tone-a", "לוק יום"], ["tone-c", "ערב"], ["tone-b", "סוף שבוע"]].map(([t, l], i) => (
              <div key={i} style={{ width: 96, flexShrink: 0 }} onClick={() => go && go("look")}>
                <Slot tone={t} rounded={13} style={{ width: 96 }} label="" />
                <div style={{ fontWeight: 500, fontSize: 12.5, marginTop: 7 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 18 }} />
      </ScreenBody>
      <Footer>
        <Pill onClick={() => go && go("look")}>בנו לוק עם הפריט</Pill>
      </Footer>
    </div>
  );
}

/* ---------- 3 · Paywall — Refined Plus ---------- */
const PLUS_VALUES = [
  { icon: "sparkle", title: "לוקים ללא הגבלה", line: "כל בוקר, לכל אירוע, בלי ספירת קרדיטים." },
  { icon: "chat", title: "הסטייליסט תמיד זמין", line: "שאלו כל דבר, מקבלים תשובה מהארון שלכם." },
  { icon: "heart", title: "מדידה וירטואלית", line: "לראות את הלוק עליכם. בקרוב." },
];
function ScreenPaywall({ go }) {
  const [plan, setPlan] = useState("year");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 22px 0" }}>
        <button onClick={() => go && go("today")} aria-label="סגירה" style={{ background: "none", border: "none", padding: 6, cursor: "pointer", color: "var(--secondary)", display: "flex" }}>
          <Icon name="close" size={22} />
        </button>
      </div>
      <ScreenBody style={{ padding: "6px 24px 0" }}>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>Refined Plus</div>
        <h1 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 38, lineHeight: 1.08 }}>סטייל בלי<br />גבולות</h1>
        <p className="t-subtitle" style={{ marginTop: 12, marginBottom: 26 }}>הסטייליסט המלא שלכם, זמין תמיד. בלי לחץ, בלי ספירה.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 26 }}>
          {PLUS_VALUES.map((v) => (
            <div key={v.title} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
              <span style={{ width: 38, height: 38, borderRadius: 12, background: "var(--gold-14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={v.icon} size={19} stroke="var(--gold)" />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{v.title}</div>
                <div className="t-subtitle" style={{ fontSize: 13.5, marginTop: 2, lineHeight: 1.45 }}>{v.line}</div>
              </div>
            </div>
          ))}
        </div>

        {/* testimonial */}
        <div className="card" style={{ padding: 18, marginBottom: 26 }}>
          <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
            {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={14} stroke="var(--gold)" />)}
          </div>
          <p style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 400, fontSize: 17, lineHeight: 1.5 }}>
            סוף סוף אני יודעת מה ללבוש בבוקר, בלי להתלבט.
          </p>
          <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 10 }}>נועה ל. · מנויה מאז ינואר</div>
        </div>

        {/* plan choice */}
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {[
            { id: "year", t: "שנתי", p: "₪29 לחודש", note: "חיוב שנתי · חודשיים מתנה", badge: "הכי משתלם" },
            { id: "month", t: "חודשי", p: "₪39 לחודש", note: "חיוב חודשי", badge: null },
          ].map((o) => {
            const on = plan === o.id;
            return (
              <button key={o.id} onClick={() => setPlan(o.id)} style={{
                position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "start",
                padding: "16px 18px", borderRadius: 18, cursor: "pointer",
                background: on ? "var(--gold-14)" : "#fff",
                boxShadow: on ? "0 0 0 1.5px var(--gold)" : "var(--shadow-card)", border: "none",
                transition: "all 0.3s var(--ease-cinema)",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{o.t}</span>
                    {o.badge && <span style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.1em", color: "var(--gold)", background: "var(--paper)", padding: "3px 8px", borderRadius: 99 }}>{o.badge}</span>}
                  </div>
                  <div className="t-label-sm" style={{ color: "var(--secondary)", marginTop: 4 }}>{o.note}</div>
                </div>
                <div style={{ textAlign: "end" }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{o.p}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ height: 14 }} />
      </ScreenBody>
      <Footer>
        <Pill variant="gold" onClick={() => go && go("today")}>התחילו 7 ימי ניסיון</Pill>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span className="t-label-sm" style={{ color: "var(--secondary)" }}>בלי התחייבות. בטלו בכל רגע.</span>
        </div>
      </Footer>
    </div>
  );
}

/* ---------- 4 · Empty closet ---------- */
function ScreenEmpty({ go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="t-title" style={{ margin: 0, whiteSpace: "nowrap" }}>הארון שלי</h2>
          <span className="t-label" style={{ color: "var(--secondary)" }}>0 פריטים</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 30px", textAlign: "center" }}>
        {/* soft layered empty slots */}
        <div style={{ position: "relative", width: 168, height: 168, marginBottom: 30 }}>
          {[{ r: "-11deg", l: -6, t: 18, z: 1, o: 0.6 }, { r: "8deg", l: 70, t: 10, z: 1, o: 0.6 }, { r: "0deg", l: 34, t: 0, z: 2, o: 1 }].map((s, i) => (
            <div key={i} className="floaty" style={{ "--rot": s.r, position: "absolute", left: s.l, top: s.t, width: 64, zIndex: s.z, opacity: s.o, animationDelay: `${i * 0.5}s` }}>
              <div style={{ width: 64, aspectRatio: "3 / 4", borderRadius: 14, border: "1.5px dashed var(--gold-28)", background: "var(--surface)",
                display: "flex", alignItems: "center", justifyContent: "center", boxShadow: s.z === 2 ? "var(--shadow-card)" : "none" }}>
                {s.z === 2 && <Icon name="plus" size={22} stroke="var(--gold)" />}
              </div>
            </div>
          ))}
        </div>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>הארון שלך</div>
        <h1 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 34 }}>הארון שלך מחכה</h1>
        <p className="t-subtitle" style={{ marginTop: 12, maxWidth: 280 }}>הוסיפו כמה פריטים, ונתחיל להרכיב לכם לוקים אמיתיים שמתאימים בדיוק לכם.</p>
      </div>
      <Footer>
        <Pill onClick={() => go && go("addsheet")}><Icon name="plus" size={20} stroke="var(--paper)" /> הוסיפו את הפריטים הראשונים</Pill>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button className="btn-text" onClick={() => go && go("capture")}>או צלמו תמונת גוף מלא</button>
        </div>
      </Footer>
      <TabBar active="closet" onChange={(t) => go && go(t)} />
    </div>
  );
}

/* ---------- 5 · Loading ---------- */
function ScreenLoading({ go }) {
  useEffect(() => { const t = setTimeout(() => go && go("today"), 4200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 36px" }}>
      <div style={{ position: "relative", width: 150, height: 200, marginBottom: 40 }}>
        {/* gently floating flatlay */}
        {[{ t: "tone-a", l: 24, top: 18, r: "-8deg", w: 86, d: "0s", z: 2 }, { t: "tone-c", l: -2, top: 64, r: "-13deg", w: 60, d: "0.4s", z: 1 }, { t: "tone-b", l: 86, top: 70, r: "10deg", w: 56, d: "0.7s", z: 1 }].map((s, i) => (
          <div key={i} className="floaty" style={{ "--rot": s.r, position: "absolute", left: s.l, top: s.top, width: s.w, zIndex: s.z, animationDelay: s.d }}>
            <Slot tone={s.t} rounded={13} style={{ width: s.w, boxShadow: "var(--shadow-float)" }} label="" />
          </div>
        ))}
      </div>
      <div className="t-eyebrow" style={{ marginBottom: 14 }}>רגע אחד</div>
      <h1 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 30, lineHeight: 1.2 }}>מסדרים לך<br />את הסטייל</h1>
      <p className="t-subtitle" style={{ marginTop: 12, maxWidth: 250 }}>מתאימים את הפריט לפלטה, לפרופורציות ולטעם שלך.</p>
      <div style={{ width: 160, marginTop: 24, overflow: "hidden", borderRadius: 99 }}>
        <div className="progress" style={{ background: "var(--hairline)" }}>
          <div className="progress__fill loading-bar" style={{ width: "40%" }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- 6 · Error / analysis failed ---------- */
function ScreenError({ go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 34px" }}>
        <div style={{ position: "relative", width: 84, height: 84, marginBottom: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="pulse-ring" style={{ position: "absolute", inset: 0, borderRadius: 99, border: "1.5px solid var(--gold)" }} />
          <div style={{ width: 64, height: 64, borderRadius: 99, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="camera" size={28} stroke="var(--gold)" />
          </div>
        </div>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>כמעט שם</div>
        <h1 style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 29, lineHeight: 1.2 }}>לא הצלחנו לנתח<br />את התמונה</h1>
        <p className="t-subtitle" style={{ marginTop: 12, maxWidth: 270 }}>אולי התמונה קצת חתוכה או חשוכה. תמונת גוף מלא בתאורה טובה תעבוד מצוין.</p>
      </div>
      <Footer>
        <Pill onClick={() => go && go("capture")}><Icon name="refresh" size={19} stroke="var(--paper)" /> נסו תמונה אחרת</Pill>
        <button className="pill pill--ghost" style={{ marginTop: 12 }} onClick={() => go && go("capture")}>
          <Icon name="image" size={19} /> בחרו מהגלריה
        </button>
      </Footer>
    </div>
  );
}

Object.assign(window, { ScreenAddSheet, ScreenPiece, ScreenPaywall, ScreenEmpty, ScreenLoading, ScreenError });
