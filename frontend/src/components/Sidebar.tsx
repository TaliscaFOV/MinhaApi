import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const iniciais = user?.nome?.trim().charAt(0).toUpperCase() || 'U'

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-brand">
        <span className="app-sidebar-brand-mark" aria-hidden="true">M</span>
        <span>Minha<span>App</span></span>
      </div>

      <p className="app-sidebar-section-label">MENU PRINCIPAL</p>
      <nav className="app-sidebar-nav" aria-label="Menu principal">
        <NavLink to="/vendas" className={({ isActive }) => `app-sidebar-link${isActive ? ' is-active' : ''}`}>
          <span className="app-sidebar-link-icon" aria-hidden="true">▤</span>
          <span>Vendas</span>
        </NavLink>
        <NavLink to="/produtos" className={({ isActive }) => `app-sidebar-link${isActive ? ' is-active' : ''}`}>
          <span className="app-sidebar-link-icon" aria-hidden="true">▦</span>
          <span>Produtos</span>
        </NavLink>
        <NavLink to="/clientes" className={({ isActive }) => `app-sidebar-link${isActive ? ' is-active' : ''}`}>
          <span className="app-sidebar-link-icon" aria-hidden="true">♙</span>
          <span>Clientes</span>
        </NavLink>
      </nav>

      <div className="app-sidebar-user">
        <span className="app-sidebar-avatar" aria-hidden="true">{iniciais}</span>
        <span className="app-sidebar-user-name">{user?.nome || 'Usuário'}</span>
        <button className="app-sidebar-logout" type="button" onClick={logout} aria-label="Sair">
          ↗
        </button>
      </div>
    </aside>
  )
}