import { BellIcon, ChartIcon, GridIcon, PlaneIcon, SettingsIcon, TargetIcon } from './icons';

const navigation = [
  { label: 'Visão geral', icon: GridIcon, active: true },
  { label: 'Meus Hunters', icon: TargetIcon },
  { label: 'Alertas', icon: BellIcon },
  { label: 'Histórico', icon: ChartIcon },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><PlaneIcon /></span>
        <span><strong>Hunter</strong><small>PLATFORM</small></span>
      </div>

      <div className="module-card">
        <span className="module-icon"><PlaneIcon /></span>
        <span><small>Módulo ativo</small><strong>Flight Hunter</strong></span>
        <span className="module-status" />
      </div>

      <nav className="navigation" aria-label="Navegação principal">
        <p className="nav-label">MENU</p>
        {navigation.map(({ label, icon: Icon, active }) => (
          <a className={`nav-item${active ? ' active' : ''}`} href="#" key={label}>
            <Icon />
            <span>{label}</span>
            {label === 'Alertas' && <span className="nav-badge">3</span>}
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <a className="nav-item" href="#"><SettingsIcon /><span>Configurações</span></a>
        <div className="profile-card">
          <div className="avatar">RB</div>
          <span><strong>Renan Braga</strong><small>Plano Premium</small></span>
          <span className="online-dot" />
        </div>
      </div>
    </aside>
  );
}
