using MinhaApi.Models;
using MySqlConnector;

namespace MinhaApi.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly string _connectionString;

    public ClienteRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");
    }

    private const string Colunas = "idCliente, nome, email, cpf, ativo";

    private static Cliente LerCliente(MySqlDataReader reader)
    {
        int ordCpf = reader.GetOrdinal("cpf");

        return new Cliente
        {
            Id = reader.GetInt32("idCliente"),
            Nome = reader.GetString("nome"),
            Email = reader.GetString("email"),
            Cpf = reader.IsDBNull(ordCpf) ? string.Empty : reader.GetString(ordCpf),
            Ativo = reader.GetBoolean("ativo")
        };
    }

    public IEnumerable<Cliente> GetAll()
    {
        var lista = new List<Cliente>();

        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        using var cmd = new MySqlCommand($"SELECT {Colunas} FROM cliente", conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read())
            lista.Add(LerCliente(reader));

        return lista;
    }

    public Cliente? GetById(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        using var cmd = new MySqlCommand(
            $"SELECT {Colunas} FROM cliente WHERE idCliente = @Id", conn);
        cmd.Parameters.AddWithValue("@Id", id);
        using var reader = cmd.ExecuteReader();

        return reader.Read() ? LerCliente(reader) : null;
    }

    public void Add(Cliente c)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        const string sql = @"INSERT INTO cliente (nome, email, cpf, ativo)
                             VALUES (@Nome, @Email, @Cpf, @Ativo);
                             SELECT LAST_INSERT_ID();";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Nome", c.Nome);
        cmd.Parameters.AddWithValue("@Email", c.Email);
        cmd.Parameters.AddWithValue("@Cpf", c.Cpf);
        cmd.Parameters.AddWithValue("@Ativo", c.Ativo);

        c.Id = Convert.ToInt32(cmd.ExecuteScalar());
    }

    public void Update(Cliente c)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        const string sql = @"UPDATE cliente
                             SET nome = @Nome, email = @Email, cpf = @Cpf, ativo = @Ativo
                             WHERE idCliente = @Id";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Id", c.Id);
        cmd.Parameters.AddWithValue("@Nome", c.Nome);
        cmd.Parameters.AddWithValue("@Email", c.Email);
        cmd.Parameters.AddWithValue("@Cpf", c.Cpf);
        cmd.Parameters.AddWithValue("@Ativo", c.Ativo);
        cmd.ExecuteNonQuery();
    }

    // Exclusão lógica: marca o cliente como inativo
    public void Delete(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        using var cmd = new MySqlCommand(
            "UPDATE cliente SET ativo = 0 WHERE idCliente = @Id", conn);
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.ExecuteNonQuery();
    }
}