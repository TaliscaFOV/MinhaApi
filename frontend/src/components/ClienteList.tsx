import {type Cliente } from '../types/Cliente'

interface Props {
  clientes: Cliente[]
  loading: boolean
  onEditar?: (cliente: Cliente) => void
  onExcluir?: (id: number) => void
}

function ClienteList({ clientes, loading, onEditar, onExcluir }: Props) {
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

  const handleExcluir = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      onExcluir?.(id)
    }
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
          <div className="management-record-actions">
            {onEditar && (
              <button
                className="management-action-btn management-action-btn--edit"
                onClick={(e) => { e.stopPropagation(); onEditar(c); }}
                aria-label={`Editar ${c.nome}`}
              >
                ✎
              </button>
            )}
            {onExcluir && (
              <button
                className="management-action-btn management-action-btn--delete"
                onClick={(e) => handleExcluir(c.id, e)}
                aria-label={`Excluir ${c.nome}`}
              >
                🗑
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
export default ClienteList