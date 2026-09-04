using MinhaApi.Models;

namespace MinhaApi.Repositories;

public interface ITipoRepository
{
    IEnumerable<Tipo> GetAll();
    Tipo? GetById(int id);
    void Add(Tipo tipo);
    void Update(Tipo tipo);
    void Delete(int id); 
}