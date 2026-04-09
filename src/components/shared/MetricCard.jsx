export default function MetricCard({ icon, value, label, variant = 'primary' }) {
  return (
    <div className={`metric-card metric-card--${variant}`}>
      <div className="metric-card__icon">{icon}</div>
      <div className="metric-card__content">
        <span className="metric-card__value">{value}</span>
        <span className="metric-card__label">{label}</span>
      </div>
    </div>
  );
}
