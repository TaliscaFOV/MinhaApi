using MinhaApi.Models;

namespace MinhaApi.Repositories;

public interface IProdutosRepository
{
    IEnumerable<Produtos> GetAll();
    Produtos? GetById(int id);
    void Add(Produtos produto);
    void Update(Produtos produto);
    void Delete(int id);

    void AtualizarEstoque(int id, int quantidade);
}