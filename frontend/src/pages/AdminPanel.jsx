import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import socket from "../api/socket";

export default function AdminPanel() {
  const [queues, setQueues] = useState([]);
  const [feed,   setFeed]   = useState([]);
  const [served, setServed] = useState(0);
  const navigate = useNavigate();

  const addFeed = (color, text) =>
    setFeed((f) => [{ color, text, time:"ahora" }, ...f].slice(0, 8));

  useEffect(() => {
    http.get("/queues")
      .then((r) => setQueues(r.data))
      .catch(() => setQueues([]));

    socket.connect();
    socket.on("queue:update", (updated) =>
      setQueues((qs) => qs.map((q) => (q.id === updated.id ? updated : q)))
    );
    return () => { socket.off("queue:update"); socket.disconnect(); };
  }, []);

  const callNext = async (queueId, name) => {
    try {
      const { data } = await http.post(`/queues/${queueId}/call-next`);
      setServed((s) => s + 1);
      addFeed("var(--green)", `Turno #${data.ticketNumber} llamado · ${name}`);
    } catch {
      addFeed("var(--red)", `Sin turnos en ${name}`);
    }
  };

  const announceDelay = async (queueId, name) => {
    const reason = prompt("Motivo del retraso:");
    if (!reason) return;
    try {
      await http.patch(`/queues/${queueId}/delay`, { reason });
      setQueues((qs) => qs.map((q) => q.id === queueId ? { ...q, isDelayed:true, delayReason:reason } : q));
      addFeed("var(--amber)", `Retraso en ${name}: ${reason}`);
    } catch { alert("Error al anunciar retraso"); }
  };

  const resolveDelay = async (queueId, name) => {
    try {
      await http.patch(`/queues/${queueId}/delay/clear`);
      setQueues((qs) => qs.map((q) => q.id === queueId ? { ...q, isDelayed:false, delayReason:null } : q));
      addFeed("var(--green)", `Retraso resuelto · ${name}`);
    } catch { alert("Error al resolver retraso"); }
  };

  const totalWaiting = queues.reduce((acc, q) =>
    acc + (q.turns?.filter((t) => t.status === "WAITING").length ?? 0), 0);

  return (
    <div className="page-wide">
      <div className="nav-tabs">
        <button className="nav-tab active">📊 Panel Admin</button>
        <button className="nav-tab" onClick={() => navigate("/canasta")}>🎁 Canasta</button>
        <button className="nav-tab" onClick={() => navigate("/join")}>🎫 Vista alumno</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-box"><p className="metric-val">{totalWaiting}</p><p className="metric-lbl">Total en espera</p></div>
        <div className="metric-box"><p className="metric-val">{served}</p><p className="metric-lbl">Atendidos hoy</p></div>
        <div className="metric-box"><p className="metric-val">~3</p><p className="metric-lbl">Min promedio</p></div>
        <div className="metric-box"><p className="metric-val">{queues.filter((q) => q.isActive).length}</p><p className="metric-lbl">Filas activas</p></div>
      </div>

      <div className="admin-grid">
        {queues.map((q) => {
          const waiting = q.turns?.filter((t) => t.status === "WAITING") ?? [];
          return (
            <div className="lane-card" key={q.id}>
              <div className="lane-header">
                <p className="lane-title">🚪 {q.name}</p>
                <span className={`badge ${q.isDelayed ? "badge-amber" : "badge-green"}`}>
                  {q.isDelayed ? "Retraso" : "Activa"}
                </span>
              </div>
              {waiting.slice(0, 4).map((t, i) => (
                <div className={`q-row ${i === 0 ? "q-row-first" : ""}`} key={t.id}>
                  <span className="q-num">#{t.ticketNumber}</span>
                  <span className="q-time">{i === 0 ? "Próximo" : `~${i * 3} min`}</span>
                </div>
              ))}
              {waiting.length === 0 && (
                <p style={{ fontSize:12, color:"var(--gray-400)", padding:"6px 0" }}>Sin turnos</p>
              )}
              <div className="lane-actions">
                {q.isDelayed
                  ? <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={() => resolveDelay(q.id, q.name)}>✓ Resolver retraso</button>
                  : <button className="btn btn-warning btn-sm" style={{flex:1}} onClick={() => announceDelay(q.id, q.name)}>⏸ Retraso</button>
                }
              </div>
              <button className="btn btn-primary btn-sm" style={{marginTop:8}} onClick={() => callNext(q.id, q.name)}>
                📢 Llamar siguiente
              </button>
            </div>
          );
        })}
      </div>

      <div className="card">
        <p className="card-title">Actividad reciente</p>
        <div className="feed-list">
          {feed.length === 0 && (
            <p style={{ fontSize:12, color:"var(--gray-400)" }}>Sin actividad aún</p>
          )}
          {feed.map((f, i) => (
            <div className="feed-item" key={i}>
              <div className="feed-dot" style={{ background:f.color }} />
              <div>
                <p className="feed-text">{f.text}</p>
                <p className="feed-time">{f.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}