using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class FornecedorService : IFornecedorService
{
  private readonly IFornecedorRepository _repo;

  public FornecedorService(IFornecedorRepository repo)
      => _repo = repo;

  public IEnumerable<Fornecedor> GetAll()
      => _repo.GetAll();

  public Fornecedor? GetById(int id)
      => _repo.GetById(id);

  public Fornecedor Create(Fornecedor fornecedor)
  {
      if (fornecedor.Email == null && fornecedor.Nome == null && fornecedor.Cnpj == null)
          throw new ArgumentException("Fornecedor inválido");
      _repo.Add(fornecedor);
      return fornecedor;
  }

  public Fornecedor? Update(int id, Fornecedor f)
  {
      if (_repo.GetById(id) == null) return null;
      f.Id = id;
      _repo.Update(f);
      return f;
  }

  public bool Delete(int id)
  {
        if (_repo.GetById(id) == null) return false;
            _repo.Delete(id);
        return true;
  }
}