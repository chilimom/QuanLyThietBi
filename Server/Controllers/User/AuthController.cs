using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Server.Models;
using Azure;
using Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly QLThietBiContext _context;
    private readonly IConfiguration _config;
    private readonly PasswordHasher<string> _hasher = new();

    public AuthController(QLThietBiContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        string mk = Encryptor.MD5Hash(request.Password);
        var account = await _context.NguoiDungs
                    .FirstOrDefaultAsync(x =>
                        x.TenDangNhap == request.Manv &&
                        x.MatKhau == mk &&
                        x.IsLock == 0);
        if (account == null || account.MatKhau != mk)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Tai khoan hoac mat khau khong dung!",
                Data = null
            });
        }

        if (account.IsLock == 1)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Tai khoan da bi khoa!",
                Data = null
            });
        }
        int role = account.Idquyen ?? 0;

        var accessToken = JwtHelper.GenerateToken(
            account.TenDangNhap ?? "",
            role,
            _config["Jwt:Key"]!,
            _config["Jwt:Issuer"]!
        );

        await _context.SaveChangesAsync();

        var response = new ApiResponse<LoginReponse>
        {
            Status = true,
            Message = "Dang nhap thanh cong!",
            Data = new LoginReponse
            {
                AccessToken = accessToken,
                MaNv = account?.TenDangNhap,
                Role = role,
                HoTen = account?.TenDangNhap
            }
        };

        return Ok(response);
    }

    [Authorize]
    [HttpGet("detail")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var username = User.FindFirst(ClaimTypes.Name)?.Value;

        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized(new ApiResponse<string>
            {
                Status = false,
                Message = "Token khong hop le!"
            });
        }

        var account = await _context.NguoiDungs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TenDangNhap == username);

        if (account == null)
        {
            return NotFound(new ApiResponse<string>
            {
                Status = false,
                Message = "Khong tim thay nguoi dung!"
            });
        }

        var quyen = account.Idquyen.HasValue
            ? await _context.Quyens.AsNoTracking().FirstOrDefaultAsync(x => x.Idquyen == account.Idquyen.Value)
            : null;

        var user = new NguoiDungValidation
        {
            IDNguoiDung = account.IdnguoiDung,
            TenDangNhap = account.TenDangNhap ?? string.Empty,
            MatKhau = account.MatKhau ?? string.Empty,
            HoTen = account.TenDangNhap ?? string.Empty,
            IDQuyen = account.Idquyen ?? 0,
            TenQuyen = quyen?.TenQuyen ?? string.Empty,
            IsLock = account.IsLock ?? 0
        };

        return Ok(new ApiResponse<NguoiDungValidation>
        {
            Status = true,
            Message = "Lay thong tin nguoi dung thanh cong",
            Data = user
        });
    }
}
