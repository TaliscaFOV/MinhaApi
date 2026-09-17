using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IVendaService
{
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
    Venda Create(Venda venda);
}