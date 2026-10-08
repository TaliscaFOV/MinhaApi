import { useEffect, useState } from 'react'
import {type Clientes } from '../types/Clientes'
import { clienteService } from '../services/ClientesService'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'

function ClientePage() {
  const [clientes, setClientes] = useState<Clientes[]>([])
  const [loading, setLoading] = useState(false)

  const carregarClientes = async () => {
    setLoading(true)
    try { setClientes(await clienteService.listar()) }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarClientes() }, [])
  return (<div>
    <h1>Gestão de Cliente</h1>
    <ClienteForm onClienteCriado={carregarClientes} />
    <ClienteList clientes={clientes} loading={loading} />
  </div>)
}
export default ClientePage