namespace MinhaApi.DTO;

public class VendaRequest()
{
    public int Id_Produto {get; set;}
    public int Id_Cliente {get; set;}
    public int Quantidade {get; set;}
    public decimal Preco { get; internal set; }
}