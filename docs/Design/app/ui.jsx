/* ============================================================
   REFINED — shared UI primitives (exported to window)
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- minimal line icons (simple strokes only) ---------- */
function Icon({ name, size = 22, stroke = "currentColor", sw = 1.6, style }) {
  const p = { fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    // chevron pointing RIGHT (RTL back)
    back: <path {...p} d="M9 5l7 7-7 7" />,
    chevronLeft: <path {...p} d="M15 5l-7 7 7 7" />,
    chevronDown: <path {...p} d="M6 9l6 6 6-6" />,
    camera: <g {...p}><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.2-1.8A1 1 0 0 1 9 4.7h6a1 1 0 0 1 .8.5L17 7h2.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="12.5" r="3.4"/></g>,
    gallery: <g {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M5 17l4.5-4 3 2.6L16 11l3.2 3.4"/></g>,
    check: <path {...p} d="M5 12.5l4.5 4.5L19 6.5" />,
    sparkle: <path {...p} d="M12 3.5l1.7 5.2 5.3 1.6-5.3 1.6L12 17l-1.7-5.1L5 10.3l5.3-1.6z" />,
    lock: <g {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2.4"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></g>,
    bell: <g {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6.5 2 7H4c.5-.5 2-2 2-7z"/><path d="M10 20a2 2 0 0 0 4 0"/></g>,
    sun: <g {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></g>,
    heart: <path {...p} d="M12 20s-7-4.7-7-9.6A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.4C19 15.3 12 20 12 20z" />,
    hanger: <g {...p}><path d="M12 6.5a2 2 0 1 1 1.6 3.2L4 16.5h16L13 11"/></g>,
    plus: <path {...p} d="M12 6v12M6 12h12" />,
    close: <path {...p} d="M6 6l12 12M18 6L6 18" />,
    edit: <g {...p}><path d="M5 19h3l9-9-3-3-9 9z"/><path d="M14 6l3 3"/></g>,
    grid: <g {...p}><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></g>,
    chat: <path {...p} d="M20 13.5A2.5 2.5 0 0 1 17.5 16H10l-4.5 3.5V16H6.5A2.5 2.5 0 0 1 4 13.5v-7A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z" />,
    send: <path {...p} d="M20 4L4 11l6 2.5L13 20l3-9z" />,
    arrowLeft: <path {...p} d="M19 12H5M11 6l-6 6 6 6" />,
    mail: <g {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/></g>,
    barcode: <g {...p}><path d="M4.5 6v12M7.5 6v12M10 6v12M13 6v12M15.5 6v12M19.5 6v12"/></g>,
    refresh: <g {...p}><path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L4 15"/><path d="M4 20v-5h5"/></g>,
    star: <path {...p} d="M12 4.5l2.3 4.7 5.2.6-3.9 3.5 1.1 5.1L12 16.3 7.2 18.5l1.1-5.1L4.5 9.8l5.2-.6z" />,
    image: <g {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M5 17l4.5-4 3 2.6L16 11l3.2 3.4"/></g>,
    swap: <g {...p}><path d="M7 8h11l-3-3M17 16H6l3 3"/></g>,
    apple: <path fill={stroke} stroke="none" d="M16.7 12.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.7-3.1.7-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.4 2.5-.4 6.2 1 8.2.7 1 1.4 2.1 2.5 2.1 1-.1 1.4-.7 2.6-.7 1.2 0 1.5.7 2.6.6 1.1 0 1.8-1 2.4-2.1.8-1.1 1.1-2.3 1.1-2.3s-2.1-.8-2.1-3.1zM14.8 6.5c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.1z" />,
    google: <g><path fill="#1B1714" d="M21 12.2c0-.6-.1-1.2-.2-1.8H12v3.4h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-6.9z" opacity="0.9"/><path fill="#1B1714" d="M12 21c2.4 0 4.5-.8 6-2.2l-3.1-2.4c-.8.6-2 .9-2.9.9-2.3 0-4.2-1.5-4.9-3.6H3.9v2.4A9 9 0 0 0 12 21z" opacity="0.6"/><path fill="#1B1714" d="M7.1 13.7a5.4 5.4 0 0 1 0-3.4V7.9H3.9a9 9 0 0 0 0 8.1z" opacity="0.4"/><path fill="#1B1714" d="M12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 3.9 7.9l3.2 2.4C7.8 8.1 9.7 6.6 12 6.6z" opacity="0.75"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}

/* ---------- 3:4 portrait placeholder slot ---------- */
function Slot({ label, tone, className = "", style, children, rounded }) {
  const toneCls = tone ? ` slot--${tone}` : "";
  return (
    <div className={`slot${toneCls} ${className}`} style={{ ...(rounded ? { borderRadius: rounded } : {}), ...style }}>
      {children}
      {label && <span className="slot__label">{label}</span>}
    </div>
  );
}

/* ---------- pill button ---------- */
function Pill({ children, variant, onClick, disabled, style }) {
  const v = variant ? ` pill--${variant}` : "";
  return (
    <button className={`pill${v}`} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}

/* ---------- progress (fills RTL) ---------- */
function Progress({ step, total }) {
  const pct = Math.max(0, Math.min(100, (step / total) * 100));
  return (
    <div className="progress">
      <div className="progress__fill" style={{ width: pct + "%" }} />
    </div>
  );
}

/* ---------- top bar: back chevron (RTL → points right) + progress ---------- */
function TopBar({ onBack, step, total, light }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 22px 0" }}>
      {onBack ? (
        <button onClick={onBack} aria-label="חזרה" style={{
          background: "none", border: "none", padding: 6, margin: "-6px", cursor: "pointer",
          color: light ? "var(--paper)" : "var(--ink)", display: "flex", flexShrink: 0,
        }}>
          <Icon name="back" size={24} />
        </button>
      ) : <div style={{ width: 24, flexShrink: 0 }} />}
      {total ? <div style={{ flex: 1 }}><Progress step={step} total={total} /></div> : <div style={{ flex: 1 }} />}
      <div style={{ width: 24, flexShrink: 0 }} />
    </div>
  );
}

/* ---------- screen scroll container ---------- */
function ScreenBody({ children, style, className = "" }) {
  return (
    <div className={`no-scrollbar ${className}`} style={{
      flex: 1, overflowY: "auto", overflowX: "hidden",
      display: "flex", flexDirection: "column", ...style,
    }}>
      {children}
    </div>
  );
}

/* ---------- sticky footer CTA region with paper fade ---------- */
function Footer({ children }) {
  return (
    <div style={{ padding: "14px 22px calc(20px + env(safe-area-inset-bottom))", position: "relative" }}>
      {children}
    </div>
  );
}

Object.assign(window, { Icon, Slot, Pill, Progress, TopBar, ScreenBody, Footer });
