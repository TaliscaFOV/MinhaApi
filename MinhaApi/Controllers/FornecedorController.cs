using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;


[ApiController]
[Route("api/[controller]")]
public class FornecedorController : ControllerBase
{
    private readonly IFornecedorService _service;

    public FornecedorController(IFornecedorService service)
    => _service = service;

    //GET / api/produto
    [HttpGet]
    public IActionResult GetAll()
    {
        var fornecedor = _service.GetAll();
        return Ok(fornecedor);
    }

// GET /api/produto/1
    [HttpGet("id")]
    public IActionResult GetById(int id)
    {
        var fornecedor = _service.GetById(id);
        if (fornecedor == null)
            return NotFound();
        return Ok(fornecedor);
    }

// POST /api/produto
    [HttpPost]
    public IActionResult Create([FromBody] Fornecedor fornecedor)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var criado = _service.Create(fornecedor);

        return CreatedAtAction(
            nameof(GetById),
            new { id = fornecedor.Id },
            criado);
    }
// PUT /api/produto/1
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Fornecedor fornecedor)
    {
        var atualizado = _service.Update(id, fornecedor);

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
}