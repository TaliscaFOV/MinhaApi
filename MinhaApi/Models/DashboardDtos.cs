// Um arquivo com os 5 DTOs de leitura do dashboard
public class DashboardResumo
{
    public int     TotalVendas   { get; set; }
    public decimal Faturamento   { get; set; }
    public decimal TicketMedio   { get; set; } // calculado na Service
    public int     TotalClientes { get; set; }
}

public class VendasPorDia
{
    public DateTime Data       { get; set; }
    public int      Quantidade { get; set; }
    public decimal  Total      { get; set; }
}

public class TopProduto
{
    public int     ProdutoId         { get; set; }
    public string  Nome              { get; set; } = string.Empty;
    public int     QuantidadeVendida { get; set; }
    public decimal Faturamento       { get; set; }
}

public class UltimaVenda
{
    public int      Id         { get; set; }
    public string   Cliente    { get; set; } = string.Empty;
    public string   Produto    { get; set; } = string.Empty;
    public int      Quantidade { get; set; }
    public decimal  ValorTotal { get; set; }
    public DateTime DataVenda  { get; set; }
}

public class ProdutoEstoqueBaixo
{
    public int    Id      { get; set; }
    public string Nome    { get; set; } = string.Empty;
    public int    Estoque { get; set; }
}