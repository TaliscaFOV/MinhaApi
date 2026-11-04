import {type ProdutoEstoqueBaixo } from '../../types/Dashboard'
import { painel } from '../../utils/estilos'

function EstoqueBaixo({ dados }: { dados: ProdutoEstoqueBaixo[] }) {
  return (
    <div style={painel}>
      <h3>⚠️ Estoque baixo</h3>
      {dados.length === 0 ? <p>✅ Todos os produtos com estoque ok.</p> : (
        <ul>
          {dados.map(p => (
            <li key={p.id}>
              {p.nome} —{' '}
              <strong style={{ color: p.estoque === 0 ? '#e53935' : '#f9a825' }}>
                {p.estoque === 0 ? 'ESGOTADO' : `${p.estoque} un.`}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default EstoqueBaixo