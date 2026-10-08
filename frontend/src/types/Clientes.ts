// Os nomes devem coincidir com o Swagger
export interface Clientes {
  id: number
  nome: string
  email: string
  cpf: string
  ativo: boolean
}

export type NovoClientes =
  Omit<Clientes, 'id' | 'ativo'>