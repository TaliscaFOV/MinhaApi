// src/services/produtoService.ts
import api from './api'
import  {type Produto,type NovoProduto} from '../types/Produto'

export const produtoService = {

  listar: async (): Promise<Produto[]> => {
    const { data } = await api.get('/produto')
    return data
  },

  criar: async (p: NovoProduto): Promise<Produto> => {
    const { data } = await api.post('/produto', p)
    return data
  }

}