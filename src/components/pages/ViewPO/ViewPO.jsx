import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, FileText, Plus, Paperclip, X, StickyNote } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import RAGBadge from '../../shared/RAGBadge';
import './ViewPO.css';

export default function ViewPO() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('PO DETAILS');
  const [notesPopup, setNotesPopup] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [externalNotes, setExternalNotes] = useState('');

  const tabs = ['PO DETAILS', 'COMMENTS', 'QUERIES', 'SHIPPING DETAILS', 'ATTACHMENTS'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'PO DETAILS':
        return (
          <div className="vpo-details animate-fade-in">
            <div className="vpo-info-card">
              <div className="vpo-info-grid">
                <div className="vpo-status-block">
                  <span className="vpo-status-label">Status</span>
                  <span className="vpo-status-pill vpo-status--green">ERP Record Created</span>
                </div>
                <div className="vpo-info-col">
                  <div className="vpo-field"><span className="vpo-field__label">PO Ref No.</span><span className="vpo-field__value">TEST_P0473096</span></div>
                  <div className="vpo-field"><span className="vpo-field__label">Supplier</span><span className="vpo-field__value">IIYAMA BENELUX BV</span></div>
                  <div className="vpo-field"><span className="vpo-field__label">Supplier Code</span><span className="vpo-field__value">IIY01</span></div>
                </div>
                <div className="vpo-info-col">
                  <div className="vpo-field"><span className="vpo-field__label">Location</span><span className="vpo-field__value">SALT</span></div>
                  <div className="vpo-field"><span className="vpo-field__label">Payment Terms</span><span className="vpo-field__value vpo-field__value--sm">STND 60 days from invoice Date</span></div>
                </div>
                <div className="vpo-info-col">
                  <div className="vpo-field"><span className="vpo-field__label">Created Date</span><span className="vpo-field__value">06/04/2026</span></div>
                  <div className="vpo-field"><span className="vpo-field__label">Created By</span><span className="vpo-field__value">svc_pp_uk_orders</span></div>
                  <div className="vpo-field"><span className="vpo-field__label">Assigned To</span><span className="vpo-field__value">Kevin Saju</span></div>
                  <div className="vpo-field"><span className="vpo-field__label">Currency</span><span className="vpo-field__value">GBP</span></div>
                </div>
                <div className="vpo-info-col">
                  <div className="vpo-field">
                    <span className="vpo-field__label">Req. Delivery Date</span>
                    <span className="vpo-field__value vpo-field__value--date"><Calendar size={13} /> 06/04/2026</span>
                  </div>
                  <div className="vpo-notes-icons">
                    <button className="vpo-notes-btn" onClick={() => setNotesPopup('internal')}><StickyNote size={16} /><span>Internal Notes</span></button>
                    <button className="vpo-notes-btn" onClick={() => setNotesPopup('external')}><FileText size={16} /><span>External Notes</span></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="vpo-line-card">
              <div className="vpo-line-header">
                <span className="vpo-line-title">Line Items</span>
                <input type="text" className="vpo-line-search" placeholder="Search by Product Name" />
              </div>
              <div className="vpo-line-table-wrap">
                <table className="vpo-line-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit Cost</th>
                      <th style={{ textAlign: 'center' }}>Qty</th>
                      <th>Total</th>
                      <th>RAG</th>
                      <th>Status</th>
                      <th>Reason</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="vpo-product-name">IIYOPC51204BC1</div>
                        <div className="vpo-product-desc">Intel i5 OPS slot PC</div>
                      </td>
                      <td>£450.00</td>
                      <td style={{ textAlign: 'center', color: 'var(--brand-primary)', fontWeight: 700 }}>1</td>
                      <td style={{ fontWeight: 700 }}>£450.00</td>
                      <td><RAGBadge rag="RED" /></td>
                      <td><span className="vpo-line-status">—</span></td>
                      <td><span className="vpo-line-reason">Replacement for Damaged Stock</span></td>
                      <td><span className="vpo-line-notes">test</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="vpo-total-bar">
                <span>Total</span>
                <strong>£450.00</strong>
              </div>
            </div>
          </div>
        );

      case 'COMMENTS':
        return (
          <div className="vpo-section-card animate-fade-in">
            <h3 className="vpo-section-title">Add a Comment</h3>
            <div className="vpo-comment-area">
              <textarea placeholder="Type your response here..." />
              <button className="vpo-btn vpo-btn--muted">Add</button>
            </div>
          </div>
        );

      case 'QUERIES':
        return (
          <div className="vpo-queries animate-fade-in">
            <div className="vpo-queries-list">
              <div className="vpo-queries-header">
                <h3>Queries For PO: TEST_P0473096</h3>
                <button className="vpo-btn vpo-btn--dark vpo-btn--icon"><Plus size={16} /></button>
              </div>
              <div className="vpo-queries-search">
                <select><option>Sort: Newest</option></select>
                <input type="text" placeholder="Search by Query Title" />
              </div>
              <div className="vpo-query-item vpo-query-item--active">
                <div className="vpo-query-row"><span className="vpo-query-title">Test</span><span className="vpo-query-badge">Open</span></div>
                <div className="vpo-query-date"><Calendar size={12} /> Thu 09/04/2026</div>
              </div>
            </div>
            <div className="vpo-query-detail">
              <div className="vpo-query-detail-header">
                <div><h2 className="vpo-query-detail-title">Test</h2><div className="vpo-query-id">Query ID: <span>70</span></div></div>
                <div className="vpo-query-meta">
                  <div><span className="vpo-query-meta-label">Raised by:</span><br/>svc_pp_uk_orders_dev</div>
                  <span className="vpo-query-badge">Open</span>
                  <span className="vpo-query-date"><Calendar size={12} /> Thu 09/04/2026</span>
                </div>
              </div>
              <div className="vpo-query-body"><h4>Query Details</h4><p>Testing</p></div>
              <div className="vpo-query-attachment"><Paperclip size={16} /> Attachment <button className="vpo-btn vpo-btn--dark vpo-btn--icon"><Plus size={14} /></button></div>
              <div className="vpo-query-comment">
                <h4>Add a Comment</h4>
                <textarea placeholder="Type your response here..." />
                <div style={{ textAlign: 'right' }}><button className="vpo-btn vpo-btn--muted">Add</button></div>
              </div>
              <div className="vpo-query-footer"><button className="vpo-btn vpo-btn--red">Close Query</button></div>
            </div>
          </div>
        );

      case 'SHIPPING DETAILS':
        return (
          <div className="vpo-section-card animate-fade-in">
            <div className="vpo-section-toolbar"><span>Product-Wise Shipping Details</span><select className="vpo-select-sm"><option>All Status</option></select></div>
            <div className="vpo-empty-msg">No shipping details available yet.</div>
          </div>
        );

      case 'ATTACHMENTS':
        return (
          <div className="vpo-section-card animate-fade-in">
            <h3 className="vpo-section-title">Add Attachments</h3>
            <div className="vpo-attach-area">
              <div><p className="vpo-attach-text">There is nothing attached.</p><div className="vpo-attach-link"><Paperclip size={14} /> Attach file</div></div>
              <button className="vpo-btn vpo-btn--dark">Add</button>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="vpo-page animate-fade-in">
      <div className="vpo-tabs">
        {tabs.map(tab => (
          <button key={tab} className={`vpo-tab ${activeTab === tab ? 'vpo-tab--active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>
      <div className="vpo-content">{renderTabContent()}</div>

      {notesPopup && (
        <div className="vpo-modal-overlay" onClick={() => setNotesPopup(null)}>
          <div className="vpo-modal" onClick={e => e.stopPropagation()}>
            <div className="vpo-modal-header">
              <h3>{notesPopup === 'internal' ? 'Internal PO Notes' : 'External PO Notes'}</h3>
              <button className="vpo-modal-close" onClick={() => setNotesPopup(null)}><X size={18} /></button>
            </div>
            <div className="vpo-modal-body">
              <textarea
                placeholder={`Add ${notesPopup} notes here...`}
                value={notesPopup === 'internal' ? internalNotes : externalNotes}
                onChange={e => notesPopup === 'internal' ? setInternalNotes(e.target.value) : setExternalNotes(e.target.value)}
              />
            </div>
            <div className="vpo-modal-footer">
              <button className="vpo-btn vpo-btn--outline" onClick={() => setNotesPopup(null)}>Cancel</button>
              <button className="vpo-btn vpo-btn--dark" onClick={() => setNotesPopup(null)}>Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
