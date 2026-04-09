import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, User, CreditCard, Plus, Trash2, FileText, CheckCircle, Minus, X, StickyNote } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/formatters';
import RAGBadge from '../../shared/RAGBadge';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { itemsBySupplier, updateQuantity, removeItem, clearCart } = useCart();
  const [activeBrandTab, setActiveBrandTab] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notesPopup, setNotesPopup] = useState(null); // { type: 'reason'|'internal'|'external', productCode?: string }
  const [noteValues, setNoteValues] = useState({});

  const supplierGroups = Object.values(itemsBySupplier);

  useEffect(() => {
    if (supplierGroups.length > 0 && !activeBrandTab) setActiveBrandTab(supplierGroups[0].supplierCode);
  }, [supplierGroups, activeBrandTab]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); clearCart(); }, 1500);
  };

  const getNoteValue = (key) => noteValues[key] || '';
  const setNoteValue = (key, val) => setNoteValues(prev => ({ ...prev, [key]: val }));

  if (isSuccess) {
    return (
      <div className="ck-page animate-fade-in">
        <div className="ck-success">
          <div className="ck-success__icon"><CheckCircle size={40} /></div>
          <h2>Order Submitted Successfully!</h2>
          <p>Your purchase order has been sent to the ERP system.<br/>You can track its status on the dashboard.</p>
          <button className="ck-btn ck-btn--dark" onClick={() => navigate('/')}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  if (supplierGroups.length === 0) {
    return (
      <div className="ck-page"><div className="ck-success"><h2>No items to checkout</h2><button className="ck-btn ck-btn--dark" onClick={() => navigate('/marketplace')} style={{ marginTop: 16 }}>Go to Marketplace</button></div></div>
    );
  }

  const currentGroup = supplierGroups.find(g => g.supplierCode === activeBrandTab) || supplierGroups[0];
  const groupTotal = currentGroup.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);

  return (
    <div className="ck-page animate-fade-in">
      {/* Supplier tabs */}
      <div className="ck-brand-tabs">
        {supplierGroups.map(group => {
          const total = group.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
          return (
            <div key={group.supplierCode} className={`ck-brand-tab ${activeBrandTab === group.supplierCode ? 'ck-brand-tab--active' : ''}`} onClick={() => setActiveBrandTab(group.supplierCode)}>
              <div className="ck-brand-tab__code">{group.supplierCode}</div>
              <div className="ck-brand-tab__val">{formatCurrency(total).replace('£', '')}</div>
              <div className="ck-brand-tab__loc">{group.location || 'SALT'}</div>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <div className="ck-card ck-form">
        <div className="ck-form__grid">
          <div className="ck-form__field">
            <label><Calendar size={14} /> * Required Delivery Date</label>
            <input type="date" defaultValue="2026-04-09" />
          </div>
          <div className="ck-form__field">
            <label><Building2 size={14} /> Supplier Branch</label>
            <select><option>LFD Division</option></select>
          </div>
          <div className="ck-form__field">
            <label><User size={14} /> * Assigned To</label>
            <select><option>Daniel Burford</option></select>
          </div>
          <div className="ck-form__field">
            <label><CreditCard size={14} /> Payment Terms</label>
            <select><option>STND 60 days from Invoice Date</option></select>
          </div>
        </div>
      </div>

      {/* Line items table */}
      <div className="ck-card">
        <div className="ck-table-wrap">
          <table className="ck-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Business Manager</th>
                <th>Unit Cost</th>
                <th style={{ textAlign: 'center' }}>Quantity</th>
                <th>Total</th>
                <th>RAG</th>
                <th>Reason</th>
                <th style={{ textAlign: 'center' }}>Notes</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {currentGroup.items.map(item => (
                <tr key={item.productCode}>
                  <td><div className="ck-product-code">{item.productCode}</div></td>
                  <td><div className="ck-product-desc">{item.product}</div></td>
                  <td className="ck-bm">Divya Sharma</td>
                  <td>{formatCurrency(item.unitCost)}</td>
                  <td>
                    <div className="ck-stepper">
                      <button onClick={() => item.quantity <= 1 ? removeItem(item.productCode) : updateQuantity(item.productCode, item.quantity - 1)}><Minus size={13} /></button>
                      <input type="text" value={item.quantity} onChange={e => updateQuantity(item.productCode, parseInt(e.target.value) || 1)} />
                      <button onClick={() => updateQuantity(item.productCode, item.quantity + 1)}><Plus size={13} /></button>
                    </div>
                  </td>
                  <td className="ck-total-cell">{formatCurrency(item.unitCost * item.quantity)}</td>
                  <td><RAGBadge rag={item.rag} /></td>
                  <td>
                    <select className="ck-reason-select"><option value="">Select Reason</option></select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="ck-notes-icon" title="Add notes" onClick={() => setNotesPopup({ type: 'reason', productCode: item.productCode })}>
                      <StickyNote size={16} />
                    </button>
                  </td>
                  <td>
                    <button className="ck-delete-btn" onClick={() => removeItem(item.productCode)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ck-add-more" onClick={() => navigate('/marketplace')}><Plus size={16} /> Add more items</div>
      </div>

      {/* PO Notes icons */}
      <div className="ck-notes-bar">
        <button className="ck-notes-bar__btn" onClick={() => setNotesPopup({ type: 'internal' })}>
          <StickyNote size={16} /> Internal PO Notes
        </button>
        <button className="ck-notes-bar__btn" onClick={() => setNotesPopup({ type: 'external' })}>
          <FileText size={16} /> External PO Notes
        </button>
      </div>

      {/* Actions */}
      <div className="ck-actions">
        <button className="ck-btn ck-btn--outline" onClick={() => navigate('/cart')}>Cancel</button>
        <button className="ck-btn ck-btn--dark" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* Notes popup */}
      {notesPopup && (
        <div className="ck-overlay" onClick={() => setNotesPopup(null)}>
          <div className="ck-modal" onClick={e => e.stopPropagation()}>
            <div className="ck-modal__header">
              <h3>{notesPopup.type === 'internal' ? 'Internal PO Notes' : notesPopup.type === 'external' ? 'External PO Notes' : `Reason Notes — ${notesPopup.productCode}`}</h3>
              <button className="ck-modal__close" onClick={() => setNotesPopup(null)}><X size={18} /></button>
            </div>
            <div className="ck-modal__body">
              <textarea
                placeholder={`Add ${notesPopup.type} notes here...`}
                value={getNoteValue(`${notesPopup.type}-${notesPopup.productCode || 'po'}`)}
                onChange={e => setNoteValue(`${notesPopup.type}-${notesPopup.productCode || 'po'}`, e.target.value)}
              />
            </div>
            <div className="ck-modal__footer">
              <button className="ck-btn ck-btn--outline" onClick={() => setNotesPopup(null)}>Cancel</button>
              <button className="ck-btn ck-btn--dark" onClick={() => setNotesPopup(null)}>Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
