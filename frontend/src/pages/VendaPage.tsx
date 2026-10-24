import { useEffect, useState } from 'react'
import { VendaService } from '../services/VendaService'
import { ClienteService } from '../services/ClienteService'
import { ProdutoService } from '../services/ProdutoService'
import { type Venda } from '../types/Venda'
import { type Cliente } from '../types/Cliente'
import { type Produto } from '../types/Produto'
import VendaForm from '../components/VendaForm'
import VendaList from '../components/VendaList'

function VendaPage() {
  const [venda, setVendas] = useState<Venda[]>([])
  const [cliente, setClientes] = useState<Cliente[]>([])
  const [produto, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarTudo = async () => {
    try {
      setLoading(true)
      setErro(null)
      const [v, c, p] = await Promise.all([
        VendaService.listar(),
        ClienteService.listar(),
        ProdutoService.listar(),
      ])
      setVendas(v)
      setClientes(c)
      setProdutos(p)
    } catch {
      setErro('Erro ao carregar os dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarTudo() }, [])

  return (
    <div>
      <h1>Vendas</h1>
      <VendaForm clientes={cliente} produtos={produto} onVendaCriada={carregarTudo} />
      <h2>Vendas Realizadas</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <VendaList vendas={venda} loading={loading} />
    </div>
  )
}

export default VendaPage