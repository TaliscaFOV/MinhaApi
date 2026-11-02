using MinhaApi.Models;
using MinhaApi.Repositories;
using MySqlConnector;

public class VendaRepository : IVendaRepository
{
    private readonly string _connectionString;

    public VendaRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");
    }

    private const string ColunasVenda =
        "idVenda, quantidade, data_venda, preco_unitario, preco_total, idCliente, idProduto, idPedido";

    private static Venda LerVenda(MySqlDataReader reader)
    {
        return new Venda
        {
            IdVenda = reader.GetInt32("idVenda"),
            Quantidade = reader.GetInt32("quantidade"),
            DataVenda = reader.GetDateTime("data_venda"),
            PrecoUnitario = reader.GetDecimal("preco_unitario"),
            PrecoTotal = reader.GetDecimal("preco_total"),
            IdCliente = reader.GetInt32("idCliente"),
            IdProduto = reader.GetInt32("idProduto"),
            IdPedido = reader.IsDBNull(reader.GetOrdinal("idPedido"))
                ? null
                : reader.GetInt32("idPedido")
        };
    }

    public IEnumerable<Venda> GetAll()
    {
        var vendas = new List<Venda>();

        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = $"SELECT {ColunasVenda} FROM venda";
        using var cmd = new MySqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read())
            vendas.Add(LerVenda(reader));

        return vendas;
    }

    public Venda? GetById(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = $"SELECT {ColunasVenda} FROM venda WHERE idVenda = @Id";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Id", id);
        using var reader = cmd.ExecuteReader();

        if (!reader.Read())
            return null;

        return LerVenda(reader);
    }

    public void Add(Venda v)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();
        using var tx = conn.BeginTransaction();

        try
        {
            // 1. Busca preço e estoque atual do produto
            decimal precoUnitario;
            int estoqueAtual;

            string sqlProduto = "SELECT preco, estoque FROM produto WHERE idProduto = @IdProduto";
            using (var cmd = new MySqlCommand(sqlProduto, conn, tx))
            {
                cmd.Parameters.AddWithValue("@IdProduto", v.IdProduto);
                using var reader = cmd.ExecuteReader();

                if (!reader.Read())
                    throw new Exception("Produto não encontrado");

                precoUnitario = reader.GetDecimal("preco");
                estoqueAtual = reader.GetInt32("estoque");
            }

            // 2. Valida estoque
            if (estoqueAtual < v.Quantidade)
                throw new Exception($"Estoque insuficiente. Disponível: {estoqueAtual}");

            // 3. Baixa o estoque
            string sqlBaixa = "UPDATE produto SET estoque = estoque - @Qtd WHERE idProduto = @IdProduto";
            using (var cmd = new MySqlCommand(sqlBaixa, conn, tx))
            {
                cmd.Parameters.AddWithValue("@Qtd", v.Quantidade);
                cmd.Parameters.AddWithValue("@IdProduto", v.IdProduto);
                cmd.ExecuteNonQuery();
            }

            // 4. Calcula preços e grava a venda
            v.PrecoUnitario = precoUnitario;
            v.PrecoTotal = precoUnitario * v.Quantidade;

            string sqlVenda = @"INSERT INTO venda (quantidade, data_venda, preco_unitario, preco_total, idCliente, idProduto)
                                VALUES (@Qtd, @Data, @PrecoUnit, @PrecoTotal, @IdCliente, @IdProduto);
                                SELECT LAST_INSERT_ID();";

            using (var cmd = new MySqlCommand(sqlVenda, conn, tx))
            {
                cmd.Parameters.AddWithValue("@Qtd", v.Quantidade);
                cmd.Parameters.AddWithValue("@Data", v.DataVenda);
                cmd.Parameters.AddWithValue("@PrecoUnit", v.PrecoUnitario);
                cmd.Parameters.AddWithValue("@PrecoTotal", v.PrecoTotal);
                cmd.Parameters.AddWithValue("@IdCliente", v.IdCliente);
                cmd.Parameters.AddWithValue("@IdProduto", v.IdProduto);

                var idGerado = cmd.ExecuteScalar();
                v.IdVenda = Convert.ToInt32(idGerado);
            }

            tx.Commit();
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    public int AddPedido(int idCliente, DateTime dataVenda, IReadOnlyList<Venda> itens)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();
        using var tx = conn.BeginTransaction();

        try
        {
            const string sqlPedido = @"INSERT INTO pedido_venda (idCliente, data_venda)
                                       VALUES (@IdCliente, @Data);
                                       SELECT LAST_INSERT_ID();";
            int idPedido;
            using (var cmd = new MySqlCommand(sqlPedido, conn, tx))
            {
                cmd.Parameters.AddWithValue("@IdCliente", idCliente);
                cmd.Parameters.AddWithValue("@Data", dataVenda);
                idPedido = Convert.ToInt32(cmd.ExecuteScalar());
            }

            foreach (var item in itens.OrderBy(item => item.IdProduto))
            {
                decimal precoUnitario;
                int estoqueAtual;
                bool ativo;

                const string sqlProduto = @"SELECT preco, estoque, ativo
                                            FROM produto
                                            WHERE idProduto = @IdProduto
                                            FOR UPDATE";
                using (var cmd = new MySqlCommand(sqlProduto, conn, tx))
                {
                    cmd.Parameters.AddWithValue("@IdProduto", item.IdProduto);
                    using var reader = cmd.ExecuteReader();
                    if (!reader.Read())
                        throw new KeyNotFoundException($"Produto {item.IdProduto} não encontrado.");

                    precoUnitario = reader.GetDecimal("preco");
                    estoqueAtual = reader.GetInt32("estoque");
                    ativo = reader.GetBoolean("ativo");
                }

                if (!ativo)
                    throw new ArgumentException($"O produto {item.IdProduto} está inativo.");
                if (estoqueAtual < item.Quantidade)
                    throw new ArgumentException(
                        $"Estoque insuficiente para o produto {item.IdProduto}. Disponível: {estoqueAtual}.");

                const string sqlBaixa = @"UPDATE produto
                                          SET estoque = estoque - @Quantidade
                                          WHERE idProduto = @IdProduto AND estoque >= @Quantidade";
                using (var cmd = new MySqlCommand(sqlBaixa, conn, tx))
                {
                    cmd.Parameters.AddWithValue("@Quantidade", item.Quantidade);
                    cmd.Parameters.AddWithValue("@IdProduto", item.IdProduto);
                    if (cmd.ExecuteNonQuery() != 1)
                        throw new ArgumentException(
                            $"Estoque insuficiente para o produto {item.IdProduto}.");
                }

                item.IdCliente = idCliente;
                item.IdPedido = idPedido;
                item.DataVenda = dataVenda;
                item.PrecoUnitario = precoUnitario;
                item.PrecoTotal = precoUnitario * item.Quantidade;

                const string sqlItem = @"INSERT INTO venda
                    (quantidade, data_venda, preco_unitario, preco_total, idCliente, idProduto, idPedido)
                    VALUES (@Quantidade, @Data, @PrecoUnitario, @PrecoTotal, @IdCliente, @IdProduto, @IdPedido)";
                using (var cmd = new MySqlCommand(sqlItem, conn, tx))
                {
                    cmd.Parameters.AddWithValue("@Quantidade", item.Quantidade);
                    cmd.Parameters.AddWithValue("@Data", dataVenda);
                    cmd.Parameters.AddWithValue("@PrecoUnitario", precoUnitario);
                    cmd.Parameters.AddWithValue("@PrecoTotal", item.PrecoTotal);
                    cmd.Parameters.AddWithValue("@IdCliente", idCliente);
                    cmd.Parameters.AddWithValue("@IdProduto", item.IdProduto);
                    cmd.Parameters.AddWithValue("@IdPedido", idPedido);
                    cmd.ExecuteNonQuery();
                }
            }

            tx.Commit();
            return idPedido;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }
}