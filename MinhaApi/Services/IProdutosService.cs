using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IProdutosService
{
    IEnumerable<Produtos> GetAll();
    Produtos? GetById(int id);
    Produtos  Create(Produtos produto);
    Produtos? Update(int id, Produtos produto);
    bool     Delete(int id);
}