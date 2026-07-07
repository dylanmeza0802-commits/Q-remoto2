import { useMemo } from "react";

export default function QueueSimulation({ turns = [], myTurnId, maxVisible = 16 }) {
  const visible = useMemo(() => turns.slice(0, maxVisible), [turns, maxVisible]);
  const extra   = turns.length - maxVisible;

  return (
    <div className="card">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <span className="card-title" style={{ margin:0 }}>Simulación de fila</span>
        <span style={{ fontSize:11, color:"var(--amber)", fontWeight:600 }}>● tú</span>
      </div>
      <div className="sim-wrap">
        {visible.map((turn, i) => {
          const isFirst = i === 0;
          const isMine  = turn.id === myTurnId;
          const cls = isFirst ? "person-next" : isMine ? "person-mine" : "person-other";
          return (
            <div className="person" key={turn.id}>
              <div className={`person-avatar ${cls}`}>
                <div className="person-head" />
                <div className="person-body" />
              </div>
              <span className="person-label">#{turn.ticketNumber}</span>
            </div>
          );
        })}
        {extra > 0 && <div className="sim-counter">+{extra}</div>}
        {turns.length === 0 && (
          <p style={{ fontSize:12, color:"var(--gray-400)" }}>Sin personas en cola</p>
        )}
      </div>
      <div className="sim-mostrador" />
      <p style={{ fontSize:10, color:"var(--gray-400)", textAlign:"center", marginTop:4 }}>
        ← Mostrador de atención
      </p>
    </div>
  );
}