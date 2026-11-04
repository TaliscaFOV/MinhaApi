import { useState, type FormEvent, useEffect } from 'react'
import { ClienteService } from '../services/ClienteService'
import type { Cliente } from '../types/Cliente'

interface Props {
  onClienteCriado: () => void
  onClienteEditado?: () => void
  cliente?: Cliente | null
}

function ClienteForm({ onClienteCriado, onClienteEditado, cliente }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const isEditing = !!cliente

  // Pre-populate form when editing
  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome)
      setEmail(cliente.email)
      setCpf(cliente.cpf)
    } else {
      setNome('')
      setEmail('')
      setCpf('')
    }
  }, [cliente])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      if (isEditing && cliente) {
        await ClienteService.atualizar(cliente.id, { nome, email, cpf })
        onClienteEditado?.()
      } else {
        await ClienteService.criar({ nome, email, cpf })
        onClienteCriado()
      }
      setNome('')
      setEmail('')
      setCpf('')
    } catch {
      setErro(isEditing ? 'Erro ao atualizar. Tente novamente.' : 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="management-card">
      <header className="management-card-heading">
        <span className="management-card-heading-icon" aria-hidden="true">{isEditing ? '✎' : '＋'}</span>
        <div>
          <h2>{isEditing ? 'Editar cliente' : 'Novo cliente'}</h2>
          <p>{isEditing ? 'Atualize os dados do cliente' : 'Cadastre um contato para suas vendas'}</p>
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
          {loading ? (isEditing ? 'Salvando alterações...' : 'Salvando cliente...') : (isEditing ? 'Atualizar cliente' : 'Cadastrar cliente')}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </form>
    </section>
  )
}

export default ClienteForm
