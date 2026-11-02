import { type VendaPedido } from '../types/Venda'

interface Props {
  vendas: VendaPedido[]
  loading: boolean
}

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function VendaList({ vendas, loading }: Props) {
  if (loading) return <div className="sales-empty-state"><span className="sales-spinner" />Carregando vendas...</div>
  if (vendas.length === 0) {
    return (
      <div className="sales-empty-state">
        <span className="sales-empty-icon" aria-hidden="true">▤</span>
        <strong>Nenhuma venda por enquanto</strong>
        <p>Quando você registrar um pedido, ele aparecerá aqui.</p>
      </div>
    )
  }

  return (
    <div className="sales-order-list">
      {vendas.map(venda => (
        <section className="sales-order-card" key={`pedido-${venda.idPedido}`}>
          <header className="sales-order-header">
            <div className="sales-order-identity">
              <span className="sales-order-icon" aria-hidden="true">▤</span>
              <div>
                <strong>Pedido #{Math.abs(venda.idPedido)}</strong>
                <span>{venda.nomeCliente}</span>
              </div>
            </div>
            <div className="sales-order-meta">
              <span className="sales-order-status"><i /> Concluído</span>
              <time dateTime={venda.data_Venda}>
                {new Date(venda.data_Venda).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </header>
          <div className="sales-order-items">
            {venda.itens.map((item, index) => (
              <div className="sales-order-item" key={`${item.idProduto}-${index}`}>
                <div className="sales-order-product">
                  <span className="sales-order-product-icon" aria-hidden="true">{item.nomeProduto.charAt(0).toUpperCase()}</span>
                  <div>
                    <strong>{item.nomeProduto}</strong>
                    <span>{moeda(item.valor_Unitario)} cada</span>
                  </div>
                </div>
                <span className="sales-order-quantity">× {item.quantidade}</span>
                <strong className="sales-order-line-total">{moeda(item.total_Venda)}</strong>
              </div>
            ))}
          </div>
          <footer className="sales-order-footer">
            <span>{venda.itens.length} {venda.itens.length === 1 ? 'item' : 'itens'} no pedido</span>
            <div><span>Total do pedido</span><strong>{moeda(venda.total_Venda)}</strong></div>
          </footer>
        </section>
      ))}
    </div>
  )
}

export default VendaList
