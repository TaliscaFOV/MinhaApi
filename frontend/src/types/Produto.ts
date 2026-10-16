export interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
  ativo : boolean 
}
// Tipo para criação — sem o id (gerado pela MinhaAPI)
export type NovoProduto = Omit<Produto, 'id'>