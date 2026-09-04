using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;


[ApiController]
[Route("api/[Controller]")]

public class TipoController : ControllerBase
{
    private readonly ITipoService _service;

    public TipoController (ITipoService service)
        => _service = service;

    // GET /api/tipo
    [HttpGet]
    public IActionResult GetAll()
    {
        var tipos = _service.GetAll();
            return Ok(tipos);
    }

    // GET /api/tipo/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var tipo = _service.GetById(id);

        if (tipo == null)
            return NotFound();
        return Ok(tipo);
    }

    // POST /api/tipo
    [HttpPost]
    public IActionResult Create([FromBody] Tipo tipo)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var criado = _service.Create(tipo);

        return CreatedAtAction(nameof(GetById), new { id = criado.Id }, criado);
    }

    // PUT /api/tipo/1
    [HttpPut("{id}")]
    public IActionResult Update (

        int id,
        [FromBody] Tipo tipo)
    {
        var atualizado = _service.Update(id, tipo);

        if (atualizado == null)
            return NotFound();

        return Ok(atualizado);
    }

    // DELETE /api/tipo/1
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deletado = _service.Delete(id);

        if (!deletado)
            return NotFound();

        return NoContent();
    }

}