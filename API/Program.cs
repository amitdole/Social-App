using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<DataContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(options => options.AddPolicy
("social", builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200")));

var app = builder.Build();

app.UseCors("social");

app.MapControllers();

app.Run();
