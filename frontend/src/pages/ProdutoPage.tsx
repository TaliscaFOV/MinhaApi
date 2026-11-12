import { useEffect, useState } from 'react'
import { type Produto } from '../types/Produto'
import { ProdutoService } from '../services/ProdutoService'
import ProdutoForm from '../components/ProdutoForm'
import ProdutoList from '../components/ProdutoList'

function ProdutoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)

  const carregarProduto = async () => {
    try {
      setLoading(true)
      setErro(null)
      setProdutos(await ProdutoService.listar())
    } catch { setErro('Não foi possível carregar os produtos. Verifique a conexão com a API.') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarProduto() }, [])

  const handleEditar = (produto: Produto) => {
    setProdutoEditando(produto)
  }

  const handleExcluir = async (id: number) => {
    try {
      await ProdutoService.excluir(id)
      carregarProduto()
    } catch {
      alert('Erro ao excluir produto. Tente novamente.')
    }
  }

  const handleProdutoEditado = () => {
    setProdutoEditando(null)
    carregarProduto()
  }

  const handleUploadFoto = async (id: number, arquivo: File) => {
    try {
      const fotoBase64 = await ProdutoService.uploadFoto(id, arquivo)
      setProdutos(prev => prev.map(p => (p.id === id ? { ...p, fotoBase64 } : p)))
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Erro ao enviar a foto.')
    }
  }

  const handleRemoverFoto = async (id: number) => {
    try {
      await ProdutoService.removerFoto(id)
      setProdutos(prev => prev.map(p => (p.id === id ? { ...p, fotoBase64: null } : p)))
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Erro ao remover a foto.')
    }
  }

  const produtosAtivos = produtos.filter(produto => produto.ativo).length
  const estoqueBaixo = produtos.filter(produto => produto.ativo && produto.estoque <= 5).length

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
          <div><p>Produtos cadastrados</p><strong>{loading || erro ? '—' : produtos.length}</strong></div>
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
        <ProdutoForm
          onProdutoCriado={carregarProduto}
          onProdutoEditado={handleProdutoEditado}
          produto={produtoEditando}
        />
        <section className="management-card">
          <header className="management-list-heading">
            <div>
              <h2>Seu catálogo</h2>
              <p>Produtos e disponibilidade atual</p>
            </div>
            <span className="management-count">{produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}</span>
          </header>
          {erro
            ? <div className="management-load-error" role="alert">{erro}</div>
            : <ProdutoList
                produtos={produtos}
                loading={loading}
                onEditar={handleEditar}
                onExcluir={handleExcluir}
                onUploadFoto={handleUploadFoto}
                onRemoverFoto={handleRemoverFoto}
              />}
        </section>
      </div>
    </div>
  )
}
export default ProdutoPage