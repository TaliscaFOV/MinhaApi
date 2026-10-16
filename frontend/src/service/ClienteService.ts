import api from './api'
import {type Cliente,type NovoCliente } from '../type/Cliente'

export const ClienteService = {
  listar: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/cliente')
    return data
  },
  criar: async (c: NovoCliente): Promise<Cliente> => {
    const { data } = await api.post('/cliente', c)
    return data
  }
}