import api from './api'
import { type Venda, type NovaVenda } from '../type/Venda'

export const VendaService = {
  listar: async (): Promise<Venda[]> => {
    const { data } = await api.get('/venda')
    return data
  },

  criar: async (v: NovaVenda): Promise<Venda> => {
    const { data } = await api.post('/venda', v)
    return data
  },
}