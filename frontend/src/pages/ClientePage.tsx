import { useEffect, useState } from 'react'
import {type Cliente } from '../types/Cliente'
import { ClienteService } from '../services/ClienteService'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'

function ClientePage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)

  const carregarClientes = async () => {
    setLoading(true)
    setErro(null)
    try { setClientes(await ClienteService.listar()) }
    catch { setErro('Não foi possível carregar os clientes. Verifique a conexão com a API.') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarClientes() }, [])

  const handleEditar = (cliente: Cliente) => {
    setClienteEditando(cliente)
  }

  const handleExcluir = async (id: number) => {
    try {
      await ClienteService.excluir(id)
      carregarClientes()
    } catch {
      alert('Erro ao excluir cliente. Tente novamente.')
    }
  }

  const handleClienteEditado = () => {
    setClienteEditando(null)
    carregarClientes()
  }

  const clientesAtivos = clientes.filter(item => item.ativo).length
  const clientesInativos = clientes.length - clientesAtivos

  return (
    <div className="management-page">
      <header className="management-heading">
        <div>
          <p className="management-eyebrow">RELACIONAMENTO</p>
          <h1>Clientes</h1>
          <p>Organize seus contatos e mantenha os dados dos clientes atualizados.</p>
        </div>
        <span className="management-heading-icon" aria-hidden="true">♙</span>
      </header>

      <section className="management-stats" aria-label="Resumo dos clientes">
        <article className="management-stat">
          <span className="management-stat-icon">♙</span>
          <div><p>Clientes cadastrados</p><strong>{loading || erro ? '—' : clientes.length}</strong></div>
        </article>
        <article className="management-stat">
          <span className="management-stat-icon management-stat-icon--green">✓</span>
          <div><p>Clientes ativos</p><strong>{loading || erro ? '—' : clientesAtivos}</strong></div>
        </article>
        <article className="management-stat">
          <span className="management-stat-icon management-stat-icon--violet">◷</span>
          <div><p>Clientes inativos</p><strong>{loading || erro ? '—' : clientesInativos}</strong></div>
        </article>
      </section>

      <div className="management-content-grid">
        <ClienteForm
          onClienteCriado={carregarClientes}
          onClienteEditado={handleClienteEditado}
          cliente={clienteEditando}
        />
        <section className="management-card">
          <header className="management-list-heading">
            <div>
              <h2>Lista de clientes</h2>
              <p>Contatos cadastrados no sistema</p>
            </div>
            <span className="management-count">{clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}</span>
          </header>
          {erro
            ? <div className="management-load-error" role="alert">{erro}</div>
            : <ClienteList
                clientes={clientes}
                loading={loading}
                onEditar={handleEditar}
                onExcluir={handleExcluir}
              />}
        </section>
      </div>
    </div>
  )
}
export default ClientePage