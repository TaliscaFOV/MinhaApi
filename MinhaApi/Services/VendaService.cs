<<<<<<< HEAD
using System.Reflection.Metadata.Ecma335;
using MinhaApi.DTO;
using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;
=======
using MinhaApi.Models;
using MinhaApi.Repositories;

namespace MinhaApi.Services;
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16

public class VendaService : IVendaService
{
    private readonly IVendaRepository _repo;
<<<<<<< HEAD
    private readonly IProdutoRepository _repoProduto;
    private readonly IClienteRepository _repoCliente;

    public VendaService(IVendaRepository repo, IProdutoRepository repoProduto, IClienteRepository repoCliente)
    {
        _repo = repo;
        _repoProduto = repoProduto;
        _repoCliente = repoCliente;
    } 

    public VendaResponse Create(VendaRequest dto)
    {
        var produto = _repoProduto.GetById(dto.Id_Produto);
        var cliente = _repoCliente.GetById(dto.Id_Cliente);

        if(cliente == null)
        {
            throw new ArgumentException("Cliente não encontrado com o ID informado.");
        }

        if(produto == null)
        {
            throw new ArgumentException("Produto não encontrado com o ID informado.");
        }

        if (produto.Estoque < dto.Quantidade)
        {
            throw new ArgumentException("Estoque insuficiente");
        }

        var venda = new Venda
        {
            Id_Cliente = dto.Id_Cliente,
            Id_Produto = dto.Id_Produto,
            Quantidade = dto.Quantidade,
            Valor_Unitario = dto.Preco,
            Total_Venda = produto.Preco * dto.Quantidade,
            Data_Venda = DateTime.Now
        };

        _repoProduto.AtualizarEstoque(produto.Id, venda.Quantidade);
        _repo.Add(venda);

        return new VendaResponse
        {
            Id = venda.Id,
            NomeCliente = cliente.Nome,
            NomeProduto = produto.Nome,
            Quantidade = venda.Quantidade,
            Valor_Unitario = venda.Valor_Unitario,
            Total_Venda = venda.Total_Venda,
            Data_Venda = venda.Data_Venda
        };
    }

    public IEnumerable<VendaResponse> GetAll()
        => _repo.GetAll().Select(MapearParaDTO);

    public VendaResponse? GetById(int id)
    {
        var venda = _repo.GetById(id);
        if (venda == null)
            return null;

        return MapearParaDTO(venda);
    }

    private VendaResponse MapearParaDTO(Venda venda)
    {
        var cliente = _repoCliente.GetById(venda.Id_Cliente);
        var produto = _repoProduto.GetById(venda.Id_Produto);
    

        return new VendaResponse
        {
            Id = venda.Id,
            NomeCliente = cliente?.Nome ?? "Cliente não encontrado",
            NomeProduto = produto?.Nome ?? "Produto não encontrado",
            Quantidade = venda.Quantidade,
            Valor_Unitario = venda.Valor_Unitario,
            Total_Venda = venda.Total_Venda,
            Data_Venda = venda.Data_Venda
        };
=======
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
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16
    }
}