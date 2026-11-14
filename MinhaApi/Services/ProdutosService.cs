using Microsoft.AspNetCore.Http;
using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class ProdutosService : IProdutosService
{
    private readonly IProdutosRepository _repo;
    private readonly IFotoService _fotoService;

    public ProdutosService(IProdutosRepository repo, IFotoService fotoService)
    {
        _repo = repo;
        _fotoService = fotoService;
    }

    public IEnumerable<Produtos> GetAll()
        => _repo.GetAll().Select(AdicionarFotoBase64);

    public Produtos? GetById(int id)
    {
        var produto = _repo.GetById(id);
        return produto == null ? null : AdicionarFotoBase64(produto);
    }

    private Produtos AdicionarFotoBase64(Produtos produto)
    {
        produto.FotoBase64 = _fotoService.LerBase64(produto.Foto);
        return produto;
    }

    public Produtos Create(Produtos produto)
    {
        if (produto.Preco < 0)
            throw new ArgumentException("Preço inválido");

        _repo.Add(produto);
        return produto;
    }

    public Produtos? Update(int id, Produtos p)
    {
        if (_repo.GetById(id) == null) return null;

        p.Id = id;
        _repo.Update(p);
        return p;
    }

    public bool Delete(int id)
    {
        if (_repo.GetById(id) == null) return false;

        _repo.Delete(id);
        return true;
    }

    public async Task<string> SalvarFoto(int id, IFormFile arquivo)
    {
        var produto = _repo.GetById(id)
            ?? throw new KeyNotFoundException("Produto não encontrado.");

        if (!string.IsNullOrEmpty(produto.Foto))
            _fotoService.Deletar(produto.Foto);

        var nome = await _fotoService.SalvarAsync(arquivo);
        _repo.AtualizarFoto(id, nome);

        return _fotoService.LerBase64(nome)!;
    }

    public void RemoverFoto(int id)
    {
        var produto = _repo.GetById(id)
            ?? throw new KeyNotFoundException("Produto não encontrado.");

        if (string.IsNullOrEmpty(produto.Foto)) return;

        _fotoService.Deletar(produto.Foto);
        _repo.AtualizarFoto(id, null);
    }
}