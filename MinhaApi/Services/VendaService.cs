using MinhaApi.DTO;
using MinhaApi.Models;
using MinhaApi.Repositories;

namespace MinhaApi.Services;

public class VendaService : IVendaService
{
    private readonly IVendaRepository _repo;
    private readonly IProdutosRepository _repoProduto;
    private readonly IClienteRepository _repoCliente;

    public VendaService(
        IVendaRepository repo,
        IProdutosRepository repoProduto,
        IClienteRepository repoCliente)
    {
        _repo = repo;
        _repoProduto = repoProduto;
        _repoCliente = repoCliente;
    }

    public VendaResponse Create(VendaRequest dto)
    {
        var cliente = _repoCliente.GetById(dto.IdCliente)
            ?? throw new ArgumentException("Cliente não encontrado com o ID informado.");

        var produto = _repoProduto.GetById(dto.IdProduto)
            ?? throw new ArgumentException("Produto não encontrado com o ID informado.");

        var venda = new Venda
        {
            IdCliente = dto.IdCliente,
            IdProduto = dto.IdProduto,
            Quantidade = dto.Quantidade,
            DataVenda = DateTime.Now
        };

        // O repositório valida o estoque, baixa o estoque e calcula os preços, tudo numa transação
        _repo.Add(venda);

        return new VendaResponse
        {
            Id = venda.IdVenda,
            NomeCliente = cliente.Nome,
            NomeProduto = produto.Nome,
            Quantidade = venda.Quantidade,
            Valor_Unitario = venda.PrecoUnitario,
            Total_Venda = venda.PrecoTotal,
            Data_Venda = venda.DataVenda
        };
    }

    public IEnumerable<VendaResponse> GetAll()
        => _repo.GetAll().Select(MapearParaDTO);

    public VendaResponse? GetById(int id)
    {
        var venda = _repo.GetById(id);
        return venda == null ? null : MapearParaDTO(venda);
    }

    private VendaResponse MapearParaDTO(Venda venda)
    {
        var cliente = _repoCliente.GetById(venda.IdCliente);
        var produto = _repoProduto.GetById(venda.IdProduto);

        return new VendaResponse
        {
            Id = venda.IdVenda,
            NomeCliente = cliente?.Nome ?? "Cliente não encontrado",
            NomeProduto = produto?.Nome ?? "Produto não encontrado",
            Quantidade = venda.Quantidade,
            Valor_Unitario = venda.PrecoUnitario,
            Total_Venda = venda.PrecoTotal,
            Data_Venda = venda.DataVenda
        };
    }
}