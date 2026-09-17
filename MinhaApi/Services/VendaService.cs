using MinhaApi.Models;
using MinhaApi.Repositories;

namespace MinhaApi.Services;

public class VendaService : IVendaService
{
    private readonly IVendaRepository _repo;
    private readonly IClienteRepository _clienteRepo;

    public VendaService(IVendaRepository repo, IClienteRepository clienteRepo)
    {
        _repo = repo;
        _clienteRepo = clienteRepo;
    }

    public IEnumerable<Venda> GetAll()
        => _repo.GetAll();

    public Venda? GetById(int id)
        => _repo.GetById(id);

    public Venda Create(Venda venda)
    {
        // Valida se o cliente existe antes de registrar a venda
        if (_clienteRepo.GetById(venda.IdCliente) == null)
            throw new Exception("Cliente não encontrado");

        // O repository valida produto, estoque, baixa estoque e calcula os preços
        _repo.Add(venda);
        return venda;
    }
}