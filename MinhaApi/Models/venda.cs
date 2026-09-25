using System.ComponentModel.DataAnnotations;

namespace MinhaApi.Models;

public class Venda
{
    public int IdVenda { get; set; }

<<<<<<< HEAD
    public int Quantidade { get; set; }

    public DateTime DataVenda { get; set; };
=======
    [Required(ErrorMessage = "A quantidade é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero")]
    public int Quantidade { get; set; }

    public DateTime DataVenda { get; set; } = DateTime.Now;
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16

    public decimal PrecoUnitario { get; set; }

    public decimal PrecoTotal { get; set; }

<<<<<<< HEAD

    public int IdCliente { get; set; }

  
    public int IdProduto { get; set; }
  
=======
    [Required(ErrorMessage = "O cliente é obrigatório")]
    public int IdCliente { get; set; }
    public Cliente? Cliente { get; set; }

    [Required(ErrorMessage = "O produto é obrigatório")]
    public int IdProduto { get; set; }
    public Produto? Produto { get; set; }
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16
}