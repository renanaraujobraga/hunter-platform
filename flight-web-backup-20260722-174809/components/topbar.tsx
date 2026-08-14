import { BellIcon, SearchIcon } from './icons';

export function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">FLIGHT HUNTER</p>
        <h1>Visão geral</h1>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <SearchIcon />
          <input aria-label="Buscar" placeholder="Buscar monitoramentos..." />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button" aria-label="Notificações"><BellIcon /><span /></button>
        <div className="top-avatar">RB</div>
      </div>
    </header>
  );
}
