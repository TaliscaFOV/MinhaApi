import api from './api'
import { type NovoPedidoVenda, type VendaPedido } from '../types/Venda'

export const VendaService = {
  listar: async (): Promise<VendaPedido[]> => {
    const { data } = await api.get('/venda/pedidos')
    return data
  },

  criar: async (pedido: NovoPedidoVenda): Promise<VendaPedido> => {
    const { data } = await api.post('/venda/pedidos', pedido)
    return data
  },
}