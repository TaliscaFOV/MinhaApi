namespace MinhaApi.Models;
public class Produtos
{
    public int Id {get; set;}

    public string Nome {get; set;}
        = string.Empty;

    public decimal Preco {get; set;}

    public int Estoque {get; set;}

    public bool Ativo {get; set;}
        = true;

}