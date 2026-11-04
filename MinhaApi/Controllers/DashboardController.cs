using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]   // 🔒 só usuários logados (aula de JWT)
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    public DashboardController(IDashboardService service) => _service = service;

    [HttpGet("resumo")]
    public IActionResult Resumo([FromQuery] int dias = 30)
    {
        try { return Ok(_service.ObterResumo(dias)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("vendas-por-dia")]
    public IActionResult VendasPorDia([FromQuery] int dias = 30)
    {
        try { return Ok(_service.ObterVendasPorDia(dias)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("top-produtos")]
    public IActionResult TopProdutos([FromQuery] int dias = 30,
                                     [FromQuery] int limite = 5)
    {
        try { return Ok(_service.ObterTopProdutos(dias, limite)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("ultimas-vendas")]
    public IActionResult UltimasVendas([FromQuery] int limite = 5)
    {
        try { return Ok(_service.ObterUltimasVendas(limite)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("estoque-baixo")]
    public IActionResult EstoqueBaixo([FromQuery] int minimo = 5)
    {
        try { return Ok(_service.ObterEstoqueBaixo(minimo)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }
}