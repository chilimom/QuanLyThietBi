using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Models;



var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddDbContext<QLThietBiContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConnectDB")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientQLTB",
        policy =>
        {
            policy.WithOrigins("http://localhost:8386", "http://10.192.72.45:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .WithExposedHeaders("Content-Disposition");
        });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),

            ClockSkew = TimeSpan.Zero,
            RoleClaimType = ClaimTypes.Role
        };


    });

builder.Services.AddAuthorization();
// Add services to the container. Add dịch vụ controller
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("ClientQLTB");

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Access-Control-Expose-Headers", "Content-Disposition");
    await next();
});
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication(); // Bắt buộc nếu dùng JWT
app.UseAuthorization();  // Bắt buộc nếu có [Authorize]

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<QLThietBiContext>();
    var ensureThietBiKhuVucSql = @"
IF OBJECT_ID('dbo.ThietBiKhuVuc', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ThietBiKhuVuc
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        PhanXuongId INT NOT NULL,
        NhomThietBi NVARCHAR(50) NOT NULL,
        MaVatTu NVARCHAR(100) NULL,
        TenVatTu NVARCHAR(200) NOT NULL,
        ViTri NVARCHAR(200) NULL,
        SoLuong INT NOT NULL CONSTRAINT DF_ThietBiKhuVuc_SoLuong DEFAULT (0),
        SerialNumber NVARCHAR(200) NULL,
        TinhTrang NVARCHAR(200) NULL,
        LichSuThayThe NVARCHAR(1000) NULL,
        NgayCapNhat DATETIME NULL CONSTRAINT DF_ThietBiKhuVuc_NgayCapNhat DEFAULT (GETDATE()),
        CONSTRAINT FK_ThietBiKhuVuc_PhanXuong FOREIGN KEY (PhanXuongId)
            REFERENCES dbo.PhanXuong(PhanXuongId)
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ThietBiKhuVuc_PhanXuongId' AND object_id = OBJECT_ID('dbo.ThietBiKhuVuc'))
BEGIN
    CREATE INDEX IX_ThietBiKhuVuc_PhanXuongId ON dbo.ThietBiKhuVuc(PhanXuongId);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ThietBiKhuVuc_NhomThietBi' AND object_id = OBJECT_ID('dbo.ThietBiKhuVuc'))
BEGIN
    CREATE INDEX IX_ThietBiKhuVuc_NhomThietBi ON dbo.ThietBiKhuVuc(NhomThietBi);
END;

IF COL_LENGTH('dbo.ThietBiKhuVuc', 'ViTri') IS NULL
BEGIN
    ALTER TABLE dbo.ThietBiKhuVuc ADD ViTri NVARCHAR(200) NULL;
END;";

    db.Database.ExecuteSqlRaw(ensureThietBiKhuVucSql);
}
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// Ánh xạ đến Controller
app.MapControllers();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
