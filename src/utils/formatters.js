export function formatCurrency(amount, currency = 'GBP') {
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
  return `${symbol}${Number(amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return dateStr;
}

export function getStatusConfig(status) {
  const configs = {
    'ERP Record Created': { bg: 'var(--status-green-bg)', color: 'var(--status-green-text)', dot: 'var(--status-green)' },
    'Pending ERP Creation': { bg: 'var(--status-orange-bg)', color: 'var(--status-orange-text)', dot: 'var(--status-orange)' },
    'ERP Record Creation Failed': { bg: 'var(--status-red-bg)', color: 'var(--status-red-text)', dot: 'var(--status-red)' },
    'Outstanding': { bg: 'var(--status-blue-bg)', color: 'var(--status-blue-text)', dot: 'var(--status-blue)' },
    'Pending Approval': { bg: 'var(--status-orange-bg)', color: 'var(--status-orange-text)', dot: 'var(--status-orange)' },
    'Rejected': { bg: 'var(--status-red-bg)', color: 'var(--status-red-text)', dot: 'var(--status-red)' },
    'Cancelled': { bg: 'var(--status-grey-bg)', color: 'var(--status-grey-text)', dot: 'var(--status-grey)' },
    'Draft': { bg: 'var(--status-grey-bg)', color: 'var(--status-grey-text)', dot: 'var(--status-grey)' },
  };
  return configs[status] || { bg: 'var(--status-grey-bg)', color: 'var(--status-grey-text)', dot: 'var(--status-grey)' };
}

export function getRAGConfig(rag) {
  const configs = {
    'RED': { bg: 'var(--status-red-bg)', color: 'var(--status-red-text)', label: 'Red' },
    'AMBER': { bg: 'var(--status-orange-bg)', color: 'var(--status-orange-text)', label: 'Amber' },
    'GREEN': { bg: 'var(--status-green-bg)', color: 'var(--status-green-text)', label: 'Green' },
  };
  return configs[rag] || configs['RED'];
}

export function truncateText(text, maxLength = 30) {
  if (!text) return '—';
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}
