using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;
<<<<<<< HEAD
using MinhaApi.DTO;
=======

>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16

[ApiController]
[Route("api/[controller]")]
public class VendaController : ControllerBase
{
    private readonly IVendaService _service;

    public VendaController(IVendaService service)
<<<<<<< HEAD
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
=======
    => _service = service;

    //GET /api/venda
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16
    [HttpGet]
    public IActionResult GetAll()
    {
        var vendas = _service.GetAll();
        return Ok(vendas);
    }

<<<<<<< HEAD
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
=======
    // GET /api/venda/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var venda = _service.GetById(id);
        if (venda == null)
            return NotFound();
        return Ok(venda);
    }

    // POST /api/venda
    [HttpPost]
    public IActionResult Create([FromBody] Venda venda)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var criada = _service.Create(venda);

            return CreatedAtAction(
                nameof(GetById),
                new { id = criada.IdVenda },
                criada);
        }
        catch (Exception ex)
        {
            // cliente não encontrado, estoque insuficiente etc.
            return BadRequest(new { erro = ex.Message });
        }
    }
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16
}