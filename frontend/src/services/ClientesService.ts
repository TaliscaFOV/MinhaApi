import api from './api'
import {type Clientes,type NovoClientes } from '../types/Clientes'

export const clienteService = {
  listar: async (): Promise<Clientes[]> => {
    const { data } = await api.get('/cliente')
    return data
  },
  criar: async (c: NovoClientes): Promise<Clientes> => {
    const { data } = await api.post('/cliente', c)
    return data
  }
}