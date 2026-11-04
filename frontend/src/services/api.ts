import axios from 'axios'
import { triggerAuthError } from '../context/AuthContext'

const api = axios.create({
  baseURL: 'http://localhost:5150/api'
})

// ✨ NOVO: roda ANTES de toda requisição
api.interceptors.request.use(config => {
  const saved = localStorage.getItem('auth')
  if (saved) {
    const { token } = JSON.parse(saved)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✨ NOVO: intercepta 401 para logout automático
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth')
      // Dispara evento customizado para AuthContext lidar com logout + redirect via ProtectedRoute
      triggerAuthError()
    }
    return Promise.reject(error)
  }
)

export default api