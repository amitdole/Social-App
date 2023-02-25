using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddAIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseCors("social");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
