import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Zap, Activity, Users } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   SOLACE — THE WOW EDITION
   Cinematic Deep-Space Dashboard
   ═══════════════════════════════════════════════════════════════════ */

function StarfieldCanvas({ count = 120 }) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.15 + 0.02,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      starsRef.current.forEach(s => {
        s.y -= s.speed;
        s.pulse += 0.015;
        if (s.y < -2) {
          s.y = canvas.offsetHeight + 2;
          s.x = Math.random() * canvas.offsetWidth;
        }
        const flicker = s.opacity + Math.sin(s.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${Math.max(0.05, flicker)})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
}

function CircularGauge({ value, max = 100, size = 80, color = "#22d3ee", label }) {
  const pct = Math.min(value / max, 1);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <span className="text-xs text-slate-400 font-light tracking-wide">{label}</span>
    </div>
  );
}

function NumeroAnimato({ valore, decimali = 1 }) {
  const [display, setDisplay] = useState(valore);
  const ref = useRef({ valore, raf: null, inizio: null });

  useEffect(() => {
    const da = ref.current.valore;
    const a = valore;
    if (Math.abs(da - a) < 0.01) { ref.current.valore = a; setDisplay(a); return; }
    ref.current.inizio = performance.now();

    const anima = (ora) => {
      const t = Math.min((ora - ref.current.inizio) / 900, 1);
      const e = 1 - Math.pow(1 - t, 4);
      const c = da + (a - da) * e;
      ref.current.valore = c;
      setDisplay(c);
      if (t < 1) ref.current.raf = requestAnimationFrame(anima);
    };

    if (ref.current.raf) cancelAnimationFrame(ref.current.raf);
    ref.current.raf = requestAnimationFrame(anima);
    return () => { if (ref.current.raf) cancelAnimationFrame(ref.current.raf); };
  }, [valore]);

  return <span>{display.toFixed(decimali)}</span>;
}

export default function DashboardSolace() {
  const [tab, setTab] = useState("panoramica");
  const [astronautaSelezionato, setAstronautaSelezionato] = useState(1);
  const [showSplash, setShowSplash] = useState(true);
  const [splashPhase, setSplashPhase] = useState(0);
  const [splashExit, setSplashExit] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashPhase(1), 300);   // genesis dot appears
    const t2 = setTimeout(() => setSplashPhase(2), 780);   // orbital expand + shockwave
    const t3 = setTimeout(() => setSplashPhase(3), 1750);  // letter-by-letter title
    const t4 = setTimeout(() => setSplashPhase(4), 3000);  // scan line sweep
    const t5 = setTimeout(() => setSplashExit(true), 4100); // elegant fade out
    const t6 = setTimeout(() => setShowSplash(false), 5200); // remove from DOM
    const iv = setInterval(() => setLoadPct(p => Math.min(p + Math.random() * 10 + 2, 100)), 175);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearInterval(iv); };
  }, []);

  const ASTRONAUTI = [
    { id: 1, nome: "Luca Marini", ruolo: "Comandante", stato: "Eccellente", fc: 72, pressione: "118/76", o2: 98, stress: 24, sonno: 6.2, energia: 85, ritmo: "Picco 14:30-18:00", muscoli: "Buono", immunita: "Forte" },
    { id: 2, nome: "Sofia Chen", ruolo: "Medico", stato: "Eccellente", fc: 68, pressione: "115/74", o2: 99, stress: 18, sonno: 7.1, energia: 92, ritmo: "Picco 05:30-09:30", muscoli: "Eccellente", immunita: "Eccellente" },
    { id: 3, nome: "Marco Rossi", ruolo: "Ingegnere", stato: "Critico", fc: 88, pressione: "128/82", o2: 95, stress: 78, sonno: 4.8, energia: 28, ritmo: "Irregolare", muscoli: "Critico", immunita: "Soppresso" },
    { id: 4, nome: "Elena Bianchi", ruolo: "Scienziato", stato: "Buono", fc: 74, pressione: "120/75", o2: 98, stress: 32, sonno: 6.8, energia: 78, ritmo: "Picco 14:00-17:30", muscoli: "Buono", immunita: "Buono" },
  ];

  const HABITAT = {
    temperatura: { valore: 22.1, min: 20, max: 25, unita: "°C" },
    umidita: { valore: 48, min: 30, max: 65, unita: "%" },
    co2: { valore: 410, min: 300, max: 800, unita: "ppm" },
    o2: { valore: 20.9, min: 19, max: 22, unita: "%" },
    pressione: { valore: 101.3, min: 98, max: 104, unita: "kPa" },
    radiazione: { valore: 0.15, min: 0, max: 1.0, unita: "mSv/h" },
    batterie: { valore: 92, min: 20, max: 100, unita: "%" },
    acqua: { valore: 87, min: 10, max: 100, unita: "%" },
  };

  const AVVISI = [
    { tipo: "critico", titolo: "Marco Rossi: Burnout Imminente", descrizione: "Stress critico 78%. Sonno 4.8h. Immunità soppresa. Intervento immediato.", azione: "Attivare Protocollo" },
    { tipo: "info", titolo: "Sofia Chen: Picco Performance", descrizione: "Condizioni ottimali. Finestra critica 05:30-09:30.", azione: "Assegnare Task" },
    { tipo: "warning", titolo: "Risorse Idriche", descrizione: "Osmosi inversa al 95%. Autonomia 12 giorni.", azione: "Ispezionare" },
  ];

  const RACCOMANDAZIONI = [
    { tipo: "critico", text: "Marco Rossi: Riposo immediato 8h. Ridurre carico 60%. Meditazione 4h giornaliere." },
    { tipo: "info", text: "Sofia Chen al picco biologico. Operazioni critiche: 05:30-09:30." },
    { tipo: "warning", text: "Aumentare apporto calorico +300 kcal/giorno per attività EVA." },
    { tipo: "info", text: "Habitat nominale. Tutti i parametri in range. Aria eccellente." },
    { tipo: "warning", text: "Controllare osmosi inversa entro 48h. Riserva idrica: 12 giorni." },
    { tipo: "info", text: "Coesione equipaggio 78%. Compatibilità massima Luca-Sofia 89%." },
    { tipo: "warning", text: "Luca Marini: task critici ottimali 14:30-18:00 (sincronizzazione circadiana)." },
  ];

  const ast = ASTRONAUTI.find(a => a.id === astronautaSelezionato);

  /* ═══════════════════════════════════════════════
     SPLASH SCREEN — CINEMATIC
     ═══════════════════════════════════════════════ */

  if (showSplash) {
    return (
      <div
        className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden"
        style={{
          opacity: splashExit ? 0 : 1,
          transition: splashExit ? "opacity 1.1s cubic-bezier(0.4,0,1,1)" : "none",
          pointerEvents: splashExit ? "none" : "auto",
        }}
      >
        <style>{`
          @keyframes orbit1 { from { transform: rotate(0deg) translateX(90px) rotate(0deg); } to { transform: rotate(360deg) translateX(90px) rotate(-360deg); } }
          @keyframes orbit2 { from { transform: rotate(120deg) translateX(68px) rotate(-120deg); } to { transform: rotate(480deg) translateX(68px) rotate(-480deg); } }
          @keyframes orbit3 { from { transform: rotate(240deg) translateX(110px) rotate(-240deg); } to { transform: rotate(600deg) translateX(110px) rotate(-600deg); } }
          @keyframes corePulse { 0%,100% { box-shadow: 0 0 22px 5px rgba(34,211,238,0.35), 0 0 80px 16px rgba(34,211,238,0.1); } 50% { box-shadow: 0 0 44px 12px rgba(34,211,238,0.6), 0 0 130px 28px rgba(34,211,238,0.18); } }
          @keyframes shockwave { 0% { transform: scale(0.9); opacity: 0.75; } 100% { transform: scale(5.5); opacity: 0; } }
          @keyframes scanSweep { 0% { top: -3px; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { top: calc(100% + 3px); opacity: 0; } }
          @keyframes auroraBreath { 0%,100% { opacity: 0.65; } 50% { opacity: 1; } }
          @keyframes genesisDot { 0% { opacity:0; transform:scale(0); } 60% { opacity:1; transform:scale(1.3); } 100% { opacity:1; transform:scale(1); } }
          .orbit-s1 { animation: orbit1 9s linear infinite; }
          .orbit-s2 { animation: orbit2 14s linear infinite; }
          .orbit-s3 { animation: orbit3 5.5s linear infinite; }
          .core-glow { animation: corePulse 2.2s ease-in-out infinite; }
          .aurora-breath { animation: auroraBreath 3.5s ease-in-out infinite; }
        `}</style>

        <StarfieldCanvas count={220} />

        {/* Aurora — top */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none aurora-breath"
          style={{
            height: "55%",
            background: "radial-gradient(ellipse 65% 100% at 50% 0%, rgba(34,211,238,0.11) 0%, rgba(56,189,248,0.04) 45%, transparent 70%)",
            opacity: splashPhase >= 2 ? 1 : 0,
            transition: "opacity 2s ease",
          }}
        />
        {/* Aurora — indigo bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "40%",
            background: "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(99,102,241,0.07) 0%, transparent 70%)",
            opacity: splashPhase >= 3 ? 1 : 0,
            transition: "opacity 2.5s ease",
          }}
        />

        <div className="relative z-10 flex flex-col items-center" style={{ perspective: "1200px" }}>

          {/* ── Orbital system ── */}
          <div className="relative flex items-center justify-center mb-16" style={{ width: 260, height: 260 }}>

            {/* SVG orbit paths — draw themselves via stroke-dashoffset */}
            <svg className="absolute inset-0" width="260" height="260" viewBox="0 0 260 260" style={{ overflow: "visible" }}>
              {[
                { r: 90,  circ: 565.5, stroke: "rgba(34,211,238,0.07)",  delay: 0   },
                { r: 68,  circ: 427.3, stroke: "rgba(255,255,255,0.04)", delay: 160 },
                { r: 110, circ: 691.2, stroke: "rgba(255,255,255,0.03)", delay: 80  },
              ].map(({ r, circ, stroke, delay }, i) => (
                <circle
                  key={i}
                  cx="130" cy="130" r={r}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="1"
                  strokeDasharray={circ}
                  strokeDashoffset={splashPhase >= 2 ? 0 : circ}
                  style={{
                    transition: `stroke-dashoffset 2.2s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
                    transformOrigin: "130px 130px",
                    transform: "rotate(-90deg)",
                  }}
                />
              ))}
            </svg>

            {/* Shockwave rings — rendered only at phase 2 so animation auto-starts */}
            {splashPhase >= 2 && [0, 280, 560].map((delay, i) => (
              <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div style={{
                  width: 44, height: 44,
                  borderRadius: "50%",
                  border: `1px solid rgba(34,211,238,${0.7 - i * 0.18})`,
                  animation: `shockwave 1.7s ${delay}ms cubic-bezier(0,0,0.2,1) forwards`,
                }} />
              </div>
            ))}

            {/* Core — starts as tiny dot, expands with spring at phase 2 */}
            <div
              className={splashPhase >= 2 ? "core-glow" : ""}
              style={{
                width:  splashPhase >= 2 ? 52 : (splashPhase >= 1 ? 10 : 0),
                height: splashPhase >= 2 ? 52 : (splashPhase >= 1 ? 10 : 0),
                borderRadius: "50%",
                background: "linear-gradient(135deg, #67e8f9 0%, #0ea5e9 55%, #6366f1 100%)",
                opacity: splashPhase >= 1 ? 1 : 0,
                transition: splashPhase >= 2
                  ? "width 0.55s cubic-bezier(0.34,1.56,0.64,1), height 0.55s cubic-bezier(0.34,1.56,0.64,1)"
                  : "width 0.4s ease, height 0.4s ease, opacity 0.45s ease",
                flexShrink: 0,
              }}
            />

            {/* Orbiting satellites */}
            {splashPhase >= 2 && (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="orbit-s1">
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#67e8f9", boxShadow: "0 0 18px 5px rgba(103,232,249,0.7)" }} />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="orbit-s2">
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 14px 4px rgba(56,189,248,0.6)" }} />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="orbit-s3">
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c4b5fd", boxShadow: "0 0 16px 5px rgba(196,181,253,0.55)" }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Title — each letter flips in with 3-D perspective ── */}
          <div className="relative mb-8" style={{ perspective: "900px" }}>
            <h1 className="text-7xl sm:text-8xl font-extralight text-white select-none flex" style={{ letterSpacing: "0.2em" }}>
              {"SOLACE".split("").map((letter, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity:   splashPhase >= 3 ? 1 : 0,
                    transform: splashPhase >= 3 ? "translateY(0) rotateX(0deg)" : "translateY(50px) rotateX(-75deg)",
                    filter:    splashPhase >= 3 ? "blur(0)" : "blur(8px)",
                    transition: [
                      `opacity   0.65s cubic-bezier(0.23,1,0.32,1) ${90 + i * 90}ms`,
                      `transform 0.75s cubic-bezier(0.23,1,0.32,1) ${90 + i * 90}ms`,
                      `filter    0.55s ease                         ${90 + i * 90}ms`,
                    ].join(", "),
                    transformOrigin: "bottom center",
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>


          </div>

          {/* Thin divider line that extends after scan */}
          <div style={{
            width: splashPhase >= 4 ? 88 : 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.45), transparent)",
            transition: "width 0.9s cubic-bezier(0.4,0,0.2,1) 0.25s",
          }} />
        </div>

        {/* ── Progress ── */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-44">
          <div className="relative h-px rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div style={{
              position: "absolute",
              top: 0, left: 0, bottom: 0,
              width: `${loadPct}%`,
              background: "linear-gradient(90deg, rgba(34,211,238,0.25), #22d3ee, rgba(255,255,255,0.85), #22d3ee, rgba(34,211,238,0.25))",
              boxShadow: "0 0 8px rgba(34,211,238,0.7)",
              transition: "width 0.3s ease-out",
              borderRadius: 9999,
            }} />
          </div>
          <p className="text-center mt-3 font-light tabular-nums" style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            color: "rgba(100,116,139,0.7)",
          }}>
            {Math.round(loadPct)} %
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     MAIN DASHBOARD
     ═══════════════════════════════════════════════ */

  const TABS = [
    { id: "panoramica", label: "Panoramica" },
    { id: "astronauti", label: "Equipaggio" },
    { id: "habitat", label: "Habitat" },
    { id: "raccomandazioni", label: "Raccomandazioni" },
  ];

  return (
    <div className="w-full min-h-screen bg-black relative overflow-x-hidden" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", animation: "dashFadeIn 0.9s ease-out both" }}>
      <style>{`
        @keyframes dashFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glowSoft { 0%,100% { box-shadow: 0 0 20px rgba(34,211,238,0.15); } 50% { box-shadow: 0 0 40px rgba(34,211,238,0.25); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .glow-soft { animation: glowSoft 4s ease-in-out infinite; }
        .shimmer-bg { background: linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.08) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* Starfield behind everything */}
      <StarfieldCanvas count={80} />

      {/* Subtle radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-black/60 border-b border-white/[0.06] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center glow-soft">
                <svg width="20" height="20" viewBox="0 0 120 120" fill="none">
                  <circle cx="35" cy="40" r="6" fill="white" opacity="0.8" />
                  <circle cx="60" cy="28" r="7" fill="white" opacity="0.9" />
                  <circle cx="85" cy="40" r="6" fill="white" opacity="0.8" />
                  <circle cx="60" cy="60" r="5" fill="white" opacity="1" />
                  <path d="M 30 60 Q 45 50 60 55 Q 75 50 90 60" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-extralight text-white tracking-wide">SOLACE</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
              <span className="text-[11px] text-slate-400 font-light tracking-wide">Operativo</span>
            </div>
          </div>

          {/* ── TAB BAR ── full-width, prominent */}
          <div className="flex gap-4">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative flex-1 py-4 text-center transition-all"
              >
                <span className={`text-sm font-light tracking-wide transition-colors ${
                  tab === t.id ? "text-cyan-300" : "text-slate-500 hover:text-slate-300"
                }`}>
                  {t.label}
                </span>

                {/* Active indicator */}
                {tab === t.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-cyan-400" style={{ boxShadow: "0 0 12px rgba(34,211,238,0.6)" }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-10 pb-24">

        {/* ═══ PANORAMICA ═══ */}
        {tab === "panoramica" && (
          <div className="space-y-10">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Equipaggio Sano", val: 3, max: 4, color: "#22d3ee" },
                { label: "Habitat Nominale", val: 8, max: 8, color: "#38bdf8" },
                { label: "Stress Medio", val: 38, max: 100, color: "#fbbf24" },
                { label: "Energia Media", val: 71, max: 100, color: "#a78bfa" },
              ].map((kpi, i) => (
                <div key={i} className={`fade-up fade-up-${i + 1} border border-white/[0.06] rounded-2xl p-6 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all group`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500 font-light uppercase tracking-wider mb-3">{kpi.label}</p>
                      <p className="text-4xl font-extralight text-white">
                        <NumeroAnimato valore={kpi.val} decimali={0} />
                        <span className="text-lg text-slate-600 ml-1">/{kpi.max}</span>
                      </p>
                    </div>
                    <CircularGauge value={kpi.val} max={kpi.max} size={56} color={kpi.color} />
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts */}
            <div className="space-y-4">
              <p className="text-[11px] text-slate-500 font-light uppercase tracking-wider">Avvisi Critici</p>
              {AVVISI.map((a, i) => {
                const colors = {
                  critico: { border: "border-red-500/40", dot: "bg-red-500", title: "text-red-300", btn: "bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30" },
                  warning: { border: "border-amber-500/40", dot: "bg-amber-500", title: "text-amber-300", btn: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30" },
                  info: { border: "border-sky-500/40", dot: "bg-sky-500", title: "text-sky-300", btn: "bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30" },
                }[a.tipo];

                return (
                  <div key={i} className={`fade-up fade-up-${i + 1} rounded-2xl p-6 border ${colors.border} bg-white/[0.02] backdrop-blur-sm`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} style={{ boxShadow: `0 0 8px currentColor` }} />
                      <div className="flex-1">
                        <h3 className={`font-light text-base mb-1.5 ${colors.title}`}>{a.titolo}</h3>
                        <p className="text-sm text-slate-400 font-light mb-4">{a.descrizione}</p>
                        <button className={`px-4 py-1.5 rounded-lg text-xs font-light border transition-all ${colors.btn}`}>
                          {a.azione}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ EQUIPAGGIO ═══ */}
        {tab === "astronauti" && (
          <div className="space-y-8">
            {/* Crew grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {ASTRONAUTI.map((a, i) => {
                const active = astronautaSelezionato === a.id;
                const critical = a.stress > 50;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAstronautaSelezionato(a.id)}
                    className={`fade-up fade-up-${i + 1} relative rounded-2xl p-5 text-left transition-all border backdrop-blur-sm ${
                      active
                        ? "border-cyan-500/60 bg-cyan-500/[0.06] glow-soft"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                    }`}
                  >
                    {active && <div className="absolute inset-0 rounded-2xl shimmer-bg" />}
                    <div className="relative z-10">
                      <p className="text-white font-light mb-0.5">{a.nome}</p>
                      <p className="text-[11px] text-slate-500 font-light mb-3">{a.ruolo}</p>
                      <div className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-light uppercase tracking-wider border ${
                        critical
                          ? "text-red-300 border-red-500/40 bg-red-500/10"
                          : a.stress > 30
                          ? "text-amber-300 border-amber-500/40 bg-amber-500/10"
                          : "text-cyan-300 border-cyan-500/40 bg-cyan-500/10"
                      }`}>
                        {a.stato}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            {ast && (
              <div className="fade-up border border-white/[0.06] rounded-3xl p-8 bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <h3 className="text-3xl font-extralight text-white mb-1">{ast.nome}</h3>
                    <p className="text-sm text-slate-500 font-light">{ast.ruolo}</p>
                  </div>
                  <div className="flex gap-4">
                    <CircularGauge value={100 - ast.stress} max={100} size={64} color={ast.stress > 50 ? "#ef4444" : "#22d3ee"} label="Benessere" />
                    <CircularGauge value={ast.energia} max={100} size={64} color="#a78bfa" label="Energia" />
                    <CircularGauge value={ast.o2} max={100} size={64} color="#38bdf8" label="SpO2" />
                  </div>
                </div>

                {/* Vitals grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 mb-10">
                  {[
                    { l: "Freq. Cardiaca", v: ast.fc, u: "bpm" },
                    { l: "Pressione", v: ast.pressione, u: "" },
                    { l: "SpO2", v: ast.o2, u: "%" },
                    { l: "Stress", v: ast.stress, u: "%" },
                    { l: "Sonno", v: ast.sonno, u: "h" },
                    { l: "Energia", v: ast.energia, u: "%" },
                  ].map((m, i) => (
                    <div key={i}>
                      <p className="text-[10px] text-slate-500 font-light uppercase tracking-wider mb-2">{m.l}</p>
                      <p className="text-2xl font-extralight text-white">
                        <NumeroAnimato valore={parseFloat(m.v)} decimali={typeof m.v === "string" && m.v.includes("/") ? 0 : 1} />
                        <span className="text-sm text-slate-600 ml-1">{m.u}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Extended info */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { l: "Ritmo Circadiano", v: ast.ritmo },
                    { l: "Massa Muscolare", v: ast.muscoli },
                    { l: "Sistema Immunitario", v: ast.immunita },
                  ].map((info, i) => (
                    <div key={i} className="border border-white/[0.06] rounded-xl p-4 bg-white/[0.02]">
                      <p className="text-[10px] text-slate-500 font-light uppercase tracking-wider mb-2">{info.l}</p>
                      <p className="text-base font-light text-white">{info.v}</p>
                    </div>
                  ))}
                </div>

                {/* Stress bar */}
                <div className="border border-white/[0.06] rounded-xl p-5 bg-white/[0.02]">
                  <div className="flex justify-between mb-3">
                    <span className="text-[10px] text-slate-500 font-light uppercase tracking-wider">Stress</span>
                    <span className={`text-sm font-light ${ast.stress > 50 ? "text-red-300" : ast.stress > 30 ? "text-amber-300" : "text-cyan-300"}`}>{ast.stress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${ast.stress > 50 ? "bg-red-500" : ast.stress > 30 ? "bg-amber-500" : "bg-cyan-500"}`}
                      style={{ width: `${ast.stress}%`, boxShadow: `0 0 12px ${ast.stress > 50 ? "rgba(239,68,68,0.5)" : ast.stress > 30 ? "rgba(245,158,11,0.5)" : "rgba(34,211,238,0.5)"}` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ HABITAT ═══ */}
        {tab === "habitat" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {Object.entries(HABITAT).map(([k, p], i) => {
                const pct = ((p.valore - p.min) / (p.max - p.min)) * 100;
                const ok = p.valore >= p.min && p.valore <= p.max;
                return (
                  <div key={k} className={`fade-up fade-up-${(i % 4) + 1} group relative rounded-2xl p-6 border backdrop-blur-sm transition-all hover:bg-white/[0.04] ${
                    ok ? "border-white/[0.06] bg-white/[0.02]" : "border-red-500/40 bg-red-500/[0.03]"
                  }`}>
                    <p className="text-[10px] text-slate-500 font-light uppercase tracking-wider mb-3 capitalize">{k.replace(/_/g, " ")}</p>
                    <p className="text-3xl font-extralight text-white mb-4">
                      <NumeroAnimato valore={p.valore} decimali={1} />
                      <span className="text-sm text-slate-600 ml-1">{p.unita}</span>
                    </p>
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${ok ? "bg-cyan-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, boxShadow: ok ? "0 0 8px rgba(34,211,238,0.4)" : "0 0 8px rgba(239,68,68,0.4)" }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 font-light mt-2">{p.min} – {p.max}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ RACCOMANDAZIONI ═══ */}
        {tab === "raccomandazioni" && (
          <div className="space-y-4">
            <p className="text-[11px] text-slate-500 font-light uppercase tracking-wider mb-6">Raccomandazioni Operative</p>
            {RACCOMANDAZIONI.map((r, i) => {
              const c = { critico: "border-red-500/40 text-red-300", warning: "border-amber-500/40 text-amber-300", info: "border-sky-500/40 text-sky-300" }[r.tipo];
              return (
                <div key={i} className={`fade-up fade-up-${(i % 4) + 1} rounded-2xl p-6 border-l-2 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all ${c}`}>
                  <p className="text-sm font-light leading-relaxed">{r.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
