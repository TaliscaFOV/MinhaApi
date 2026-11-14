// src/service/produtoService.ts
import api from './api'
import  {type Produto,type NovoProduto} from '../types/Produto'

export const ProdutoService = {

  listar: async (): Promise<Produto[]> => {
    const { data } = await api.get('/produto')
    return data
  },

  criar: async (p: NovoProduto): Promise<Produto> => {
    const { data } = await api.post('/produto', p)
    return data
  },

  atualizar: async (id: number, produto: Partial<NovoProduto>): Promise<Produto> => {
    const { data } = await api.put(`/produto/${id}`, produto)
    return data
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/produto/${id}`)
  },

  uploadFoto: async (id: number, arquivo: File): Promise<string> => {
    const formData = new FormData()
    formData.append('arquivo', arquivo) // nome = parâmetro do Controller

    const { data } = await api.post(
      `/produto/${id}/foto`,
      formData
    )
    return data.fotoBase64 // data URL retornada pelo backend
  },

  removerFoto: async (id: number): Promise<void> => {
    await api.delete(`/produto/${id}/foto`)
  }

}