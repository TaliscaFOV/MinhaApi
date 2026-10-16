import {type Cliente } from '../types/Cliente'

interface Props {
  clientes: Cliente[]
  loading: boolean
}

function ClienteList({ clientes, loading }: Props) {
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
export default ClienteList