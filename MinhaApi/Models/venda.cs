using System.ComponentModel.DataAnnotations;

namespace MinhaApi.Models;

public class Venda
{
    public int IdVenda { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
    public int Quantidade { get; set; }

    public DateTime DataVenda { get; set; } = DateTime.Now;

    public decimal PrecoUnitario { get; set; }

    public decimal PrecoTotal { get; set; }

    [Required]
    public int IdCliente { get; set; }

    [Required]
    public int IdProduto { get; set; }
}