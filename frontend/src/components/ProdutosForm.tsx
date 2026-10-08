import { useState, type FormEvent } from 'react'
import { produtosService } from '../services/ProdutosService'

interface Props {
  onProdutosCriado: () => void
}

function ProdutosForm({ onProdutosCriado }: Props) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')
  const [ativo, setAtivo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      await produtosService.criar({
        nome,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo,
      })
      setNome('')
      setPreco('')
      setEstoque('')
      setAtivo(false)
      onProdutosCriado()
    } catch {
      setErro('Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Produto</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <div>
        <label htmlFor="nome">Nome</label>
        <input id="nome" type="text" value={nome}
          onChange={e => setNome(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="preco">Preço</label>
        <input id="preco" type="number" step="0.01" min="0" value={preco}
          onChange={e => setPreco(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="estoque">Estoque</label>
        <input id="estoque" type="number" step="1" min="0" value={estoque}
          onChange={e => setEstoque(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="ativo">Ativo</label>
        <input id="ativo" type="checkbox" checked={ativo}
          onChange={e => setAtivo(e.target.checked)} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Cadastrar'}
      </button>
    </form>
  )
}

export default ProdutosForm