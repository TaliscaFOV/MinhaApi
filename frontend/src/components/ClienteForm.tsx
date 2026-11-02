import { useState, type FormEvent } from 'react'
import { ClienteService } from '../services/ClienteService'

interface Props {
  onClienteCriado: () => void
}

function ClienteForm({ onClienteCriado }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      await ClienteService.criar({ nome, email, cpf })
      setNome('')
      setEmail('')
      setCpf('')
      onClienteCriado()
    } catch {
      setErro('Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="management-card">
      <header className="management-card-heading">
        <span className="management-card-heading-icon" aria-hidden="true">＋</span>
        <div>
          <h2>Novo cliente</h2>
          <p>Cadastre um contato para suas vendas</p>
        </div>
      </header>
      {erro && <p className="management-notice" role="alert">{erro}</p>}
      <form className="management-form" onSubmit={handleSubmit}>
        <div className="management-field">
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" value={nome} autoComplete="name"
            onChange={e => setNome(e.target.value)} placeholder="Ex.: Maria da Silva" required />
        </div>

        <div className="management-field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} autoComplete="email"
            onChange={e => setEmail(e.target.value)} placeholder="nome@exemplo.com" required />
        </div>

        <div className="management-field">
          <label htmlFor="cpf">CPF</label>
          <input id="cpf" value={cpf} maxLength={14} inputMode="numeric"
            onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" required />
        </div>

        <button className="management-submit" type="submit" disabled={loading}>
          {loading ? 'Salvando cliente...' : 'Cadastrar cliente'}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </form>
    </section>
  )
}

export default ClienteForm
