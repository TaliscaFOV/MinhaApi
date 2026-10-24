using MySqlConnector;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly string _cs;

    public UsuarioRepository(IConfiguration config)
        => _cs = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

    public Usuario? BuscarPorEmail(string email)
    {
        using var conn = new MySqlConnection(_cs);
        conn.Open();

        using var cmd = new MySqlCommand(
            "SELECT * FROM usuarios WHERE email = @Email AND ativo = 1",
            conn);
        cmd.Parameters.AddWithValue("@Email", email);

        using var r = cmd.ExecuteReader();
        if (!r.Read()) return null;

        return new Usuario
        {
            Id        = r.GetInt32("id"),
            Nome      = r.GetString("nome"),
            Email     = r.GetString("email"),
            SenhaHash = r.GetString("senha_hash"),
            Ativo     = r.GetBoolean("ativo")
        };
    }
}