// Os nomes devem coincidir com o Swagger
export interface Cliente {
  id: number
  nome: string
  email: string
  cpf: string
  ativo: boolean
}

export type NovoCliente =
  Omit<Cliente, 'id' | 'ativo'>