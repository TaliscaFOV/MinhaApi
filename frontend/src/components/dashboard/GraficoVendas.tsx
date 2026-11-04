import { ResponsiveContainer, LineChart, Line, XAxis,
         YAxis, Tooltip, CartesianGrid } from 'recharts'
import { type VendasPorDia } from '../../types/Dashboard'
import { formatarMoeda, formatarDiaMes } from '../../utils/formatadores'
import { painel } from '../../utils/estilos'

interface Props { dados: VendasPorDia[] }

function GraficoVendas({ dados }: Props) {
  return (
    <div style={painel}>
      <h3>📈 Faturamento por dia</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" tickFormatter={formatarDiaMes} />
          <YAxis />
          <Tooltip
            labelFormatter={l => formatarDiaMes(String(l))}
            formatter={v => formatarMoeda(Number(v))} />
          <Line type="monotone" dataKey="total"
                stroke="#1a3d5c" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
export default GraficoVendas