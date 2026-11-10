namespace MinhaApi.Models;
using System.Text.Json.Serialization;
public class Produtos
{
    public int Id {get; set;}

    public string Nome {get; set;}
        = string.Empty;

    public decimal Preco {get; set;}

    public int Estoque {get; set;}

    public bool Ativo {get; set;}
        = true;
    [JsonIgnore]
    public string? Foto    { get; set; }
    public string? FotoBase64 { get; set; }
}