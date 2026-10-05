import {type Produto } from '../types/Produto'

interface Props {
  produtos: Produto[]
  loading: boolean
}

function ProdutoList({ produtos, loading }: Props) {

  if (loading)
    return <p>Carregando...</p>

  if (produtos.length === 0)
    return <p>Nenhum produto cadastrado ainda.</p>

  return (
    <ul>
      {produtos.map(p => (
        <li key={p.id}>
          <strong>{p.nome}</strong>
          {' — '}
          R$ {p.preco.toFixed(2)}
        </li>
      ))}
    </ul>
  )
}

export default ProdutoList