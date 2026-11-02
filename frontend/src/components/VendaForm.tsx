import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { VendaService } from '../services/VendaService'
import { type Cliente } from '../types/Cliente'
import { type Produto } from '../types/Produto'

interface Props {
  clientes: Cliente[]
  produtos: Produto[]
  onVendaCriada: () => void
}

interface ItemCarrinho {
  idProduto: number
  quantidade: number
}

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function lerMensagem(err: unknown): string {
  const padrao = 'Não foi possível registrar a venda. Tente novamente.'

  if (!axios.isAxiosError(err)) return padrao
  if (!err.response) return 'Não foi possível conectar ao servidor. Verifique se a API está rodando.'

  const dados: unknown = err.response.data

  if (typeof dados === 'string' && dados.trim() && dados.length <= 200) return dados

  if (dados && typeof dados === 'object') {
    const objeto = dados as Record<string, unknown>
    for (const chave of ['message', 'mensagem', 'erro', 'error', 'detail', 'title']) {
      const valor = objeto[chave]
      if (typeof valor === 'string' && valor.trim()) return valor
    }
  }
  return padrao
}

function VendaForm({ clientes, produtos, onVendaCriada }: Props) {
  const [idCliente, setIdCliente] = useState('')
  const [idProduto, setIdProduto] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  const produtoSelecionado = produtos.find(p => p.id === Number(idProduto))
  const total = itens.reduce((soma, item) => {
    const produto = produtos.find(p => p.id === item.idProduto)
    return soma + (produto ? produto.preco * item.quantidade : 0)
  }, 0)

  const adicionarItem = () => {
    setErro(null)
    setSucesso(null)

    const qtd = Number(quantidade)
    if (!idProduto || !Number.isInteger(qtd) || qtd < 1) {
      setErro('Selecione um produto e informe uma quantidade válida.')
      return
    }

    const produto = produtos.find(p => p.id === Number(idProduto))
    if (!produto || !produto.ativo) {
      setErro('Selecione um produto ativo.')
      return
    }
    if (qtd > produto.estoque) {
      setErro(`Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}.`)
      return
    }
    if (itens.some(item => item.idProduto === produto.id)) {
      setErro('Esse produto já está na lista. Ajuste a quantidade na própria lista.')
      return
    }

    setItens(atual => [...atual, { idProduto: produto.id, quantidade: qtd }])
    setIdProduto('')
    setQuantidade('1')
  }

  const atualizarQuantidade = (id: number, valor: string) => {
    const qtd = Number(valor)
    const produto = produtos.find(p => p.id === id)
    if (!produto || !Number.isInteger(qtd) || qtd < 1 || qtd > produto.estoque) return
    setItens(atual => atual.map(item =>
      item.idProduto === id ? { ...item, quantidade: qtd } : item,
    ))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSucesso(null)

    if (!idCliente) {
      setErro('Selecione o cliente.')
      return
    }
    if (itens.length === 0) {
      setErro('Adicione pelo menos um produto à lista.')
      return
    }

    try {
      setLoading(true)
      await VendaService.criar({
        idCliente: Number(idCliente),
        itens,
      })
      setSucesso('Venda registrada com sucesso!')
      setIdCliente('')
      setItens([])
      onVendaCriada()
    } catch (err) {
      setErro(lerMensagem(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="sale-form-card" onSubmit={handleSubmit}>
      <div className="sale-card-heading">
        <div className="sale-card-icon" aria-hidden="true">＋</div>
        <div>
          <p className="sales-eyebrow">NOVA TRANSAÇÃO</p>
          <h2>Registrar uma venda</h2>
          <p>Escolha o cliente e adicione um ou mais produtos ao pedido.</p>
        </div>
        <span className="sale-step-badge">1 <span>pedido</span></span>
      </div>

      {erro && (
        <p className="sale-notice sale-notice--error" role="alert">⚠ {erro}</p>
      )}
      {sucesso && (
        <p className="sale-notice sale-notice--success" role="status">✓ {sucesso}</p>
      )}

      <div className="sale-fields">
      <div className="sale-field sale-field--customer">
        <label htmlFor="cliente">Cliente</label>
        <select id="cliente" value={idCliente}
          onChange={e => setIdCliente(e.target.value)} required>
          <option value="">Selecione um cliente...</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome}{c.ativo ? '' : ' (inativo)'}
            </option>
          ))}
        </select>
      </div>

      <div className="sale-field sale-field--product">
        <label htmlFor="produto">Produto</label>
        <select id="produto" value={idProduto}
          onChange={e => setIdProduto(e.target.value)}>
          <option value="">Selecione um produto...</option>
          {produtos.map(p => (
            <option key={p.id} value={p.id} disabled={!p.ativo || p.estoque < 1}>
              {p.nome} — {moeda(p.preco)} ({p.estoque} em estoque){p.ativo ? '' : ' (inativo)'}
            </option>
          ))}
        </select>
      </div>

      <div className="sale-field sale-field--quantity">
        <label htmlFor="quantidade">Quantidade</label>
        <input id="quantidade" type="number" step="1" min="1"
          max={produtoSelecionado?.estoque} value={quantidade}
          onChange={e => setQuantidade(e.target.value)} />
      </div>
      <button className="sale-add-button" type="button" onClick={adicionarItem}>
        <span aria-hidden="true">＋</span> Adicionar item
      </button>
      </div>

      <section className="sale-cart" aria-label="Itens do pedido">
        <div className="sale-cart-heading">
          <div>
            <h3>Itens do pedido</h3>
            <p>{itens.length === 0 ? 'Sua lista está pronta para receber produtos.' : `${itens.length} ${itens.length === 1 ? 'produto' : 'produtos'} adicionados`}</p>
          </div>
          <span className="sale-cart-count">{itens.length.toString().padStart(2, '0')}</span>
        </div>
        {itens.length > 0 ? (
          <ul className="sale-cart-list">
            {itens.map(item => {
              const produto = produtos.find(p => p.id === item.idProduto)
              if (!produto) return null
              return (
                <li className="sale-cart-item" key={item.idProduto}>
                  <span className="sale-product-avatar" aria-hidden="true">{produto.nome.charAt(0).toUpperCase()}</span>
                  <div className="sale-cart-product">
                    <strong>{produto.nome}</strong>
                    <span>{moeda(produto.preco)} por unidade</span>
                  </div>
                  <label className="sale-cart-quantity" htmlFor={`quantidade-${item.idProduto}`}>
                    <span>Qtd.</span>
                    <input
                      id={`quantidade-${item.idProduto}`}
                      type="number"
                      min="1"
                      max={produto.estoque}
                      value={item.quantidade}
                      onChange={e => atualizarQuantidade(item.idProduto, e.target.value)}
                    />
                  </label>
                  <strong className="sale-cart-line-total">{moeda(produto.preco * item.quantidade)}</strong>
                  <button
                    className="sale-remove-button"
                    type="button"
                    onClick={() => setItens(atual => atual.filter(i => i.idProduto !== item.idProduto))}
                    aria-label={`Remover ${produto.nome}`}
                  >
                    ×
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="sale-cart-empty">
            <span aria-hidden="true">▧</span>
            <p>Os produtos adicionados aparecerão aqui</p>
          </div>
        )}
      </section>

      <footer className="sale-form-footer">
        <div className="sale-total">
          <span>Total do pedido</span>
          <strong>{moeda(total)}</strong>
        </div>
        <button className="sale-submit-button" type="submit" disabled={loading}>
          {loading ? 'Registrando pedido...' : 'Registrar pedido'}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </footer>
    </form>
  )
}

export default VendaForm
