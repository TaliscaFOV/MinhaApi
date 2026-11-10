using MinhaApi.Models;
using MinhaApi.Repositories;
using MinhaApi.Services;

public class ProdutosService : IProdutosService
{
  private readonly IProdutosRepository _repo;
  private readonly IFotoService _fotoService;
  public ProdutosService(IProdutosRepository repo,
        IFotoService fotoService){
        _repo        = repo;
        _fotoService = fotoService;
    }
      

  public IEnumerable<Produtos> GetAll()
      => _repo.GetAll();

  public Produtos? GetById(int id)
      => _repo.GetById(id);

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
      // No método ObterTodos() existente, ADICIONAR ao final:
    public List<Produtos> ObterTodos()
    {
        var produtos = _repo.GetAll();

        // ✨ Para cada produto, calcular o base64 da foto
        foreach (var p in produtos)
            p.FotoBase64 = _fotoService.LerBase64(p.Foto);

        return produtos.ToList();
    }

    // No método ObterPorId() existente, ADICIONAR antes do return:
    public Produtos? ObterPorId(int id)
    {
        var produto = _repo.GetById(id);
        if (produto is null) return null;

        // ✨ Enriquecer com base64 antes de retornar
        produto.FotoBase64 = _fotoService.LerBase64(produto.Foto);
        return produto;
    }
    public async Task<string> SalvarFoto(int id, IFormFile arquivo)
    {
        var produto = _repo.GetById(id)
            ?? throw new KeyNotFoundException(
                   "Produto não encontrado.");

        // Se já tem foto, apaga a antiga do disco
        if (!string.IsNullOrEmpty(produto.Foto))
            _fotoService.Deletar(produto.Foto);

        var nome = await _fotoService.SalvarAsync(arquivo);
        _repo.AtualizarFoto(id, nome);

        // Retorna a data URL — controller manda direto ao React
        return _fotoService.LerBase64(nome)!;
    }

    public void RemoverFoto(int id)
    {
        var produto = _repo.GetById(id)
            ?? throw new KeyNotFoundException(
                   "Produto não encontrado.");

        if (string.IsNullOrEmpty(produto.Foto)) return;

        _fotoService.Deletar(produto.Foto);
        _repo.AtualizarFoto(id, null);
    }
}