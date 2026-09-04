using MinhaApi.Models;

namespace MinhaApi.Services;

public interface ITipoService
{
    IEnumerable<Tipo> GetAll();
    Tipo? GetById(int id);
    Tipo  Create(Tipo tipo);
    Tipo? Update(int id, Tipo tipo);
    bool     Delete(int id);
}