import { useEffect, useState, useRef } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 54; // radio 54

export default function WaitTimer({ minutes, position = 1 }) {
  const totalSecs  = minutes * 60;
  const [secs, setSecs] = useState(totalSecs);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecs(totalSecs);
    clearInterval(intervalRef.current);
    if (totalSecs <= 0) return;
    intervalRef.current = setInterval(() => {
      setSecs((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [totalSecs]);

  const pct    = totalSecs > 0 ? secs / totalSecs : 0;
  const offset = CIRCUMFERENCE * (1 - pct);
  const mm     = Math.floor(secs / 60);
  const ss     = secs % 60;

  // Color del anillo según urgencia
  const ringColor = secs === 0
    ? "#E24B4A"
    : mm <= 2 ? "#BA7517"
    : "var(--blue-mid, #378ADD)";

  // Estado de salida
  const getSalidaInfo = () => {
    if (secs <= 0)   return { cls: "wt-urgent", icon: "🚨", title: "¡Dirígete al mostrador!", sub: "Es tu turno ahora" };
    if (secs <= 120) return { cls: "wt-urgent", icon: "🏃", title: "Sal AHORA", sub: "Menos de 2 min para tu turno" };
    if (secs <= 300) return { cls: "wt-soon",   icon: "🚶", title: "Prepárate para salir", sub: `En ~${Math.ceil((secs - 120) / 60)} min` };
    return { cls: "wt-normal", icon: "🧭", title: "Sal en", sub: `${Math.max(1, mm - 2)} min` };
  };
  const salida = getSalidaInfo();

  return (
    <div className="card">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <span className="card-title" style={{ margin:0 }}>⏱ Tiempo para tu turno</span>
        <span style={{ fontSize:11, background:"var(--blue-light, #E6F1FB)", color:"var(--blue, #185FA5)", padding:"2px 8px", borderRadius:20, border:"1px solid var(--blue-border, #85B7EB)", fontWeight:500 }}>
          Pos. #{position}
        </span>
      </div>

      {/* Anillo SVG */}
      <div style={{ position:"relative", width:140, height:140, margin:"0 auto 14px" }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform:"rotate(-90deg)" }}>
          <circle cx="70" cy="70" r="54" fill="none" stroke="#E4E2DB" strokeWidth="8" />
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition:"stroke-dashoffset 0.9s ease, stroke 0.5s ease" }}
          />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          {secs > 0 ? (
            <span style={{ fontSize:30, fontWeight:700, color: mm <= 2 ? "#BA7517" : "var(--blue, #185FA5)", fontVariantNumeric:"tabular-nums", lineHeight:1, animation: secs <= 60 ? "blink 1s infinite" : "none" }}>
              {String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}
            </span>
          ) : (
            <span style={{ fontSize:20, fontWeight:700, color:"#E24B4A" }}>¡Ya!</span>
          )}
          <span style={{ fontSize:11, color:"var(--gray-400, #888780)", marginTop:3 }}>
            {secs > 0 ? "restantes" : "Es tu turno"}
          </span>
        </div>
      </div>

      {/* Recomendación de salida */}
      <div style={{
        borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:10,
        background: salida.cls === "wt-urgent" ? "linear-gradient(135deg,#791F1F,#E24B4A)"
                  : salida.cls === "wt-soon"   ? "var(--green-light, #EAF3DE)"
                  : "var(--blue-light, #E6F1FB)",
        border: salida.cls === "wt-urgent" ? "none"
              : salida.cls === "wt-soon"   ? "1.5px solid var(--green-border, #97C459)"
              : "1.5px solid var(--blue-border, #85B7EB)",
      }}>
        <span style={{ fontSize:20 }}>{salida.icon}</span>
        <div>
          <p style={{ fontSize:12, fontWeight:600, color: salida.cls === "wt-urgent" ? "#fff" : salida.cls === "wt-soon" ? "var(--green, #3B6D11)" : "var(--blue, #185FA5)" }}>
            {salida.title}
          </p>
          <p style={{ fontSize:11, marginTop:2, color: salida.cls === "wt-urgent" ? "rgba(255,255,255,.8)" : salida.cls === "wt-soon" ? "var(--green, #3B6D11)" : "var(--blue-mid, #378ADD)" }}>
            {salida.sub}
          </p>
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  );
}