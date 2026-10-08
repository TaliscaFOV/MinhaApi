using MinhaApi.Models;
using MySqlConnector;

namespace MinhaApi.Repositories;

public class ProdutosRepository : IProdutosRepository
{
    private readonly string _connectionString;

    public ProdutosRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");
    }

    private const string Colunas = "idProduto, nome, preco, estoque, ativo";

    private static Produtos LerProduto(MySqlDataReader reader)
    {
        return new Produtos
        {
            Id = reader.GetInt32("idProduto"),
            Nome = reader.GetString("nome"),
            Preco = reader.GetDecimal("preco"),
            Estoque = reader.GetInt32("estoque"),
            Ativo = reader.GetBoolean("ativo")
        };
    }

    public IEnumerable<Produtos> GetAll()
    {
        var lista = new List<Produtos>();

        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        using var cmd = new MySqlCommand($"SELECT {Colunas} FROM produto", conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read())
            lista.Add(LerProduto(reader));

        return lista;
    }

    public Produtos? GetById(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        using var cmd = new MySqlCommand(
            $"SELECT {Colunas} FROM produto WHERE idProduto = @Id", conn);
        cmd.Parameters.AddWithValue("@Id", id);
        using var reader = cmd.ExecuteReader();

        return reader.Read() ? LerProduto(reader) : null;
    }

    public void Add(Produtos p)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        const string sql = @"INSERT INTO produto (nome, preco, estoque, ativo)
                             VALUES (@Nome, @Preco, @Estoque, @Ativo);
                             SELECT LAST_INSERT_ID();";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Nome", p.Nome);
        cmd.Parameters.AddWithValue("@Preco", p.Preco);
        cmd.Parameters.AddWithValue("@Estoque", p.Estoque);
        cmd.Parameters.AddWithValue("@Ativo", p.Ativo);

        p.Id = Convert.ToInt32(cmd.ExecuteScalar());
    }

    public void Update(Produtos p)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        const string sql = @"UPDATE produto
                             SET nome = @Nome, preco = @Preco, estoque = @Estoque, ativo = @Ativo
                             WHERE idProduto = @Id";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Id", p.Id);
        cmd.Parameters.AddWithValue("@Nome", p.Nome);
        cmd.Parameters.AddWithValue("@Preco", p.Preco);
        cmd.Parameters.AddWithValue("@Estoque", p.Estoque);
        cmd.Parameters.AddWithValue("@Ativo", p.Ativo);
        cmd.ExecuteNonQuery();
    }

    public void Delete(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        using var cmd = new MySqlCommand("DELETE FROM produto WHERE idProduto = @Id", conn);
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.ExecuteNonQuery();
    }

    public void AtualizarEstoque(int id, int quantidade)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        const string sql = @"UPDATE produto
                             SET estoque = estoque - @Quantidade
                             WHERE idProduto = @Id AND estoque >= @Quantidade";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Quantidade", quantidade);
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.ExecuteNonQuery();
    }
}