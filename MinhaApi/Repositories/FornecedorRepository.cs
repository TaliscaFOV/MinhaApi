using MinhaApi.Models;
using MinhaApi.Repositories;
using MySqlConnector;
public class FornecedorRepository : IFornecedorRepository
{
    private readonly string _connectionString;

      public FornecedorRepository(IConfiguration config) 
      => _connectionString = config.GetConnectionString("DefaultConnection")!;

     public IEnumerable<Fornecedor> GetAll() 
     {
        var lista = new List<Fornecedor>();
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = "SELECT id, nome, email, cnpj, telefone, ativo FROM fornecedor";
        using var cmd = new MySqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read()) 
        {
            lista.Add(new Fornecedor 
            {
                Id = reader.GetInt32("id"),
                Nome = reader.GetString("nome"),
                Email = reader.GetString("email"),
                Cnpj = reader.GetString("cnpj"),
                Telefone = reader.GetInt32("telefone"),
                Ativo = reader.GetBoolean("ativo")
            });
        }
        return lista;
     }
    
    public Fornecedor? GetById(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = "SELECT id, nome, email, cnpj, telefone, ativo FROM fornecedor WHERE id = @Id";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Id",id);
        using var reader = cmd.ExecuteReader();

        if (reader.Read()) 
        {
            return new Fornecedor()
            {
                Id = reader.GetInt32("id"),
                Nome = reader.GetString("nome"),
                Email = reader.GetString("email"),
                Cnpj = reader.GetString("cnpj"),
                Telefone = reader.GetInt32("telefone"),
                Ativo = reader.GetBoolean("ativo")
            };
        }
        return null;
    }

    public void Add(Fornecedor f) 
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();

        string sql = @"INSERT INTO fornecedor (nome, email, cnpj, telefone, ativo) 
                    VALUES (@Nome, @Email, @Cnpj, @Telefone @Ativo);
                    SELECT LAST_INSERT_ID();";

        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Nome",f.Nome);
        cmd.Parameters.AddWithValue("@Email", f.Email);
        cmd.Parameters.AddWithValue("@Cnpj", f.Cnpj);
        cmd.Parameters.AddWithValue("@Telefone", f.Telefone);
        cmd.Parameters.AddWithValue("@Ativo", f.Ativo);
        

        var idGerado = cmd.ExecuteScalar();
        f.Id = Convert.ToInt32(idGerado);
    }

    public void Update(Fornecedor f)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();
        string sql = @"UPDATE fornecedor
                     SET nome = @Nome, email = @Email, cnpj = @Cnpj, telefone = @Telefone, ativo = @Ativo WHERE id = @Id";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Id", f.Id);
        cmd.Parameters.AddWithValue("@Nome", f.Nome);
        cmd.Parameters.AddWithValue("@Email", f.Email);
        cmd.Parameters.AddWithValue("@Cpf", f.Cnpj);
        cmd.Parameters.AddWithValue("@Ativo", f.Ativo);
        cmd.ExecuteNonQuery();
    }

    public void Delete(int id)
    {
        using var conn = new MySqlConnection(_connectionString);
        conn.Open();
        string sql = "UPDATE fornecedor SET ativo = false WHERE id = @Id";
        using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Ativo", false);
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.ExecuteNonQuery();
    }

}