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
      setErro(null)
      setProdutos(await ProdutoService.listar())
    } catch { setErro('Não foi possível carregar os produtos. Verifique a conexão com a API.') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarProduto() }, [])

  const produtosAtivos = Produto.filter(produto => produto.ativo).length
  const estoqueBaixo = Produto.filter(produto => produto.ativo && produto.estoque <= 5).length

  return (
    <div className="management-page">
      <header className="management-heading">
        <div>
          <p className="management-eyebrow">CATÁLOGO DA LOJA</p>
          <h1>Produtos</h1>
          <p>Gerencie seu catálogo, preços e disponibilidade em estoque.</p>
        </div>
        <span className="management-heading-icon" aria-hidden="true">▦</span>
      </header>

      <section className="management-stats" aria-label="Resumo dos produtos">
        <article className="management-stat">
          <span className="management-stat-icon">▦</span>
          <div><p>Produtos cadastrados</p><strong>{loading || erro ? '—' : Produto.length}</strong></div>
        </article>
        <article className="management-stat">
          <span className="management-stat-icon management-stat-icon--green">✓</span>
          <div><p>Produtos ativos</p><strong>{loading || erro ? '—' : produtosAtivos}</strong></div>
        </article>
        <article className="management-stat">
          <span className="management-stat-icon management-stat-icon--violet">↕</span>
          <div><p>Produtos com estoque baixo</p><strong>{loading || erro ? '—' : estoqueBaixo}</strong></div>
        </article>
      </section>

      <div className="management-content-grid">
        <ProdutoForm onProdutoCriado={carregarProduto} />
        <section className="management-card">
          <header className="management-list-heading">
            <div>
              <h2>Seu catálogo</h2>
              <p>Produtos e disponibilidade atual</p>
            </div>
            <span className="management-count">{Produto.length} {Produto.length === 1 ? 'produto' : 'produtos'}</span>
          </header>
          {erro
            ? <div className="management-load-error" role="alert">{erro}</div>
            : <ProdutoList produtos={Produto} loading={loading} />}
        </section>
      </div>
    </div>
  )
}
export default ProdutoPage