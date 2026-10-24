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

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Pega a mensagem que a API devolveu (estoque insuficiente, cliente inativo etc.)
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
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  const produto = produtos.find(p => p.id === Number(idProduto))
  const qtd = Number(quantidade)
  const total =
    produto && Number.isInteger(qtd) && qtd > 0 ? produto.preco * qtd : 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSucesso(null)

    if (!idCliente || !idProduto) {
      setErro('Selecione o cliente e o produto.')
      return
    }
    if (!Number.isInteger(qtd) || qtd < 1) {
      setErro('A quantidade deve ser um número inteiro maior que zero.')
      return
    }

    try {
      setLoading(true)
      await VendaService.criar({
        idCliente: Number(idCliente),
        idProduto: Number(idProduto),
        quantidade: qtd,
      })
      setSucesso('Venda registrada com sucesso!')
      setIdCliente('')
      setIdProduto('')
      setQuantidade('1')
      onVendaCriada()
    } catch (err) {
      setErro(lerMensagem(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Venda</h2>

      {erro && (
        <p style={{ color: '#b91c1c', background: '#fee2e2', padding: '10px 14px', borderRadius: 8 }}>
          ⚠️ {erro}
        </p>
      )}
      {sucesso && (
        <p style={{ color: '#15803d', background: '#dcfce7', padding: '10px 14px', borderRadius: 8 }}>
          ✅ {sucesso}
        </p>
      )}

      <div>
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

      <div>
        <label htmlFor="produto">Produto</label>
        <select id="produto" value={idProduto}
          onChange={e => setIdProduto(e.target.value)} required>
          <option value="">Selecione um produto...</option>
          {produtos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nome} — {moeda(p.preco)} ({p.estoque} em estoque){p.ativo ? '' : ' (inativo)'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quantidade">Quantidade</label>
        <input id="quantidade" type="number" step="1" min="1" value={quantidade}
          onChange={e => setQuantidade(e.target.value)} required />
      </div>

      <p><strong>Total: {moeda(total)}</strong></p>

      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar venda'}
      </button>
    </form>
  )
}

export default VendaForm