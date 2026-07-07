export default function DelayBanner({ reason, queueName }) {
  if (!reason) return null;
  return (
    <div className="delay-banner">
      <span className="delay-banner-icon">⚠️</span>
      <div>
        <p className="delay-banner-title">Retraso en {queueName}</p>
        <p className="delay-banner-msg">{reason}</p>
      </div>
    </div>
  );
}