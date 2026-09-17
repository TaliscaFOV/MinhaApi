using MinhaApi.Models;
using MySqlConnector;

namespace MinhaApi.Repositories;

public class VendaRepository : IVendaRepository
{
    private readonly string _connectionString;

    public VendaRepository(IConfiguration config)
        => _connectionString = config.GetConnectionString("DefaultConnection")!;

    private const string SqlBase = @"
        SELECT v.idVenda, v.quantidade, v.data_venda, v.preco_unitario, v.preco_total,
               v.idCliente, c.nome AS nomeCliente,
               v.idProduto, p.nome AS nomeProduto
        FROM venda v
        INNER JOIN cliente c ON v.idCliente = c.idCliente
        INNER JOIN produto p ON v.idProduto = p.idProduto";

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
            Cliente = new Cliente
            {
                Id = reader.GetInt32("idCliente"),
                Nome = reader.GetString("nomeCliente")
            },
            IdProduto = reader.GetInt32("idProduto"),
            Produto = new Produto
            {
                Id = reader.GetInt32("idProduto"),
                Nome = reader.GetString("nomeProduto")
            }
        };
    }

    public IEnumerable<Venda> GetAll()
    {
        var lista = new List<Venda>();
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = SqlBase + " ORDER BY v.idVenda DESC";
        using var cmd = new MySqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read())
            lista.Add(LerVenda(reader));

        return lista;
    }

    public Venda? GetById(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = SqlBase + " WHERE v.idVenda = @Id";
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
}