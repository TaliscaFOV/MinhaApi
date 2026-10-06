import { useState } from 'react'
import { clienteService } from '../services/ClienteService'

interface Props { onClienteCriado: () => void }

function ClienteForm({ onClienteCriado }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(null)
    try {
      setLoading(true)
      await clienteService.criar({ nome, email, cpf })
      setNome(''); setEmail(''); setCpf('')
      onClienteCriado()
    } catch { setErro('Erro ao cadastrar. Tente novamente.') }
    finally { setLoading(false) }
  }
  return (
  <form onSubmit={handleSubmit}>
    <h2>Cadastrar Cliente</h2>
    {erro && <p>{erro}</p>}

    <label htmlFor="nome">Nome</label>
    <input id="nome" value={nome}
      onChange={e => setNome(e.target.value)} required />

    <label htmlFor="email">E-mail</label>
    <input id="email" type="email" value={email}
      onChange={e => setEmail(e.target.value)} required />

    <label htmlFor="cpf">CPF</label>
    <input id="cpf" value={cpf}
      onChange={e => setCpf(e.target.value)} />

    <button disabled={loading}>
      {loading ? 'Salvando...' : 'Cadastrar'}
    </button>
  </form>
)
}