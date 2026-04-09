import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './TopHeader.css';

export default function TopHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/': return { title: 'Purchase Orders', subtitle: 'Manage and track your purchase orders', back: null };
      case '/marketplace': return { title: 'Market Place', subtitle: 'Browse and add products to your cart', back: null };
      case '/cart': return { title: 'Your Cart', subtitle: 'Review your selected products before checkout', back: '/marketplace' };
      case '/checkout': return { title: 'Checkout', subtitle: 'Finalize order details and submit your purchase order', back: '/cart' };
      default:
        if (location.pathname.startsWith('/po/'))
          return { title: 'Purchase Order Details', subtitle: 'View complete purchase order detail', back: '/' };
        return { title: '', subtitle: '', back: null };
    }
  };

  const { title, subtitle, back } = getPageInfo();

  return (
    <header className="top-header">
      {/* Row 1: Brand bar — logo left, user right */}
      <div className="top-header__brand-bar">
        <div className="top-header__logo">
          <svg className="top-header__logo-svg" viewBox="0 0 160 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C7.5 4 4 7 4 11c0 3 2 5.5 6 7.5 3 1.5 4 2.8 4 4.5 0 1.8-1.2 3-3.5 3-2 0-3.8-1.2-4.5-3l-2 1c1 2.5 3.5 4 6.5 4 3.8 0 6-2.3 6-5.2 0-3-2-5-5.5-6.8-3.5-1.8-4.5-3.2-4.5-5 0-2 1.5-3.5 3.8-3.5 1.8 0 3.2 1 3.8 2.5l1.8-1C15.2 5.5 13.5 4 12 4z" fill="#1a2260"/>
            <text x="20" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="17" fill="#1a2260" letterSpacing="-0.5">slipstream</text>
          </svg>
        </div>
        <div className="top-header__user">
          <div className="top-header__user-info">
            <span className="top-header__user-name">svc_pp_uk_orders_dev</span>
            <span className="top-header__user-role">Business Manager</span>
          </div>
          <div className="top-header__avatar">
            <img src="https://ui-avatars.com/api/?name=SVC+PP&background=1a2260&color=fff&rounded=true&bold=true&size=36" alt="User" />
          </div>
        </div>
      </div>

      {/* Row 2: Page title bar with optional back arrow */}
      {title && (
        <div className="top-header__title-bar">
          <div className="top-header__title-group">
            {back && (
              <button className="top-header__back" onClick={() => navigate(back)} title="Go back">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="top-header__title">{title}</h1>
              {subtitle && <p className="top-header__subtitle">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
