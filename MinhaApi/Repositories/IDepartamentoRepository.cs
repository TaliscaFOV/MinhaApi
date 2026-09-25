using MinhaApi.Models;

namespace MinhaApi.Repositories;

public interface IDepartamentoRepository
{
    IEnumerable<Departamento> GetAll();
    Departamento? GetById(int id);
    void Add(Departamento departamento);
    void Update(Departamento departamento);
    void Delete(int id);
}