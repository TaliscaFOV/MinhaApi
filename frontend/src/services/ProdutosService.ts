// src/services/produtoService.ts
import api from './api'
import  {type Produtos,type NovoProduto} from '../types/Produtos'

export const produtosService = {

  listar: async (): Promise<Produtos[]> => {
    const { data } = await api.get('/produto')
    return data
  },

  criar: async (p: NovoProduto): Promise<Produtos> => {
    const { data } = await api.post('/produto', p)
    return data
  }

}