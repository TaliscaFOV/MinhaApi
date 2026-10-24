using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _repo;
    private readonly IConfiguration _config;

    public AuthService(IUsuarioRepository repo, IConfiguration config)
    {
        _repo = repo;
        _config = config;
    }

    public LoginResponse Login(LoginRequest req)
    {
        // 1. Busca o usuário ativo pelo e-mail
        var usuario = _repo.BuscarPorEmail(req.Email)
            ?? throw new UnauthorizedAccessException("Credenciais inválidas.");

        // 2. Compara a senha digitada com o hash do banco
        bool senhaOk = BCrypt.Net.BCrypt.Verify(req.Senha, usuario.SenhaHash);
        if (!senhaOk)
            throw new UnauthorizedAccessException("Credenciais inválidas.");

        // 3. Gera o token e monta a resposta
        return new LoginResponse
        {
            Token = GerarToken(usuario),
            Nome  = usuario.Nome,
            Email = usuario.Email
        };
    }
       private string GerarToken(Usuario u)
    {
        // 1. Chave secreta em bytes
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        // 2. Algoritmo da assinatura: HMAC-SHA256
        var creds = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha256);

        // 3. Claims: o que vai no Payload
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, u.Id.ToString()),
            new Claim(ClaimTypes.Name,  u.Nome),
            new Claim(ClaimTypes.Email, u.Email)
        };

        // 4. Expiração lida do appsettings
        var expira = DateTime.UtcNow.AddMinutes(
            double.Parse(_config["Jwt:ExpiresInMinutes"]!));

        // 5. Monta o token
        var token = new JwtSecurityToken(
            issuer:   _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims:   claims,
            expires:  expira,
            signingCredentials: creds);

        // 6. Converte para a string "xxx.yyy.zzz"
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
} 