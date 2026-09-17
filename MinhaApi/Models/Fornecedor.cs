namespace MinhaApi.Models;
public class Fornecedor
{
    public int Id {get; set;}

    public string Nome {get; set;}
        = string.Empty;

    public string Email {get; set;}
        = string.Empty;

    public string Cnpj {get; set;}
        = string.Empty;
    
    public int Telefone {get; set;}

    public bool Ativo {get; set;}
        = true;

}