import { useEffect, useState } from 'react'
import {type Cliente } from '../types/Cliente'
import { ClienteService } from '../services/ClienteService'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'

function ClientesPage() {
  const [cliente, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)

  const carregarClientes = async () => {
    setLoading(true)
    try { setClientes(await ClienteService.listar()) }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarClientes() }, [])
  return (<div>
    <h1>Gestão de Cliente</h1>
    <ClienteForm onClienteCriado={carregarClientes} />
    <ClienteList clientes={cliente} loading={loading} />
  </div>)
}
export default ClientesPage