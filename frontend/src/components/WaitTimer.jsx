import { useEffect, useState } from "react";

export default function WaitTimer({ minutes }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const iv = setInterval(() => setElapsed((e) => e + 1), 60000);
    return () => clearInterval(iv);
  }, [minutes]);

  const remaining = Math.max(0, minutes - elapsed);
  const pct = minutes > 0 ? Math.min(100, (elapsed / minutes) * 100) : 0;

  return (
    <div className="card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
        <span className="card-title" style={{ margin:0 }}>Tiempo estimado</span>
        <span style={{ fontSize:11, color:"var(--gray-400)" }}>{Math.round(pct)}% transcurrido</span>
      </div>
      <p className="timer-big">
        {remaining}
        <span className="timer-unit">min restantes</span>
      </p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width:`${pct}%` }} />
      </div>
      {pct >= 100 && (
        <p style={{ fontSize:12, color:"var(--green)", fontWeight:600, marginTop:8 }}>
          ¡Tu turno está muy próximo!
        </p>
      )}
    </div>
  );
}