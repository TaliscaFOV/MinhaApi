using System.ComponentModel.DataAnnotations;

namespace MinhaApi.Models;

public class Venda
{
    public int IdVenda { get; set; }

    [Required(ErrorMessage = "A quantidade é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero")]
    public int Quantidade { get; set; }

    public DateTime DataVenda { get; set; } = DateTime.Now;

    public decimal PrecoUnitario { get; set; }

    public decimal PrecoTotal { get; set; }

    [Required(ErrorMessage = "O cliente é obrigatório")]
    public int IdCliente { get; set; }
    public Cliente? Cliente { get; set; }

    [Required(ErrorMessage = "O produto é obrigatório")]
    public int IdProduto { get; set; }
    public Produto? Produto { get; set; }
}