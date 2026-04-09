import { getRAGConfig } from '../../utils/formatters';

export default function RAGBadge({ rag }) {
  const config = getRAGConfig(rag);
  return (
    <span className="rag-badge" style={{ background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
}
