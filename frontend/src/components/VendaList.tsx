import { type Venda } from '../types/Venda'

interface Props {
  vendas: Venda[]
  loading: boolean
}

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function VendaList({ vendas, loading }: Props) {
  if (loading) return <p>Carregando...</p>
  if (vendas.length === 0) return <p>Nenhuma venda registrada ainda.</p>

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left' }}>
          <th>#</th>
          <th>Data</th>
          <th>Cliente</th>
          <th>Produto</th>
          <th>Qtd.</th>
          <th>Unitário</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {vendas.map(v => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{new Date(v.data_Venda).toLocaleString('pt-BR')}</td>
            <td>{v.nomeCliente}</td>
            <td>{v.nomeProduto}</td>
            <td>{v.quantidade}</td>
            <td>{moeda(v.valor_Unitario)}</td>
            <td><strong>{moeda(v.total_Venda)}</strong></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default VendaList