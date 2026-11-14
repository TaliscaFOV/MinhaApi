import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { ProdutoService } from '../services/ProdutoService'
import type { Produto } from '../types/Produto'

interface Props {
  onProdutoCriado: () => void
  onProdutoEditado?: () => void
  onFotoAlterada?: (id: number, fotoBase64: string | null) => void
  produto?: Produto | null
}

function ProdutoForm({ onProdutoCriado, onProdutoEditado, onFotoAlterada, produto }: Props) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')
  const [ativo, setAtivo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [fotoAtual, setFotoAtual] = useState<string | null>(null)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const isEditing = !!produto

  useEffect(() => {
    if (produto) {
      setNome(produto.nome)
      setPreco(produto.preco.toString())
      setEstoque(produto.estoque.toString())
      setAtivo(produto.ativo)
      setFotoAtual(produto.fotoBase64 ?? null)
    } else {
      setNome('')
      setPreco('')
      setEstoque('')
      setAtivo(false)
      setFotoAtual(null)
    }
  }, [produto])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      if (isEditing && produto) {
        await ProdutoService.atualizar(produto.id, {
          nome, preco: Number(preco), estoque: Number(estoque), ativo
        })
        onProdutoEditado?.()
      } else {
        await ProdutoService.criar({
          nome, preco: Number(preco), estoque: Number(estoque), ativo
        })
        onProdutoCriado()
      }
      setNome('')
      setPreco('')
      setEstoque('')
      setAtivo(false)
      setFotoAtual(null)
    } catch {
      setErro(isEditing ? 'Erro ao atualizar. Tente novamente.' : 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEscolherFoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    e.target.value = ''
    if (!arquivo || !produto) return
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro('Foto muito grande. Máximo: 5 MB.')
      return
    }
    try {
      setEnviandoFoto(true)
      setErro(null)
      const fotoBase64 = await ProdutoService.uploadFoto(produto.id, arquivo)
      setFotoAtual(fotoBase64)
      onFotoAlterada?.(produto.id, fotoBase64)
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? 'Erro ao enviar a foto.')
    } finally {
      setEnviandoFoto(false)
    }
  }

  const handleRemoverFoto = async () => {
    if (!produto) return
    try {
      setEnviandoFoto(true)
      setErro(null)
      await ProdutoService.removerFoto(produto.id)
      setFotoAtual(null)
      onFotoAlterada?.(produto.id, null)
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? 'Erro ao remover a foto.')
    } finally {
      setEnviandoFoto(false)
    }
  }
  return (
    <section className="management-card">
      <header className="management-card-heading">
        <span className="management-card-heading-icon" aria-hidden="true">{isEditing ? '✎' : '＋'}</span>
        <div>
          <h2>{isEditing ? 'Editar produto' : 'Novo produto'}</h2>
          <p>{isEditing ? 'Atualize os dados do produto' : 'Adicione um item ao catálogo'}</p>
        </div>
      </header>
      {erro && <p className="management-notice" role="alert">{erro}</p>}
      <form className="management-form" onSubmit={handleSubmit}>

        <div className="management-field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" value={nome}
            onChange={e => setNome(e.target.value)} placeholder="Ex.: Teclado sem fio" required />
        </div>

        <div className="management-field">
          <label htmlFor="preco">Preço</label>
          <input id="preco" type="number" step="0.01" min="0" value={preco}
            onChange={e => setPreco(e.target.value)} placeholder="0,00" required />
        </div>

        <div className="management-field">
          <label htmlFor="estoque">Estoque</label>
          <input id="estoque" type="number" step="1" min="0" value={estoque}
            onChange={e => setEstoque(e.target.value)} placeholder="0" required />
        </div>

        <div className="management-checkbox">
          <input id="ativo" type="checkbox" checked={ativo}
            onChange={e => setAtivo(e.target.checked)} />
          <label className="management-checkbox-label" htmlFor="ativo">Produto ativo e disponível para venda</label>
        </div>

        {isEditing ? (
          <div className="management-field">
            <label htmlFor="foto">Foto</label>
            {fotoAtual && (
              <img src={fotoAtual} alt={nome}
                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            )}
            <input id="foto" type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleEscolherFoto} disabled={enviandoFoto} />
            {enviandoFoto && <small>Enviando...</small>}
            {fotoAtual && !enviandoFoto && (
              <button type="button" onClick={handleRemoverFoto}>Remover foto</button>
            )}
          </div>
        ) : (
          <small>Salve o produto primeiro para poder adicionar a foto.</small>
        )}

        <button className="management-submit" type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Salvando alterações...' : 'Salvando produto...') : (isEditing ? 'Atualizar produto' : 'Cadastrar produto')}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </form>
    </section>
  )
}

export default ProdutoForm