<<<<<<< HEAD
using MinhaApi.DTO;
=======
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16
using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IVendaService
{
<<<<<<< HEAD
    VendaResponse  Create(VendaRequest dto);
    IEnumerable<VendaResponse> GetAll();
    VendaResponse? GetById(int id);
=======
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
    Venda Create(Venda venda);
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16
}