import { NavLink } from 'react-router-dom';
import { Home, Store, Menu, ChevronLeft } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ isExpanded, toggleSidebar }) {
  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="sidebar__toggle" onClick={toggleSidebar} title={isExpanded ? 'Collapse menu' : 'Expand menu'}>
        {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      <nav className="sidebar__nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
          <div className="sidebar__link-icon"><Home size={20} /></div>
          <span className="sidebar__link-text">Home</span>
        </NavLink>
        <NavLink to="/marketplace" className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
          <div className="sidebar__link-icon"><Store size={20} /></div>
          <span className="sidebar__link-text">Market Place</span>
        </NavLink>
      </nav>
    </aside>
  );
}
