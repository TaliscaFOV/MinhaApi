import { type UltimaVenda } from '../../types/Dashboard'
import { formatarMoeda, formatarDataHora } from '../../utils/formatadores'
import { painel } from '../../utils/estilos'

function UltimasVendas({ dados }: { dados: UltimaVenda[] }) {
  return (
    <div style={painel}>
      <h3>🧾 Últimas vendas</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Data</th><th>Cliente</th><th>Produto</th>
              <th>Qtd.</th><th>Total</th></tr>
        </thead>
        <tbody>
          {dados.map(v => (
            <tr key={v.id}>
              <td>{formatarDataHora(v.dataVenda)}</td>
              <td>{v.cliente}</td>
              <td>{v.produto}</td>
              <td>{v.quantidade}</td>
              <td>{formatarMoeda(v.valorTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default UltimasVendas