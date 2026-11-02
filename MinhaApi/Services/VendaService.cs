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

    public VendaPedidoResponse CreatePedido(VendaPedidoRequest dto)
    {
        var cliente = _repoCliente.GetById(dto.IdCliente)
            ?? throw new ArgumentException("Cliente não encontrado com o ID informado.");

        var idsProdutos = new HashSet<int>();
        var itens = dto.Itens.Select(item =>
        {
            if (!idsProdutos.Add(item.IdProduto))
                throw new ArgumentException("Adicione cada produto apenas uma vez e ajuste a quantidade no item.");

            var produto = _repoProduto.GetById(item.IdProduto)
                ?? throw new ArgumentException($"Produto {item.IdProduto} não encontrado.");
            if (!produto.Ativo)
                throw new ArgumentException($"O produto '{produto.Nome}' está inativo.");

            return new Venda
            {
                IdProduto = item.IdProduto,
                Quantidade = item.Quantidade
            };
        }).ToList();

        var dataVenda = DateTime.Now;
        var idPedido = _repo.AddPedido(dto.IdCliente, dataVenda, itens);

        return MapearPedido(idPedido, dataVenda, cliente.Nome, itens);
    }

    public IEnumerable<VendaPedidoResponse> GetPedidos()
    {
        var vendas = _repo.GetAll().ToList();
        var pedidos = vendas
            .Where(v => v.IdPedido.HasValue)
            .GroupBy(v => v.IdPedido!.Value)
            .Select(grupo =>
            {
                var primeiraVenda = grupo.First();
                var cliente = _repoCliente.GetById(primeiraVenda.IdCliente);
                var itens = grupo.ToList();
                return MapearPedido(
                    grupo.Key,
                    primeiraVenda.DataVenda,
                    cliente?.Nome ?? "Cliente não encontrado",
                    itens);
            });

        var vendasAntigas = vendas
            .Where(v => !v.IdPedido.HasValue)
            .Select(v =>
            {
                var cliente = _repoCliente.GetById(v.IdCliente);
                return MapearPedido(
                    -v.IdVenda,
                    v.DataVenda,
                    cliente?.Nome ?? "Cliente não encontrado",
                    [v]);
            });

        return pedidos.Concat(vendasAntigas).OrderByDescending(p => p.Data_Venda);
    }

    private VendaPedidoResponse MapearPedido(
        int idPedido,
        DateTime dataVenda,
        string nomeCliente,
        IReadOnlyList<Venda> vendas)
    {
        var itens = vendas.Select(v =>
        {
            var produto = _repoProduto.GetById(v.IdProduto);
            return new VendaItemResponse
            {
                IdProduto = v.IdProduto,
                NomeProduto = produto?.Nome ?? "Produto não encontrado",
                Quantidade = v.Quantidade,
                Valor_Unitario = v.PrecoUnitario,
                Total_Venda = v.PrecoTotal
            };
        }).ToList();

        return new VendaPedidoResponse
        {
            IdPedido = idPedido,
            NomeCliente = nomeCliente,
            Data_Venda = dataVenda,
            Itens = itens,
            Total_Venda = itens.Sum(item => item.Total_Venda)
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