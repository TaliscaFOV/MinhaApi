import api from './api'
import {type Clientes,type NovoCliente } from '../types/Clientes'

export const clientesService = {
  listar: async (): Promise<Clientes[]> => {
    const { data } = await api.get('/cliente')
    return data
  },
  criar: async (c: NovoCliente): Promise<Clientes> => {
    const { data } = await api.post('/cliente', c)
    return data
  }
}