using MinhaApi.DTO;
using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IVendaService
{
    VendaResponse  Create(VendaRequest dto);
    IEnumerable<VendaResponse> GetAll();
    VendaResponse? GetById(int id);
}