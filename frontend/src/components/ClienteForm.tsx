import { useState, type FormEvent } from 'react'
import { clienteService } from '../services/ClientesService'

interface Props {
  onClienteCriado: () => void
}

function ClienteForm({ onClienteCriado }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [ativo, setAtivo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      await clienteService.criar({ nome, email, cpf })
      setNome('')
      setEmail('')
      setCpf('')
      setAtivo(true)
      onClienteCriado()
    } catch {
      setErro('Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Cliente</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <label htmlFor="nome">Nome</label>
      <input id="nome" value={nome}
        onChange={e => setNome(e.target.value)} required />

      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" value={email}
        onChange={e => setEmail(e.target.value)} required />

      <label htmlFor="cpf">CPF</label>
      <input id="cpf" value={cpf} maxLength={14}
        onChange={e => setCpf(e.target.value)} required />

      <label htmlFor="ativo">Ativo</label>
      <input id="ativo" type="checkbox" checked={ativo}
        onChange={e => setAtivo(e.target.checked)} />

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Cadastrar'}
      </button>
    </form>
  )
}

export default ClienteForm
