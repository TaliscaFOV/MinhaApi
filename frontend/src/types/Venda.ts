export interface VendaItem {
  idProduto: number
  nomeProduto: string
  quantidade: number
  valor_Unitario: number
  total_Venda: number
}

export interface VendaPedido {
  idPedido: number
  nomeCliente: string
  data_Venda: string
  itens: VendaItem[]
  total_Venda: number
}

export interface NovoPedidoVenda {
  idCliente: number
  itens: Array<{
    idProduto: number
    quantidade: number
  }>
}
