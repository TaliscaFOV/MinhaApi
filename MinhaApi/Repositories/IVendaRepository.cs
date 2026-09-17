using MinhaApi.Models;

namespace MinhaApi.Repositories;

public interface IVendaRepository
{
    void Add (Venda venda);
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
}