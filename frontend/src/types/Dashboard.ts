export interface DashboardResumo {
  totalVendas: number
  faturamento: number
  ticketMedio: number
  totalClientes: number
}
export interface VendasPorDia {
  data: string      // "2026-10-30T00:00:00"
  quantidade: number
  total: number
}
export interface TopProduto {
  produtoId: number
  nome: string
  quantidadeVendida: number
  faturamento: number
}
export interface UltimaVenda {
  id: number
  cliente: string
  produto: string
  quantidade: number
  valorTotal: number
  dataVenda: string
}
export interface ProdutoEstoqueBaixo {
  id: number
  nome: string
  estoque: number
}