using System.ComponentModel.DataAnnotations;
namespace MinhaApi.Models;
public class Cliente
{
    public int Id {get; set;}
[Required(ErrorMessage = "O nome é obrigatório")]
[MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
[Required(ErrorMessage = "O email é obrigatório")]
[EmailAddress(ErrorMessage = "O email é inválido")]
[MaxLength(150)]
    public string Email {get; set;}
        = string.Empty;
[Required(ErrorMessage = "O CPF é obrigatório")]
[RegularExpression(@"^\d{11}$", ErrorMessage = "O CPF deve conter 11 dígitos numéricos")]
[MaxLength(11)]
    public string Cpf {get; set;}
        = string.Empty;

    public bool Ativo {get; set;}
        = true;

}