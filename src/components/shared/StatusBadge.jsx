import { getStatusConfig } from '../../utils/formatters';

export default function StatusBadge({ status }) {
  const config = getStatusConfig(status);
  return (
    <span className="status-badge" style={{ background: config.bg, color: config.color }}>
      <span className="status-badge__dot" style={{ background: config.dot }}></span>
      {status}
    </span>
  );
}
