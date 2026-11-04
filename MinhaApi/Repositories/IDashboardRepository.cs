public interface IDashboardRepository
{
    DashboardResumo ObterResumo(DateTime inicio);
    List<VendasPorDia> ObterVendasPorDia(DateTime inicio);
    List<TopProduto> ObterTopProdutos(DateTime inicio, int limite);
    List<UltimaVenda> ObterUltimasVendas(int limite);
    List<ProdutoEstoqueBaixo> ObterEstoqueBaixo(int minimo);
}