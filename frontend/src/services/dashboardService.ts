import api from './api'
import { type DashboardResumo, type VendasPorDia, type TopProduto,
         type UltimaVenda,type  ProdutoEstoqueBaixo } from '../types/Dashboard'

export const dashboardService = {
  resumo: async (dias: number): Promise<DashboardResumo> => {
    const { data } = await api.get('/dashboard/resumo', { params: { dias } })
    return data
  },
  vendasPorDia: async (dias: number): Promise<VendasPorDia[]> => {
    const { data } = await api.get('/dashboard/vendas-por-dia', { params: { dias } })
    return data
  },
  topProdutos: async (dias: number, limite: number): Promise<TopProduto[]> => {
    const { data } = await api.get('/dashboard/top-produtos', { params: { dias, limite } })
    return data
  },
  ultimasVendas: async (dias: number, limite: number): Promise<UltimaVenda[]> => {
    const { data } = await api.get('/dashboard/ultimas-vendas', { params: { dias, limite } })
    return data
  },
  estoqueBaixo: async (minimo: number): Promise<ProdutoEstoqueBaixo[]> => {
    const { data } = await api.get('/dashboard/estoque-baixo', { params: { minimo } })
    return data
  }
}