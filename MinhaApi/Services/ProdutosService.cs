using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class ProdutosService : IProdutosService
{
  private readonly IProdutosRepository _repo;

  public ProdutosService(IProdutosRepository repo)
      => _repo = repo;

  public IEnumerable<Produtos> GetAll()
      => _repo.GetAll();

  public Produtos? GetById(int id)
      => _repo.GetById(id);

  public Produtos Create(Produtos produto)
  {
      if (produto.Preco < 0)
          throw new ArgumentException("Preço inválido");
      _repo.Add(produto);
      return produto;
  }

  public Produtos? Update(int id, Produtos p)
  {
      if (_repo.GetById(id) == null) return null;
      p.Id = id;
      _repo.Update(p);
      return p;
  }

  public bool Delete(int id)
  {
        if (_repo.GetById(id) == null) return false;
            _repo.Delete(id);
        return true;
  }
}