using System.Reflection.Metadata.Ecma335;
using MinhaApi.DTO;
using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class VendaService : IVendaService
{
    private readonly IVendaRepository _repo;
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
    }
}