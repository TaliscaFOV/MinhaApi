using MySqlConnector; // mesmo using dos outros repositories

public class DashboardRepository : IDashboardRepository
{
    private readonly string _cs;
    public DashboardRepository(IConfiguration config)
        => _cs = config.GetConnectionString("DefaultConnection")!;

    public DashboardResumo ObterResumo(DateTime inicio)
    {
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT
              (SELECT COUNT(*) FROM venda
                 WHERE data_venda >= @Inicio) AS total_vendas,
              (SELECT COALESCE(SUM(preco_total), 0) FROM venda
                 WHERE data_venda >= @Inicio) AS faturamento,
              (SELECT COUNT(*) FROM cliente
                 WHERE ativo = 1) AS total_clientes", conn);
        cmd.Parameters.AddWithValue("@Inicio", inicio);

        using var r = cmd.ExecuteReader();
        r.Read();
        return new DashboardResumo
        {
            TotalVendas   = Convert.ToInt32(r["total_vendas"]),
            Faturamento   = Convert.ToDecimal(r["faturamento"]),
            TotalClientes = Convert.ToInt32(r["total_clientes"])
        };
    }

    public List<VendasPorDia> ObterVendasPorDia(DateTime inicio)
    {
        var lista = new List<VendasPorDia>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT DATE(data_venda) AS dia,
                   COUNT(*)         AS qtd,
                   SUM(preco_total) AS total
            FROM venda
            WHERE data_venda >= @Inicio
            GROUP BY DATE(data_venda)
            ORDER BY dia", conn);
        cmd.Parameters.AddWithValue("@Inicio", inicio);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new VendasPorDia
            {
                Data       = Convert.ToDateTime(r["dia"]),
                Quantidade = Convert.ToInt32(r["qtd"]),
                Total      = Convert.ToDecimal(r["total"])
            });
        return lista;
    }
    public List<TopProduto> ObterTopProdutos(DateTime inicio, int limite)
    {
        var lista = new List<TopProduto>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT p.idProduto, p.nome,
                   SUM(v.quantidade)  AS qtd,
                   SUM(v.preco_total) AS total
            FROM venda v
            JOIN produto p ON p.idProduto = v.idProduto
            WHERE v.data_venda >= @Inicio
            GROUP BY p.idProduto, p.nome
            ORDER BY qtd DESC
            LIMIT @Limite", conn);
        cmd.Parameters.AddWithValue("@Inicio", inicio);
        cmd.Parameters.AddWithValue("@Limite", limite);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new TopProduto
            {
                ProdutoId         = Convert.ToInt32(r["idProduto"]),
                Nome              = r["nome"]?.ToString() ?? string.Empty,
                QuantidadeVendida = Convert.ToInt32(r["qtd"]),
                Faturamento       = Convert.ToDecimal(r["total"])
            });
        return lista;
    }

    public List<ProdutoEstoqueBaixo> ObterEstoqueBaixo(int minimo)
    {
        var lista = new List<ProdutoEstoqueBaixo>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT idProduto, nome, estoque FROM produto
            WHERE ativo = 1 AND estoque <= @Minimo
            ORDER BY estoque", conn);
        cmd.Parameters.AddWithValue("@Minimo", minimo);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new ProdutoEstoqueBaixo
            {
                Id      = Convert.ToInt32(r["idProduto"]),
                Nome    = r["nome"]?.ToString() ?? string.Empty,
                Estoque = Convert.ToInt32(r["estoque"])
            });
        return lista;
    }

    public List<UltimaVenda> ObterUltimasVendas(DateTime inicio, int limite)
    {
        var lista = new List<UltimaVenda>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT v.idVenda, c.nome AS cliente, p.nome AS produto,
                   v.quantidade, v.preco_total, v.data_venda
            FROM venda v
            JOIN cliente c ON c.idCliente = v.idCliente
            JOIN produto p ON p.idProduto = v.idProduto
            WHERE v.data_venda >= @Inicio
            ORDER BY v.data_venda DESC
            LIMIT @Limite", conn);
        cmd.Parameters.AddWithValue("@Inicio", inicio);
        cmd.Parameters.AddWithValue("@Limite", limite);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new UltimaVenda
            {
                Id         = Convert.ToInt32(r["idVenda"]),
                Cliente    = r["cliente"]?.ToString() ?? string.Empty,
                Produto    = r["produto"]?.ToString() ?? string.Empty,
                Quantidade = Convert.ToInt32(r["quantidade"]),
                ValorTotal = Convert.ToDecimal(r["preco_total"]),
                DataVenda  = Convert.ToDateTime(r["data_venda"])
            });
        return lista;
    }
} // fim da classe DashboardRepository