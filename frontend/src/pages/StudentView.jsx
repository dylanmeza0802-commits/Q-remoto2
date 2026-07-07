import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueueStore } from "../store/queueStore";
import { useQueue } from "../hooks/useQueue";
import TurnCard        from "../components/TurnCard.jsx";
import WaitTimer       from "../components/WaitTimer.jsx";
import DelayBanner     from "../components/DelayBanner.jsx";
import QueueDisplay    from "../components/QueueDisplay.jsx";
import QueueSimulation from "../components/QueueSimulation.jsx";
import http from "../api/http";

export default function StudentView() {
  const { queueId } = useParams();
  const navigate    = useNavigate();
  const { subscribe } = useQueue(queueId);
  const { activeQueue, myTurn, isDelayed, delayReason, clearMyTurn } = useQueueStore();

  useEffect(() => { subscribe(); }, [queueId]);

  const waitingTurns = activeQueue?.turns?.filter((t) => t.status === "WAITING") ?? [];
  const myPosition   = myTurn
    ? waitingTurns.findIndex((t) => t.id === myTurn.id) + 1
    : null;

  const handleCancel = async () => {
    if (!myTurn) return;
    try {
      await http.patch(`/turns/${myTurn.id}/cancel`);
      clearMyTurn();
      navigate("/join");
    } catch {
      alert("No se pudo cancelar el turno");
    }
  };

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="topbar-title">🎫 Q-Remoto</p>
          <p className="topbar-sub">
            {activeQueue ? activeQueue.name : "Conectando..."} · Comedor UNSAAC
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--green)", fontWeight:600 }}>
          <span className="live-dot" /> En vivo
        </div>
      </div>

      <DelayBanner reason={isDelayed ? delayReason : ""} queueName={activeQueue?.name} />

      {myTurn && <TurnCard turn={myTurn} position={myPosition} />}
      {myTurn && <WaitTimer minutes={myTurn.waitMinutes} />}

      <div className="stats-grid">
        <div className="stat-box">
          <p className="stat-val">{waitingTurns.length}</p>
          <p className="stat-lbl">En espera</p>
        </div>
        <div className="stat-box">
          <p className="stat-val">3</p>
          <p className="stat-lbl">Min/persona</p>
        </div>
        <div className="stat-box">
          <p className="stat-val">{activeQueue?.laneNumber ?? "—"}</p>
          <p className="stat-lbl">Tu fila</p>
        </div>
      </div>

      <QueueSimulation turns={waitingTurns} myTurnId={myTurn?.id} />
      <QueueDisplay    turns={waitingTurns} />

      {myTurn && (
        <button className="btn btn-danger" style={{ marginTop:4 }} onClick={handleCancel}>
          ✕ Cancelar mi turno
        </button>
      )}
      <button className="btn btn-ghost" style={{ marginTop:8 }} onClick={() => navigate("/join")}>
        ← Volver a filas
      </button>
    </div>
  );
}