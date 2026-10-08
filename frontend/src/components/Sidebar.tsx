import { NavLink } from 'react-router-dom'

const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: 'block',
  padding: '12px 20px',
  color: isActive ? '#c8d400' : 'white',
  fontWeight: isActive ? 700 : 400,
  background: isActive ? 'rgba(255,255,255,.12)' : 'transparent',
  borderLeft: isActive ? '4px solid #c8d400' : '4px solid transparent'
})

export default function Sidebar() {
  return (
    <nav style={{ width: '210px', background: '#1a3d5c',
      minHeight: '100vh', padding: '24px 0', flexShrink: 0 }}>
      <div>MinhaApp</div>
      <NavLink to="/produtos" style={getLinkStyle}>📦 Produtos</NavLink>
      <NavLink to="/clientes" style={getLinkStyle}>👤 Clientes</NavLink>
    </nav>
  )
}