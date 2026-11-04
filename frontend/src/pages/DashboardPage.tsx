import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'
import { type DashboardResumo,type VendasPorDia,type TopProduto,
        type UltimaVenda,type ProdutoEstoqueBaixo } from '../types/Dashboard'
import { formatarMoeda } from '../utils/formatadores'
import CardResumo from '../components/dashboard/CardResumo'
import GraficoVendas from '../components/dashboard/GraficoVendas'
import TopProdutos from '../components/dashboard/TopProdutos'
import UltimasVendas from '../components/dashboard/UltimasVendas'
import EstoqueBaixo from '../components/dashboard/EstoqueBaixo'

function DashboardPage() {
  const [dias, setDias] = useState(30)
  const [resumo, setResumo] = useState<DashboardResumo | null>(null)
  const [vendasDia, setVendasDia] = useState<VendasPorDia[]>([])
  const [top, setTop] = useState<TopProduto[]>([])
  const [ultimas, setUltimas] = useState<UltimaVenda[]>([])
  const [estoque, setEstoque] = useState<ProdutoEstoqueBaixo[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        setErro(null)
        // 5 requisições EM PARALELO
        const [r, v, t, u, e] = await Promise.all([
          dashboardService.resumo(dias),
          dashboardService.vendasPorDia(dias),
          dashboardService.topProdutos(dias, 5),
          dashboardService.ultimasVendas(dias, 5),
          dashboardService.estoqueBaixo(5)
        ])
        setResumo(r); setVendasDia(v); setTop(t)
        setUltimas(u); setEstoque(e)
      } catch {
        setErro('Erro ao carregar o dashboard.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [dias])   // ← recarrega quando o período muda 

  const linha = (colunas: string) => ({
    display: 'grid', gridTemplateColumns: colunas, gap: 16, marginBottom: 16
  })

  return (
    <div style={{ opacity: loading ? 0.6 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>📊 Dashboard</h1>
        <select value={dias} onChange={e => setDias(Number(e.target.value))}>
          <option value={7}>Últimos 7 dias</option>
          <option value={15}>Últimos 15 dias</option>
          <option value={30}>Últimos 30 dias</option>
        </select>
      </div>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {!resumo && loading && <p>Carregando dashboard...</p>}
      {!resumo && !loading && !erro && <p>Nenhum dado disponível para o período selecionado.</p>}

      {resumo && (
        <div style={linha('repeat(4, 1fr)')}>
          <CardResumo icone="💰" titulo="Faturamento" destaque
            valor={formatarMoeda(resumo.faturamento)} />
          <CardResumo icone="🛒" titulo="Vendas"
            valor={String(resumo.totalVendas)} />
          <CardResumo icone="🎯" titulo="Ticket médio"
            valor={formatarMoeda(resumo.ticketMedio)} />
          <CardResumo icone="👤" titulo="Clientes ativos"
            valor={String(resumo.totalClientes)} />
        </div>
      )}

      <div style={linha('2fr 1fr')}>
        <GraficoVendas dados={vendasDia} />
        <TopProdutos dados={top} />
      </div>
      <div style={linha('2fr 1fr')}>
        <UltimasVendas dados={ultimas} />
        <EstoqueBaixo dados={estoque} />
      </div>
    </div>
  )
}
export default DashboardPage