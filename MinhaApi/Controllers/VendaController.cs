using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;


[ApiController]
[Route("api/[controller]")]
public class VendaController : ControllerBase
{
    private readonly IVendaService _service;

    public VendaController(IVendaService service)
    => _service = service;

    //GET /api/venda
    [HttpGet]
    public IActionResult GetAll()
    {
        var vendas = _service.GetAll();
        return Ok(vendas);
    }

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
}