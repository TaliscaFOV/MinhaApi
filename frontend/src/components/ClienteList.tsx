import {type Cliente } from '../types/Cliente'

interface Props {
  clientes: Cliente[]
  loading: boolean
}

function ClienteList({ clientes, loading }: Props) {
  if (loading) return <div className="management-loading">Carregando clientes...</div>
  if (clientes.length === 0) {
    return (
      <div className="management-empty">
        <span className="management-empty-icon" aria-hidden="true">♙</span>
        <strong>Nenhum cliente cadastrado</strong>
        <p>Cadastre seu primeiro contato usando o formulário.</p>
      </div>
    )
  }

  return (
    <ul className="management-record-list">
      {clientes.map(c => (
        <li className="management-record" key={c.id}>
          <span className="management-record-avatar" aria-hidden="true">{c.nome.charAt(0).toUpperCase()}</span>
          <div className="management-record-info">
            <strong>{c.nome}</strong>
            <span>{c.email}</span>
            {c.cpf && <span>CPF: {c.cpf}</span>}
          </div>
          <span className={`management-status${c.ativo ? '' : ' management-status--inactive'}`}>
            {c.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </li>
      ))}
    </ul>
  )
}
export default ClienteList