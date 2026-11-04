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
        catch (Exception) { return StatusCode(500, new { message = "Erro interno ao buscar resumo." }); }
    }

    [HttpGet("vendas-por-dia")]
    public IActionResult VendasPorDia([FromQuery] int dias = 30)
    {
        try { return Ok(_service.ObterVendasPorDia(dias)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception) { return StatusCode(500, new { message = "Erro interno ao buscar vendas por dia." }); }
    }

    [HttpGet("top-produtos")]
    public IActionResult TopProdutos([FromQuery] int dias = 30,
                                     [FromQuery] int limite = 5)
    {
        try { return Ok(_service.ObterTopProdutos(dias, limite)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception) { return StatusCode(500, new { message = "Erro interno ao buscar top produtos." }); }
    }

    [HttpGet("ultimas-vendas")]
    public IActionResult UltimasVendas([FromQuery] int dias = 30,
                                       [FromQuery] int limite = 5)
    {
        try { return Ok(_service.ObterUltimasVendas(dias, limite)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception) { return StatusCode(500, new { message = "Erro interno ao buscar últimas vendas." }); }
    }

    [HttpGet("estoque-baixo")]
    public IActionResult EstoqueBaixo([FromQuery] int minimo = 5)
    {
        try { return Ok(_service.ObterEstoqueBaixo(minimo)); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception) { return StatusCode(500, new { message = "Erro interno ao buscar estoque baixo." }); }
    }
}