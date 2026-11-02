using MinhaApi.Models;

namespace MinhaApi.Repositories;

public interface IVendaRepository
{
    void Add(Venda venda);
    int AddPedido(int idCliente, DateTime dataVenda, IReadOnlyList<Venda> itens);
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
}