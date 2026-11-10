public class FotoService : IFotoService
{
    private readonly string _pasta;
    private static readonly string[] _extensoes =
        { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private const long _tamanhoMax = 5 * 1024 * 1024; // 5 MB

    public FotoService(IWebHostEnvironment env)
    {
        _pasta = Path.Combine(
            env.ContentRootPath, "uploads", "produtos");
        Directory.CreateDirectory(_pasta);
    }

    public async Task<string> SalvarAsync(IFormFile arquivo)
    {
        var ext = Path.GetExtension(arquivo.FileName).ToLower();

        if (!_extensoes.Contains(ext))
            throw new ArgumentException(
                "Formato inválido. Use JPG, PNG, GIF ou WEBP.");
        if (arquivo.Length > _tamanhoMax)
            throw new ArgumentException("Máximo: 5 MB.");

        var nome = $"{Guid.NewGuid()}{ext}";

        using var stream = new FileStream(
            Path.Combine(_pasta, nome), FileMode.Create);
        await arquivo.CopyToAsync(stream);

        return nome; // ex: "a3f9b2c1.jpg"
    }

    public void Deletar(string? nomeArquivo)
    {
        if (string.IsNullOrWhiteSpace(nomeArquivo)) return;
        var caminho = Path.Combine(_pasta, nomeArquivo);
        if (File.Exists(caminho)) File.Delete(caminho);
    }
        public string? LerBase64(string? nomeArquivo)
    {
        if (string.IsNullOrWhiteSpace(nomeArquivo)) return null;

        var caminho = Path.Combine(_pasta, nomeArquivo);
        if (!File.Exists(caminho)) return null;

        var bytes = File.ReadAllBytes(caminho);

        var ext = Path.GetExtension(nomeArquivo)
                      .TrimStart('.').ToLower();

        var mime = ext switch {
            "jpg" or "jpeg" => "image/jpeg",
            "png"           => "image/png",
            "gif"           => "image/gif",
            "webp"          => "image/webp",
            _               => "image/jpeg"
        };

        // Retorna a data URL completa — pronta para o <img src>
        return $"data:{mime};base64," +
               Convert.ToBase64String(bytes);
    }
} // fim de FotoService