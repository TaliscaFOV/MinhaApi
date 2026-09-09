using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class ClienteService : IClienteService
{
  private readonly IClienteRepository _repo;

  public ClienteService(IClienteRepository repo)
      => _repo = repo;

  public IEnumerable<Cliente> GetAll()
      => _repo.GetAll();

  public Cliente? GetById(int id)
      => _repo.GetById(id);

  public Cliente Create(Cliente cliente)
  {
      if (cliente.Nome == null || cliente.Nome == "")
          throw new ArgumentException("Nome inválido");
      _repo.Add(cliente);
      return cliente;
  }

  public Cliente? Update(int id, Cliente c)
  {
      if (_repo.GetById(id) == null) return null;
      c.Id = id;
      _repo.Update(c);
      return c;
  }

  public bool Delete(int id)
  {
        if (_repo.GetById(id) == null) return false;
            _repo.Delete(id);
        return true;
  }
}