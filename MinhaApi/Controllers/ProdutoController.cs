using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProdutoController : ControllerBase
{
    private readonly IProdutosService _service;

    public ProdutoController(IProdutosService service)
    => _service = service;

    //GET / api/produto
    [HttpGet]
    public IActionResult GetAll()
    {
        var produtos = _service.GetAll();
        return Ok(produtos);
    }

// GET /api/produto/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var produto = _service.GetById(id);
        if (produto == null)
            return NotFound();
        return Ok(produto);
    }

// POST /api/produto
    [HttpPost]
    public IActionResult Create([FromBody] Produtos produto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var criado = _service.Create(produto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = criado.Id },
            criado);
    }
// PUT /api/produto/1
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Produtos produto)
    {
        var atualizado = _service.Update(id, produto);

        if (atualizado == null)
            return NotFound();

        return Ok(atualizado);
    }

// DELETE /api/produto/1
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deletado = _service.Delete(id);

        if (!deletado)
            return NotFound();

        return NoContent();
    }
    [HttpPost("{id}/foto")]
public async Task<IActionResult> UploadFoto(
    int id, IFormFile arquivo)
{
    if (arquivo == null || arquivo.Length == 0)
        return BadRequest(new { message = "Nenhum arquivo enviado." });

    try
    {
        var fotoBase64 = await _service.SalvarFoto(id, arquivo);
        // Retorna a data URL pronta para o React usar no <img src>
        return Ok(new { fotoBase64 });
    }
    catch (KeyNotFoundException ex)
        { return NotFound(new { message = ex.Message }); }
    catch (ArgumentException ex)
        { return BadRequest(new { message = ex.Message }); }
}

[HttpDelete("{id}/foto")]
public IActionResult RemoverFoto(int id)
{
    try
    {
        _service.RemoverFoto(id);
        return NoContent(); // 204 — sem corpo
    }
    catch (KeyNotFoundException ex)
        { return NotFound(new { message = ex.Message }); }
}
}