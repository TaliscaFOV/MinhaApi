using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;
using MinhaApi.DTO;

[ApiController]
[Route("api/[controller]")]
public class VendaController : ControllerBase
{
    private readonly IVendaService _service;

    public VendaController(IVendaService service)
        => _service = service;

    // POST /api/venda
    [HttpPost]
    public IActionResult Create([FromBody] VendaRequest dto)
    {
        if (dto == null)
            return BadRequest("A venda é obrigatória.");

        try
        {
            var criada = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = criada.Id }, criada);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // GET /api/venda
    [HttpGet]
    public IActionResult GetAll()
    {
        var vendas = _service.GetAll();
        return Ok(vendas);
    }

    // GET /api/venda/{id}
    [HttpGet("id")]
    public IActionResult GetById(int id)
    {
        if (id <= 0)
            return BadRequest("O id deve ser maior que zero.");

        var venda = _service.GetById(id);
        if (venda == null)
            return NotFound();

        return Ok(venda);
    }
}