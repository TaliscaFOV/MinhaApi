import { useEffect, useState } from 'react'
import {type Cliente } from '../type/Cliente'
import { ClienteService } from '../service/ClienteService'
import ClienteForm from '../component/ClienteForm'
import ClienteList from '../component/ClienteList'

function ClientePage() {
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
export default ClientePage