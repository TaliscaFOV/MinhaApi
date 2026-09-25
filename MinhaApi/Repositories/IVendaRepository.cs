using MinhaApi.Models;

namespace MinhaApi.Repositories;

public interface IVendaRepository
{
<<<<<<< HEAD
    void Add (Venda venda);
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
=======
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
    void Add(Venda venda);
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16
}