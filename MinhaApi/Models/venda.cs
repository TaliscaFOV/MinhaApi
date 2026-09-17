using System.ComponentModel.DataAnnotations;

namespace MinhaApi.Models;

public class Venda
{
    public int IdVenda { get; set; }

    public int Quantidade { get; set; }

    public DateTime DataVenda { get; set; };

    public decimal PrecoUnitario { get; set; }

    public decimal PrecoTotal { get; set; }


    public int IdCliente { get; set; }

  
    public int IdProduto { get; set; }
  
}