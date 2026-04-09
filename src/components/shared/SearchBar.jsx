import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', id = 'search-bar' }) {
  return (
    <div className="search-bar">
      <Search size={16} className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={id}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange('')} title="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
