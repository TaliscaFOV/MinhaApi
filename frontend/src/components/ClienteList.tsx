import {type Clientes } from '../types/Clientes'

interface Props {
  clientes: Clientes[]
  loading: boolean
}

function ClientesList({ clientes, loading }: Props) {
  if (loading) return <p>Carregando...</p>
  if (clientes.length === 0)
    return <p>Nenhum cliente cadastrado ainda.</p>

  return (
    <ul>
      {clientes.map(c => (
        <li key={c.id}>
          <strong>{c.nome}</strong> — {c.email}
          {c.cpf && <span> (CPF: {c.cpf})</span>}
        </li>
      ))}
    </ul>
  )
}
export default ClientesList