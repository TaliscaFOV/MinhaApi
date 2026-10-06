using System.ComponentModel.DataAnnotations;

namespace MinhaApi.DTO;

public class VendaRequest
{
    [Required]
    public int IdProduto { get; set; }

    [Required]
    public int IdCliente { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
    public int Quantidade { get; set; }
}