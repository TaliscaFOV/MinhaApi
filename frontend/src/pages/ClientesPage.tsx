import { useEffect, useState } from 'react'
import {type Clientes } from '../types/Clientes'
import { clientesService } from '../services/ClientesService'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'

function ClientesPage() {
  const [clientes, setClientes] = useState<Clientes[]>([])
  const [loading, setLoading] = useState(false)

  const carregarClientes = async () => {
    setLoading(true)
    try { setClientes(await clientesService.listar()) }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarClientes() }, [])
  return (<div>
    <h1>Gestão de Cliente</h1>
    <ClienteForm onClienteCriado={carregarClientes} />
    <ClienteList clientes={clientes} loading={loading} />
  </div>)
}
export default ClientesPage