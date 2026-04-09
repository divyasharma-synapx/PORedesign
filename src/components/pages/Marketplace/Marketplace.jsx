import { useState, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Save, ChevronDown, Plus, Minus, X } from 'lucide-react';
import { products } from '../../../data/products';
import { formatCurrency } from '../../../utils/formatters';
import { useCart } from '../../../context/CartContext';
import RAGBadge from '../../shared/RAGBadge';
import './Marketplace.css';

const ROWS_PER_PAGE = 5;

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '', supplierCode: '', supplierName: '', division: '', productGroup: '', includeCreated: false,
  });
  const { items, totalItems, totalValue, addItem, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  /* Unique filter values */
  const uniqueVals = useMemo(() => ({
    locations: [...new Set(products.map(p => p.location))],
    suppliers: [...new Set(products.map(p => String(p.supplierCode)))],
    supplierNames: [...new Set(products.map(p => p.supplierName))],
    divisions: [...new Set(products.map(p => p.division))],
    groups: [...new Set(products.map(p => String(p.productGroup)))],
  }), []);

  /* Filtered + searched products */
  const filteredProducts = useMemo(() => {
    let data = products;
    const q = search.toLowerCase();
    if (q) data = data.filter(p =>
      p.productCode.toLowerCase().includes(q) ||
      p.product.toLowerCase().includes(q) ||
      p.mpn.toLowerCase().includes(q)
    );
    if (filters.location) data = data.filter(p => p.location === filters.location);
    if (filters.supplierCode) data = data.filter(p => String(p.supplierCode) === filters.supplierCode);
    if (filters.supplierName) data = data.filter(p => p.supplierName === filters.supplierName);
    if (filters.division) data = data.filter(p => p.division === filters.division);
    if (filters.productGroup) data = data.filter(p => String(p.productGroup) === filters.productGroup);
    return data;
  }, [search, filters]);

  const totalPages = Math.ceil(filteredProducts.length / ROWS_PER_PAGE);
  const paged = filteredProducts.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const toggleRow = (id) => {
    const s = new Set(expandedRows);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedRows(s);
  };
  const getCartItem = (code) => items.find(i => i.productCode === code);
  const clearFilters = () => setFilters({ location: '', supplierCode: '', supplierName: '', division: '', productGroup: '', includeCreated: false });
  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'includeCreated' ? v !== '' : v);

  return (
    <div className="mp-page">
      {/* ── Main area ── */}
      <div className="mp-main">
        {/* Cart banner */}
        <div className="mp-card mp-banner">
          <div className="mp-banner__left">
            <ShoppingCart size={18} />
            <span>{totalItems} Products in cart</span>
          </div>
          <div className="mp-banner__right">
            <span className="mp-banner__label">Total Value:</span>
            <strong className="mp-banner__amount">{formatCurrency(totalValue)}</strong>
          </div>
        </div>

        {/* Card wrapping toolbar + table */}
        <div className="mp-card">
          {/* Toolbar */}
          <div className="mp-toolbar">
            <div className="mp-search">
              <Search size={15} className="mp-search__icon" />
              <input
                placeholder="Product name, Code, Manufacturers part number...."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              <button className="mp-search__btn"><Search size={15} /></button>
            </div>
            <div className="mp-toolbar__actions">
              <button className="mp-btn mp-btn--outline"><Save size={14} /> Save Cart</button>
              <button className="mp-btn mp-btn--solid" onClick={() => navigate('/cart')}>
                <ShoppingCart size={14} /> View Cart
                {totalItems > 0 && <span className="mp-btn__badge">{totalItems}</span>}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mp-table-wrap">
            <table className="mp-table">
              <thead>
                <tr>
                  <th style={{ width: 240 }}>Product</th>
                  <th>MPN</th>
                  <th>Product Group</th>
                  <th>Supplier Code</th>
                  <th>Division</th>
                  <th>Backorder Stock</th>
                  <th>Total Stock</th>
                  <th>Unit Cost</th>
                  <th>RAG</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {paged.map(product => {
                  const isExp = expandedRows.has(product.id);
                  const ci = getCartItem(product.productCode);
                  return (
                    <Fragment key={product.id}>
                      <tr className={`mp-row ${isExp ? 'mp-row--expanded' : ''}`}>
                        <td>
                          <div className="mp-product-cell">
                            <button className={`mp-expand ${isExp ? 'open' : ''}`} onClick={() => toggleRow(product.id)}>
                              <ChevronDown size={16} />
                            </button>
                            <div>
                              <a className="mp-product-name">{product.product}</a>
                              <span className="mp-product-code">{product.productCode}</span>
                            </div>
                          </div>
                        </td>
                        <td>{product.mpn}</td>
                        <td>{product.productGroup}</td>
                        <td>{product.supplierCode}</td>
                        <td>{product.division}</td>
                        <td>{product.backorderStock}</td>
                        <td>
                          <span className="stock-highlight">{product.allocated ?? (product.totalStock - product.freeStock)}</span>
                          {' / '}
                          <span className="stock-total-num">{product.totalStock}</span>
                        </td>
                        <td className="mp-cost">{formatCurrency(product.unitCost)}</td>
                        <td><RAGBadge rag={product.rag} /></td>
                        <td onClick={e => e.stopPropagation()}>
                          {ci ? (
                            <div className="mp-stepper">
                              <button onClick={() => ci.quantity <= 1 ? removeItem(product.productCode) : updateQuantity(product.productCode, ci.quantity - 1)}><Minus size={13} /></button>
                              <input type="text" value={ci.quantity} onChange={e => updateQuantity(product.productCode, parseInt(e.target.value) || 1)} />
                              <button onClick={() => updateQuantity(product.productCode, ci.quantity + 1)}><Plus size={13} /></button>
                            </div>
                          ) : (
                            <button className="mp-cart-btn" onClick={() => addItem(product)}><ShoppingCart size={15} /></button>
                          )}
                        </td>
                      </tr>
                      {isExp && (
                        <tr className="mp-exp-row">
                          <td colSpan={10}>
                            <div className="mp-subsection">
                              <div className="mp-sub-block">
                                <h6>Stock Based on Last</h6>
                                <div className="mp-sub-vals">
                                  <span>4W: <strong>{product.stockHistory?.w4 ?? 0}</strong></span>
                                  <span>8W: <strong>{product.stockHistory?.w8 ?? 0}</strong></span>
                                  <span>12W: <strong>{product.stockHistory?.w12 ?? 0}</strong></span>
                                </div>
                              </div>
                              <div className="mp-sub-block mp-sub-block--border">
                                <h6>Due Delivery</h6>
                                <div className="mp-sub-vals">
                                  <span>Mar: <strong className="val-blue">{product.dueDelivery?.mar ?? 0}</strong></span>
                                  <span>Apr: <strong className="val-blue">{product.dueDelivery?.apr ?? 0}</strong></span>
                                  <span>May: <strong className="val-blue">{product.dueDelivery?.may ?? 0}</strong></span>
                                </div>
                              </div>
                              <div className="mp-sub-block mp-sub-block--border">
                                <h6>Total on Purchase Orders</h6>
                                <div className="mp-sub-vals">
                                  <strong>{product.totalOnPO ?? 0}</strong>
                                  <span className="mp-sub-units">Units pending</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {paged.length === 0 && (
                  <tr><td colSpan={10} className="mp-empty">No products match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mp-footer">
            <span>Showing <strong>{paged.length ? (page - 1) * ROWS_PER_PAGE + 1 : 0}</strong> to <strong>{Math.min(page * ROWS_PER_PAGE, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> results</span>
            <div className="mp-paging">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <button className="mp-paging__active" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter tab (vertical label on right edge) ── */}
      <button className={`filter-tab ${isFilterOpen ? 'filter-tab--hidden' : ''}`} onClick={() => setIsFilterOpen(true)}>
        <span>Filter</span>
      </button>

      {/* ── Collapsible filter pane ── */}
      <div className={`fp ${isFilterOpen ? 'fp--open' : ''}`}>
        <div className="fp__header">
          <span>Product Details</span>
          <button onClick={() => setIsFilterOpen(false)}><X size={16} /></button>
        </div>
        <div className="fp__body">
          {[
            { label: 'Warehouse Location', key: 'location', opts: uniqueVals.locations },
            { label: 'Supplier Code', key: 'supplierCode', opts: uniqueVals.suppliers },
            { label: 'Supplier Name', key: 'supplierName', opts: uniqueVals.supplierNames },
            { label: 'Division', key: 'division', opts: uniqueVals.divisions },
            { label: 'Product Group', key: 'productGroup', opts: uniqueVals.groups },
          ].map(f => (
            <div key={f.key} className="fp__field">
              <label>{f.label}</label>
              <div className="fp__select-wrap">
                <select value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}>
                  <option value="">Search {f.label}</option>
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {filters[f.key] && <button className="fp__clear-btn" onClick={() => setFilters(prev => ({ ...prev, [f.key]: '' }))}><X size={12} /></button>}
              </div>
            </div>
          ))}
          <div className="fp__field fp__field--toggle">
            <label>Include Created Products?</label>
            <label className="toggle">
              <input type="checkbox" checked={filters.includeCreated} onChange={e => setFilters(prev => ({ ...prev, includeCreated: e.target.checked }))} />
              <span className="toggle__slider" />
            </label>
          </div>
        </div>
        <div className="fp__footer">
          <button className="fp__btn fp__btn--clear" onClick={clearFilters}>Clear Filters</button>
          <button className="fp__btn fp__btn--apply" onClick={() => setIsFilterOpen(false)}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}
