using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class ProdutoService : IProdutoService
{
  private readonly IProdutoRepository _repo;

  public ProdutoService(IProdutoRepository repo)
      => _repo = repo;

  public IEnumerable<Produto> GetAll()
      => _repo.GetAll();

  public Produto? GetById(int id)
      => _repo.GetById(id);

  public Produto Create(Produto produto)
  {
      if (produto.Preco < 0)
          throw new ArgumentException("Preço inválido");
      _repo.Add(produto);
      return produto;
  }

  public Produto? Update(int id, Produto p)
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