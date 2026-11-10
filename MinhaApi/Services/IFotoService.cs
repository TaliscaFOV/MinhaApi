public interface IFotoService
{
    Task<string> SalvarAsync(IFormFile arquivo); // retorna nome
    void    Deletar(string? nomeArquivo);
    string? LerBase64(string? nomeArquivo);       // ✨ novo
}