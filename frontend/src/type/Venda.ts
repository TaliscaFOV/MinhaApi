export interface Venda {
  id: number
  nomeCliente: string
  nomeProduto: string
  quantidade: number
  data_Venda: string
  valor_Unitario: number
  total_Venda: number
}

export interface NovaVenda {
  idCliente: number
  idProduto: number
  quantidade: number
}