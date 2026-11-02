namespace MinhaApi.DTO;

public class VendaPedidoResponse
{
    public int IdPedido { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public DateTime Data_Venda { get; set; }
    public List<VendaItemResponse> Itens { get; set; } = [];
    public decimal Total_Venda { get; set; }
}

public class VendaItemResponse
{
    public int IdProduto { get; set; }
    public string NomeProduto { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal Valor_Unitario { get; set; }
    public decimal Total_Venda { get; set; }
}
