import { useEffect, useState } from 'react'
import { type Produtos } from '../types/Produtos'
import { produtosService } from '../services/ProdutosService'
import ProdutosForm from '../components/ProdutosForm'
import ProdutosList from '../components/ProdutosList'

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produtos[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      setProdutos(await produtosService.listar())
    } catch { setErro('Erro ao carregar produtos.') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarProdutos() }, [])

  return (<div>
    <h1>Gestão de Produtos</h1>
    <ProdutosForm onProdutosCriado={carregarProdutos} />
    {erro && <p>{erro}</p>}
    <ProdutosList produtos={produtos} loading={loading} />
  </div>)
}
export default ProdutosPage