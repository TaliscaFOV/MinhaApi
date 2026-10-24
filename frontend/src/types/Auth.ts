// Espelha os DTOs do backend (em camelCase)
export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  nome: string
  email: string
}

// Usuário logado guardado no front
export type AuthUser = LoginResponse