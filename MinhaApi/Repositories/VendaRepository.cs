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

    public void Add (Venda v)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = @"INSERT INTO venda (id_produto, id_cliente, data_venda, valor_Unitario, quantidade, total_venda)
                        VALUES (@Id_Produto, @Id_Cliente, @Data_Venda, @Valor_Unitario, @Quantidade, @Total_Venda);
                        SELECT LAST_INSERT_ID()";

        using var cmd = new MySqlCommand(sql, conn);

        cmd.Parameters.AddWithValue("@Id_Produto", v.Id_Produto);
        cmd.Parameters.AddWithValue("@Id_Cliente", v.Id_Cliente);
        cmd.Parameters.AddWithValue("@Data_Venda", v.Data_Venda);
        cmd.Parameters.AddWithValue("@Valor_Unitario", v.Valor_Unitario);
        cmd.Parameters.AddWithValue("@Quantidade", v.Quantidade);
        cmd.Parameters.AddWithValue("@Total_Venda", v.Total_Venda);

        var idGerado = cmd.ExecuteScalar();
        v.Id = Convert.ToInt32(idGerado);
    }

    public IEnumerable<Venda> GetAll()
    {
        var vendas = new List<Venda>();

        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = "SELECT id, id_produto, id_cliente, data_venda, valor_unitario, quantidade, total_venda from venda";
        using var cmd = new MySqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            var venda = new Venda
            {
                Id = reader.GetInt32("id"),
                Id_Produto = reader.GetInt32("id_produto"),
                Id_Cliente = reader.GetInt32("id_cliente"),
                Data_Venda = reader.GetDateTime("data_venda"),
                Valor_Unitario = reader.GetDecimal("valor_unitario"),
                Quantidade = reader.GetInt32("quantidade"),
                Total_Venda = reader.GetDecimal("total_venda")
            };
            vendas.Add(venda);
        }

        return vendas;
    }

    public Venda? GetById(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = "SELECT id, id_produto, id_cliente, data_venda, valor_unitario, quantidade, total_venda FROM venda WHERE id = @Id";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Id", id);
        using var reader = cmd.ExecuteReader();

        if (reader.Read())
        {
            return new Venda
            {
                Id = reader.GetInt32("id"),
                Id_Produto = reader.GetInt32("id_produto"),
                Id_Cliente = reader.GetInt32("id_cliente"),
                Data_Venda = reader.GetDateTime("data_venda"),
                Valor_Unitario = reader.GetDecimal("valor_unitario"),
                Quantidade = reader.GetInt32("quantidade"),
                Total_Venda = reader.GetDecimal("total_venda")
            };
        }

        return null;
    }
}