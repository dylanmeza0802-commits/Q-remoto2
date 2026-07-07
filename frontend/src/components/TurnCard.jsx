export default function TurnCard({ turn, position }) {
  return (
    <div className="ticket">
      <p className="ticket-label">Tu número de turno</p>
      <p className="ticket-number">#{turn.ticketNumber}</p>
      {position && (
        <p className="ticket-pos">
          Posición <strong>#{position}</strong> en la fila
        </p>
      )}
      <p className="ticket-queue">Turno activo · Comedor UNSAAC</p>
    </div>
  );
}