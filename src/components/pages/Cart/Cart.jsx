import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, Trash2, Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/formatters';
import RAGBadge from '../../shared/RAGBadge';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalItems, totalValue, itemsBySupplier, updateQuantity, removeItem } = useCart();
  const [activeProduct, setActiveProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  const openDetailsModal = (item) => { setActiveProduct(item); setModalQty(item.quantity); };
  const closeDetailsModal = () => setActiveProduct(null);
  const saveDetailsModal = () => { if (activeProduct) updateQuantity(activeProduct.productCode, modalQty); closeDetailsModal(); };

  if (totalItems === 0) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <ShoppingCart size={48} strokeWidth={1.5} />
          <h2>Your cart is empty</h2>
          <p>Add items from the marketplace to check out.</p>
          <button className="ct-btn ct-btn--dark" onClick={() => navigate('/marketplace')}>Go to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page animate-fade-in">
      {/* Banner */}
      <div className="ct-card ct-banner">
        <div className="ct-banner__left"><Package size={18} /> <span>{totalItems} Products in cart</span></div>
      </div>

      {/* Main layout */}
      <div className="ct-layout">
        <div className="ct-main">
          {Object.values(itemsBySupplier).map(group => {
            const subtotal = group.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
            return (
              <div key={group.supplierCode} className="ct-card ct-supplier">
                <div className="ct-supplier__header">
                  <h3>{group.supplierCode} - {group.supplierName}</h3>
                </div>
                <div className="ct-table-wrap">
                  <table className="ct-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Location</th>
                        <th>Division</th>
                        <th>Total Stock</th>
                        <th>Unit Cost</th>
                        <th>RAG</th>
                        <th style={{ textAlign: 'center' }}>Quantity</th>
                        <th>Total</th>
                        <th style={{ width: 70 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map(item => (
                        <tr key={item.productCode}>
                          <td>
                            <div className="ct-product-name">{item.product}</div>
                            <div className="ct-product-code">{item.productCode}</div>
                          </td>
                          <td>{item.location}</td>
                          <td>{item.division}</td>
                          <td><span className="ct-stock-green">{item.freeStock}</span> / {item.totalStock}</td>
                          <td>{formatCurrency(item.unitCost)}</td>
                          <td><RAGBadge rag={item.rag} /></td>
                          <td>
                            <div className="ct-stepper">
                              <button onClick={() => item.quantity <= 1 ? removeItem(item.productCode) : updateQuantity(item.productCode, item.quantity - 1)}><Minus size={13} /></button>
                              <input type="text" value={item.quantity} onChange={e => updateQuantity(item.productCode, parseInt(e.target.value) || 1)} />
                              <button onClick={() => updateQuantity(item.productCode, item.quantity + 1)}><Plus size={13} /></button>
                            </div>
                          </td>
                          <td className="ct-item-total">{formatCurrency(item.unitCost * item.quantity)}</td>
                          <td>
                            <div className="ct-actions">
                              <button className="ct-icon-btn" onClick={() => openDetailsModal(item)}><Eye size={16} /></button>
                              <button className="ct-icon-btn ct-icon-btn--red" onClick={() => removeItem(item.productCode)}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="ct-supplier__subtotal">
                  <span>PO Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary sidebar */}
        <div className="ct-summary">
          <div className="ct-summary__header">Order Summary</div>
          <div className="ct-summary__body">
            {Object.values(itemsBySupplier).map(group => {
              const sub = group.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
              return (
                <div key={group.supplierCode} className="ct-summary__line">
                  <span>{group.supplierCode} - {group.location || 'SALT'}</span>
                  <span>{formatCurrency(sub)}</span>
                </div>
              );
            })}
          </div>
          <div className="ct-summary__footer">
            <div className="ct-summary__total">
              <p>Total</p>
              <h2>{formatCurrency(totalValue)}</h2>
            </div>
            <div className="ct-summary__actions">
              <button className="ct-btn ct-btn--outline" onClick={() => navigate('/marketplace')}>Cancel</button>
              <button className="ct-btn ct-btn--dark" onClick={() => navigate('/checkout')}>Checkout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {activeProduct && (
        <div className="ct-overlay" onClick={closeDetailsModal}>
          <div className="ct-modal" onClick={e => e.stopPropagation()}>
            <div className="ct-modal__header">
              <h3>Product Details</h3>
              <button className="ct-modal__close" onClick={closeDetailsModal}><X size={18} /></button>
            </div>
            <div className="ct-modal__body">
              <div className="ct-modal__grid">
                <div className="ct-modal__field"><label>Product Code</label><input type="text" readOnly value={activeProduct.productCode} /></div>
                <div className="ct-modal__field"><label>MPN</label><input type="text" readOnly value={activeProduct.mpn || '-'} /></div>
                <div className="ct-modal__field"><label>Product Name</label><input type="text" readOnly value={activeProduct.product} /></div>
                <div className="ct-modal__field"><label>Product Group</label><input type="text" readOnly value={activeProduct.productGroup || '—'} /></div>
                <div className="ct-modal__field"><label>Division</label><input type="text" readOnly value={activeProduct.division} /></div>
                <div className="ct-modal__field"><label>Total Stock</label><input type="text" readOnly value={activeProduct.totalStock} /></div>
                <div className="ct-modal__field"><label>Free Stock</label><input type="text" readOnly value={activeProduct.freeStock} /></div>
                <div className="ct-modal__field"><label>Allocated</label><input type="text" readOnly value={activeProduct.allocated} /></div>
                <div className="ct-modal__field"><label>Supplier Code</label><input type="text" readOnly value={activeProduct.supplierCode} /></div>
                <div className="ct-modal__field"><label>Location</label><input type="text" readOnly value={activeProduct.location} /></div>
                <div className="ct-modal__field"><label>Unit Cost</label><input type="text" readOnly value={formatCurrency(activeProduct.unitCost)} /></div>
                <div className="ct-modal__field"><label>RAG</label>
                  <div className="ct-modal__rag" style={{ background: activeProduct.rag === 'RED' ? '#EF4444' : activeProduct.rag === 'AMBER' ? '#F59E0B' : '#10B981' }}>{activeProduct.rag}</div>
                </div>
              </div>
            </div>
            <div className="ct-modal__footer">
              <div className="ct-stepper ct-stepper--green">
                <button onClick={() => setModalQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                <input type="text" value={modalQty} onChange={e => setModalQty(parseInt(e.target.value) || 1)} />
                <button onClick={() => setModalQty(q => q + 1)}><Plus size={14} /></button>
              </div>
              <div className="ct-modal__footer-right">
                <span className="ct-modal__subtotal">Subtotal: {formatCurrency(activeProduct.unitCost * modalQty)}</span>
                <button className="ct-btn ct-btn--outline" onClick={closeDetailsModal}>Cancel</button>
                <button className="ct-btn ct-btn--dark" onClick={saveDetailsModal}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
