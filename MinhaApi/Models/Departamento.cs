using System.ComponentModel.DataAnnotations;
namespace MinhaApi.Models;

public class Departamento{
    
    public int Id {get; set;}

    public string Nome {get; set;}
        = string.Empty;
        
    public string Descricao {get; set;}

    public bool Ativo {get; set;}
        = true;

}