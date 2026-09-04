using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class TipoService : ITipoService
{
    private readonly ITipoRepository _repo;

    public TipoService(ITipoRepository repo)
        => _repo = repo;

    public IEnumerable<Tipo> GetAll()
        => _repo.GetAll();
    

    public Tipo? GetById(int id)
        => _repo.GetById(id);
    
    public Tipo Create(Tipo tipo)
    {
        if (tipo.Id != 0)
            throw new ArgumentException("ID invalido");

        _repo.Add(tipo);
        return tipo;
    }

    public Tipo? Update(int id, Tipo t)
    {
        if (_repo.GetById(id) == null) return null;
        t.Id = id;
        _repo.Update(t);
        return t;
    }

    public bool Delete(int id)
    {
        if(_repo.GetById(id) == null) return false;
            _repo.Delete(id);
        return true;
    }
}