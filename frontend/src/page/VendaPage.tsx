import { useEffect, useState } from 'react'
import { VendaService } from '../service/VendaService'
import { ClienteService } from '../service/ClienteService'
import { ProdutoService } from '../service/ProdutoService'
import { type Venda } from '../type/Venda'
import { type Cliente } from '../type/Cliente'
import { type Produto } from '../type/Produto'
import VendaForm from '../component/VendaForm'
import VendaList from '../component/VendaList'

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