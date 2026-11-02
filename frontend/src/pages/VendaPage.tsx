import { useEffect, useState } from 'react'
import { VendaService } from '../services/VendaService'
import { ClienteService } from '../services/ClienteService'
import { ProdutoService } from '../services/ProdutoService'
import { type VendaPedido } from '../types/Venda'
import { type Cliente } from '../types/Cliente'
import { type Produto } from '../types/Produto'
import VendaForm from '../components/VendaForm'
import VendaList from '../components/VendaList'
import './VendaPage.css'

function VendaPage() {
  const [venda, setVendas] = useState<VendaPedido[]>([])
  const [cliente, setClientes] = useState<Cliente[]>([])
  const [produto, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const totalFaturado = venda.reduce((total, pedido) => total + pedido.total_Venda, 0)
  const quantidadeItens = venda.reduce(
    (total, pedido) => total + pedido.itens.reduce((soma, item) => soma + item.quantidade, 0),
    0,
  )

  const carregarTudo = async () => {
    try {
      setLoading(true)
      setErro(null)
      const [v, c, p] = await Promise.all([
        VendaService.listar(),
        ClienteService.listar(),
        ProdutoService.listar(),
      ])
      setVendas(v)
      setClientes(c)
      setProdutos(p)
    } catch {
      setErro('Erro ao carregar os dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarTudo() }, [])

  return (
    <div className="sales-page">
      <header className="sales-heading">
        <div>
          <p className="sales-eyebrow">OPERAÇÃO DA LOJA</p>
          <h1>Vendas</h1>
          <p className="sales-subtitle">Monte o pedido, confira os itens e registre a compra.</p>
        </div>
        <div className="sales-heading-badge" aria-hidden="true">↗</div>
      </header>

      <section className="sales-metrics" aria-label="Resumo das vendas">
        <article className="sales-metric-card">
          <span className="sales-metric-icon sales-metric-icon--blue" aria-hidden="true">▤</span>
          <div>
            <p>Pedidos registrados</p>
            <strong>{loading ? '—' : venda.length}</strong>
          </div>
          <span className="sales-metric-caption">no histórico</span>
        </article>
        <article className="sales-metric-card">
          <span className="sales-metric-icon sales-metric-icon--green" aria-hidden="true">$</span>
          <div>
            <p>Total vendido</p>
            <strong>{loading ? '—' : totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          </div>
          <span className="sales-metric-caption">valor acumulado</span>
        </article>
        <article className="sales-metric-card">
          <span className="sales-metric-icon sales-metric-icon--violet" aria-hidden="true">▦</span>
          <div>
            <p>Unidades vendidas</p>
            <strong>{loading ? '—' : quantidadeItens}</strong>
          </div>
          <span className="sales-metric-caption">todos os produtos</span>
        </article>
      </section>

      <VendaForm clientes={cliente} produtos={produto} onVendaCriada={carregarTudo} />

      <section className="sales-history">
        <div className="sales-section-heading">
          <div>
            <p className="sales-eyebrow">ACOMPANHAMENTO</p>
            <h2>Vendas recentes</h2>
          </div>
          <span className="sales-history-count">{venda.length} {venda.length === 1 ? 'pedido' : 'pedidos'}</span>
        </div>
        {erro && <p className="sales-error" role="alert">{erro}</p>}
        <VendaList vendas={venda} loading={loading} />
      </section>
    </div>
  )
}

export default VendaPage