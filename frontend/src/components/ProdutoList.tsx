import {type Produto } from '../types/Produto'

interface Props {
  produtos: Produto[]
  loading: boolean
  onEditar?: (produto: Produto) => void
  onExcluir?: (id: number) => void
}

function ProdutoList({ produtos, loading, onEditar, onExcluir }: Props) {
  if (loading) return <div className="management-loading">Carregando produtos...</div>
  if (produtos.length === 0) {
    return (
      <div className="management-empty">
        <span className="management-empty-icon" aria-hidden="true">▦</span>
        <strong>Nenhum produto cadastrado</strong>
        <p>Cadastre seu primeiro item usando o formulário.</p>
      </div>
    )
  }

  const handleExcluir = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      onExcluir?.(id)
    }
  }

  return (
    <ul className="management-record-list">
      {produtos.map(p => (
        <li className="management-record" key={p.id}>
          <span className="management-record-avatar" aria-hidden="true">{p.nome.charAt(0).toUpperCase()}</span>
          <div className="management-record-info">
            <strong>{p.nome}</strong>
            <span>Estoque: {p.estoque} unidades</span>
          </div>
          <div className="management-record-trailing">
            <span>{p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span className={`management-status${p.ativo ? '' : ' management-status--inactive'}`}>
              {p.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <div className="management-record-actions">
            {onEditar && (
              <button
                className="management-action-btn management-action-btn--edit"
                onClick={(e) => { e.stopPropagation(); onEditar(p); }}
                aria-label={`Editar ${p.nome}`}
              >
                ✎
              </button>
            )}
            {onExcluir && (
              <button
                className="management-action-btn management-action-btn--delete"
                onClick={(e) => handleExcluir(p.id, e)}
                aria-label={`Excluir ${p.nome}`}
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

export default ProdutoList