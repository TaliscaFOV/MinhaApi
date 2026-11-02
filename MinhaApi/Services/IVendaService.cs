using MinhaApi.DTO;

namespace MinhaApi.Services;

public interface IVendaService
{
    VendaResponse Create(VendaRequest dto);
    VendaPedidoResponse CreatePedido(VendaPedidoRequest dto);
    IEnumerable<VendaPedidoResponse> GetPedidos();
    IEnumerable<VendaResponse> GetAll();
    VendaResponse? GetById(int id);
}