import api from './api'
import { type LoginRequest, type LoginResponse } from '../types/Auth'

export const authService = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', req)
    return data
  }
}