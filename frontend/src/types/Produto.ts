export interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
  ativo : boolean
  fotoBase64?: string
}
// Tipo para criação — sem o id (gerado pela MinhaAPI)
export type NovoProduto = Omit<Produto, 'id'>