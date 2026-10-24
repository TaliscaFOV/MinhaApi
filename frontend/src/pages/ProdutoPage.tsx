import { useEffect, useState } from 'react'
import { type Produto } from '../types/Produto'
import { ProdutoService } from '../services/ProdutoService'
import ProdutoForm from '../components/ProdutoForm'
import ProdutoList from '../components/ProdutoList'

function ProdutoPage() {
  const [Produto, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarProduto = async () => {
    try {
      setLoading(true)
      setProdutos(await ProdutoService.listar())
    } catch { setErro('Erro ao carregar produtos.') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarProduto() }, [])

  return (<div>
    <h1>Gestão de Produtos</h1>
    <ProdutoForm onProdutoCriado={carregarProduto} />
    {erro && <p>{erro}</p>}
    <ProdutoList produtos={Produto} loading={loading} />
  </div>)
}
export default ProdutoPage