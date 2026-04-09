import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, ChevronDown, ChevronUp, X, Clock, Package, TrendingUp
} from 'lucide-react';
import { purchaseOrders } from '../../../data/purchaseOrders';
import { formatCurrency, getStatusConfig, truncateText } from '../../../utils/formatters';
import './Home.css';

const ROWS_PER_PAGE = 5;

/* Donut chart colors */
const DONUT_COLORS = ['#1B1464', '#4A45B1', '#7B76D2', '#10B981', '#9CA3AF'];
const STATUS_LABELS = ['Approved', 'In Transit', 'Received', 'Pending', 'Rejected'];

/* Upcoming deliveries mock data */
const upcomingDeliveries = [
  { product: 'Dell Monitors', supplier: 'Dell Tech', value: 2400, date: '30 Jan 2026' },
  { product: 'Ceiling Speakers', supplier: 'CS Tech', value: 3200, date: '28 Jan 2026' },
];

export default function Home() {
  const navigate = useNavigate();
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredAssignee, setHoveredAssignee] = useState(null);
  const [filters, setFilters] = useState({ status: '', supplier: '', location: '', assignedTo: '' });

  const uniqueVals = useMemo(() => ({
    statuses: [...new Set(purchaseOrders.map(p => p.status))],
    suppliers: [...new Set(purchaseOrders.map(p => p.supplierName))],
    locations: [...new Set(purchaseOrders.map(p => p.location))],
    assignees: [...new Set(purchaseOrders.map(p => p.assignedTo))],
  }), []);

  const filtered = useMemo(() => {
    let data = purchaseOrders;
    const q = search.toLowerCase();
    if (q) data = data.filter(po =>
      String(po.id).includes(q) || po.supplierName.toLowerCase().includes(q) ||
      po.assignedTo.toLowerCase().includes(q) || (po.poReference && po.poReference.toLowerCase().includes(q))
    );
    if (filters.status) data = data.filter(po => po.status === filters.status);
    if (filters.supplier) data = data.filter(po => po.supplierName === filters.supplier);
    if (filters.location) data = data.filter(po => po.location === filters.location);
    if (filters.assignedTo) data = data.filter(po => po.assignedTo === filters.assignedTo);
    return data;
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const clearFilters = () => setFilters({ status: '', supplier: '', location: '', assignedTo: '' });
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  /* Dashboard computed values */
  const pendingCount = purchaseOrders.filter(p => p.status === 'Pending ERP Creation').length;
  const totalSpend = purchaseOrders.reduce((s, p) => s + p.totalPurchaseValue, 0);

  /* Simple donut SVG helper */
  const donutSegments = useMemo(() => {
    const counts = {};
    purchaseOrders.forEach(po => {
      const idx = po.status.includes('Created') ? 0 : po.status.includes('Transit') || po.status.includes('Pending') ? 1 : po.status.includes('Cancelled') ? 4 : po.status.includes('Failed') ? 3 : 2;
      counts[idx] = (counts[idx] || 0) + 1;
    });
    const total = purchaseOrders.length;
    let cumulative = 0;
    return [0, 1, 2, 3, 4].map(i => {
      const count = counts[i] || 0;
      const pct = count / total;
      const start = cumulative;
      cumulative += pct;
      return { start, pct, color: DONUT_COLORS[i], label: STATUS_LABELS[i], count };
    });
  }, []);

  const renderDonut = () => {
    const r = 36;
    const cx = 50;
    const cy = 50;
    const circumference = 2 * Math.PI * r;
    return (
      <svg viewBox="0 0 100 100" className="hm-donut">
        {donutSegments.map((seg, i) => {
          if (seg.pct <= 0) return null;
          const offset = circumference * (1 - seg.pct);
          const rotation = seg.start * 360 - 90;
          return (
            <circle
              key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={seg.color} strokeWidth="12"
              strokeDasharray={`${circumference * seg.pct} ${circumference}`}
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
          );
        })}
        <circle cx={cx} cy={cy} r="28" fill="#fff" />
      </svg>
    );
  };

  return (
    <div className="hm-page">
      <div className="hm-main">
        {/* ── Dashboard ── */}
        <div className="hm-card hm-dashboard">
          <button className="hm-dashboard__toggle" onClick={() => setDashboardOpen(o => !o)}>
            <span>Dashboard</span>
            {dashboardOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {dashboardOpen && (
            <div className="hm-dash-body">
              {/* Left: donut chart */}
              <div className="hm-dash-donut-card">
                <h4 className="hm-dash-label">ORDER STATUS DISTRIBUTION</h4>
                <div className="hm-dash-donut-wrap">
                  {renderDonut()}
                  <div className="hm-dash-legend">
                    {donutSegments.filter(s => s.count > 0).map((s, i) => (
                      <div key={i} className="hm-dash-legend-item">
                        <span className="hm-dash-legend-dot" style={{ background: s.color }} />
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center: stat cards stacked */}
              <div className="hm-dash-stats">
                <div className="hm-stat-card">
                  <div className="hm-stat-icon hm-stat-icon--amber"><Clock size={22} /></div>
                  <div className="hm-stat-info">
                    <span className="hm-stat-title">Pending Approval</span>
                    <span className="hm-stat-badge">Active</span>
                  </div>
                  <div className="hm-stat-value">{pendingCount > 0 ? pendingCount : 42}</div>
                </div>
                <div className="hm-stat-card">
                  <div className="hm-stat-icon hm-stat-icon--violet"><Package size={22} /></div>
                  <div className="hm-stat-info">
                    <span className="hm-stat-title">Total Spend</span>
                    <span className="hm-stat-trend"><TrendingUp size={12} /> 5.2%</span>
                  </div>
                  <div className="hm-stat-value">${(totalSpend / 1000).toFixed(1)}k</div>
                </div>
              </div>

              {/* Right: upcoming deliveries */}
              <div className="hm-dash-deliveries">
                <h4 className="hm-dash-label">UPCOMING DELIVERIES</h4>
                {upcomingDeliveries.map((d, i) => (
                  <div key={i} className="hm-delivery-row">
                    <div className="hm-delivery-icon"><Package size={16} /></div>
                    <div className="hm-delivery-info">
                      <span className="hm-delivery-name">{d.product}</span>
                      <span className="hm-delivery-supplier">{d.supplier}</span>
                    </div>
                    <span className="hm-delivery-val">£{d.value.toLocaleString()}</span>
                    <span className="hm-delivery-date">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── PO Table ── */}
        <div className="hm-card">
          <div className="hm-table-header">
            <div className="hm-search">
              <input placeholder="Search PO ID, Supplier, Assignee..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            {hasActiveFilters && <button className="hm-clear-filter" onClick={clearFilters}><X size={13} /> Clear filters</button>}
          </div>

          <div className="hm-table-wrap">
            <table className="hm-table">
              <thead>
                <tr>
                  <th>PO ID</th>
                  <th>PO Reference</th>
                  <th>Supplier</th>
                  <th>Location</th>
                  <th>PO Value</th>
                  <th>Date Created</th>
                  <th>Required Date</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th style={{ width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {paged.map(po => {
                  const sc = getStatusConfig(po.status);
                  return (
                    <tr key={po.id} className="hm-row">
                      <td className="hm-po-id">{po.id}</td>
                      <td>{po.poReference || '—'}</td>
                      <td title={po.supplierName}>{truncateText(po.supplierName, 22)}</td>
                      <td>{po.location}</td>
                      <td className="hm-value-cell" onMouseEnter={() => setHoveredValue(po.id)} onMouseLeave={() => setHoveredValue(null)}>
                        <span>{formatCurrency(po.poValue)}</span>
                        {hoveredValue === po.id && (
                          <div className="hm-tooltip">
                            <div className="hm-tooltip__row"><span>Original ({po.currency})</span><strong>{formatCurrency(po.poValue, po.currency)}</strong></div>
                            <div className="hm-tooltip__row"><span>GBP</span><strong>{formatCurrency(po.totalPurchaseValue)}</strong></div>
                          </div>
                        )}
                      </td>
                      <td>{po.dateCreated}</td>
                      <td>{po.requiredDate}</td>
                      <td>
                        <span className="hm-status-text" style={{ color: sc.dot }}>
                          <span className="hm-status-dot" style={{ background: sc.dot }} />
                          {po.status}
                        </span>
                      </td>
                      <td className="hm-assignee-cell" onMouseEnter={() => setHoveredAssignee(po.id)} onMouseLeave={() => setHoveredAssignee(null)}>
                        <span>{po.assignedTo.split(' ')[0]}</span>
                        {hoveredAssignee === po.id && (
                          <div className="hm-tooltip hm-tooltip--assignee">
                            <div className="hm-tooltip__avatar">{po.assignedTo.split(' ').map(n => n[0]).join('')}</div>
                            <div className="hm-tooltip__name">{po.assignedTo}</div>
                            <div className="hm-tooltip__role">Business Manager</div>
                          </div>
                        )}
                      </td>
                      <td>
                        <button className="hm-view-btn" onClick={() => navigate(`/po/${po.id}`)}><Eye size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
                {paged.length === 0 && <tr><td colSpan={10} className="hm-empty">No purchase orders found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="hm-footer">
            <span>Showing <strong>{paged.length ? (page - 1) * ROWS_PER_PAGE + 1 : 0}</strong> to <strong>{Math.min(page * ROWS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong></span>
            <div className="hm-paging">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <button className="hm-paging__active" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tab */}
      <button className={`filter-tab ${isFilterOpen ? 'filter-tab--hidden' : ''}`} onClick={() => setIsFilterOpen(true)}><span>Filter</span></button>

      {/* Filter pane */}
      <div className={`fp ${isFilterOpen ? 'fp--open' : ''}`}>
        <div className="fp__header"><span>Purchase Order Filters</span><button onClick={() => setIsFilterOpen(false)}><X size={16} /></button></div>
        <div className="fp__body">
          {[
            { label: 'Status', key: 'status', opts: uniqueVals.statuses },
            { label: 'Supplier Name', key: 'supplier', opts: uniqueVals.suppliers },
            { label: 'Warehouse Location', key: 'location', opts: uniqueVals.locations },
            { label: 'Assigned To', key: 'assignedTo', opts: uniqueVals.assignees },
          ].map(f => (
            <div key={f.key} className="fp__field">
              <label>{f.label}</label>
              <div className="fp__select-wrap">
                <select value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}>
                  <option value="">All {f.label}</option>
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {filters[f.key] && <button className="fp__clear-btn" onClick={() => setFilters(prev => ({ ...prev, [f.key]: '' }))}><X size={12} /></button>}
              </div>
            </div>
          ))}
        </div>
        <div className="fp__footer">
          <button className="fp__btn fp__btn--clear" onClick={clearFilters}>Clear Filters</button>
          <button className="fp__btn fp__btn--apply" onClick={() => setIsFilterOpen(false)}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}
