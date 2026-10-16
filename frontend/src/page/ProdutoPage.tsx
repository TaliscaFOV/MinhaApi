import { useEffect, useState } from 'react'
import { type Produto } from '../type/Produto'
import { ProdutoService } from '../service/ProdutoService'
import ProdutoForm from '../component/ProdutoForm'
import ProdutoList from '../component/ProdutoList'

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