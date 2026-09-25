using MinhaApi.Repositories;
using MinhaApi.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddScoped<
    IProdutoRepository,
    ProdutoRepository>();

builder.Services.AddScoped<
    IProdutoService,
    ProdutoService>();

builder.Services.AddScoped<
    ITipoService,
    TipoService>();

builder.Services.AddScoped<
    IClienteService,
    ClienteService>();

builder.Services.AddScoped<
    IClienteRepository,
    ClienteRepository>();

builder.Services.AddScoped<
    IVendaRepository,
    VendaRepository>();
    
builder.Services.AddScoped<
<<<<<<< HEAD
    IVendaService,
    VendaService>();

builder.Services.AddScoped<
    IFornecedorService,
    FornecedorService>();

builder.Services.AddScoped<
    IFornecedorRepository,
    FornecedorRepository>();

=======
    IVendaRepository,
    VendaRepository>();
>>>>>>> c6875324e701d04b3e7e4fbbc65f900ef7c35a16

builder.Services.AddScoped<
    IVendaService,
    VendaService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
