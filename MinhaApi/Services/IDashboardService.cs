public interface IDashboardService
{
    DashboardResumo ObterResumo(int dias);
    List<VendasPorDia> ObterVendasPorDia(int dias);
    List<TopProduto> ObterTopProdutos(int dias, int limite);
    List<UltimaVenda> ObterUltimasVendas(int limite);
    List<ProdutoEstoqueBaixo> ObterEstoqueBaixo(int minimo);
}