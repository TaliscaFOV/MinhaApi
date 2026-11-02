using System.ComponentModel.DataAnnotations;

namespace MinhaApi.DTO;

public class VendaPedidoRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Selecione um cliente.")]
    public int IdCliente { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Adicione pelo menos um produto à venda.")]
    public List<VendaItemRequest> Itens { get; set; } = [];
}

public class VendaItemRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Selecione um produto válido.")]
    public int IdProduto { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
    public int Quantidade { get; set; }
}
