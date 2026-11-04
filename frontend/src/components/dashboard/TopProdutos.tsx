import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { type TopProduto } from '../../types/Dashboard'
import { painel } from '../../utils/estilos'

function TopProdutos({ dados }: { dados: TopProduto[] }) {
  return (
    <div style={painel}>
      <h3>🏆 Mais vendidos</h3>
      {dados.length === 0 ? <p>Sem vendas no período.</p> : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dados} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="nome" width={110} />
            <Tooltip />
            <Bar dataKey="quantidadeVendida" name="Qtd." fill="#c8d400" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
export default TopProdutos