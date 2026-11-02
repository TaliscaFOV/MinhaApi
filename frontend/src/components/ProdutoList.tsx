import {type Produto } from '../types/Produto'

interface Props {
  produtos: Produto[]
  loading: boolean
}

function ProdutoList({ produtos, loading }: Props) {
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
        </li>
      ))}
    </ul>
  )
}

export default ProdutoList