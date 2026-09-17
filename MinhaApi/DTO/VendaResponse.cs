namespace MinhaApi.DTO;

public class VendaResponse()
{
    public int Id {get; set;}

    public string NomeCliente {get; set;}

    public string NomeProduto {get; set;}

    public int Quantidade {get; set;}
    public DateTime Data_Venda {get; set;}
    public decimal Valor_Unitario {get; set;}
    public decimal Total_Venda {get; set;}

}