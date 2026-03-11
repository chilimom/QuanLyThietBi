using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Helpers;
using Server.Models;
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
            .Include(x => x.PhanXuong)
            .Include(x => x.NguoiDungPhanXuongs)
                .ThenInclude(x => x.PhanXuong)
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
        var assignedPhanXuongs = account.NguoiDungPhanXuongs
            .Select(x => new { x.PhanXuongId, x.PhanXuong.TenPhanXuong })
            .Distinct()
            .ToList();

        if (assignedPhanXuongs.Count == 0 && account.PhanXuongId.HasValue)
        {
            assignedPhanXuongs.Add(new
            {
                PhanXuongId = account.PhanXuongId.Value,
                TenPhanXuong = account.PhanXuong?.TenPhanXuong
            });
        }

        var accessToken = JwtHelper.GenerateToken(
            account.TenDangNhap ?? "",
            role,
            assignedPhanXuongs.Select(x => x.PhanXuongId),
            _config["Jwt:Key"]!,
            _config["Jwt:Issuer"]!);

        var response = new ApiResponse<LoginReponse>
        {
            Status = true,
            Message = "Dang nhap thanh cong!",
            Data = new LoginReponse
            {
                AccessToken = accessToken,
                MaNv = account.TenDangNhap ?? "",
                Role = role,
                HoTen = account.TenDangNhap,
                PhanXuongId = assignedPhanXuongs.FirstOrDefault()?.PhanXuongId,
                TenPhanXuong = assignedPhanXuongs.FirstOrDefault()?.TenPhanXuong,
                PhanXuongIds = assignedPhanXuongs.Select(x => x.PhanXuongId).ToList(),
                TenPhanXuongs = assignedPhanXuongs
                    .Select(x => x.TenPhanXuong)
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Cast<string>()
                    .ToList()
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
            .Include(x => x.PhanXuong)
            .Include(x => x.NguoiDungPhanXuongs)
                .ThenInclude(x => x.PhanXuong)
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

        var assignedPhanXuongs = account.NguoiDungPhanXuongs
            .Select(x => new { x.PhanXuongId, x.PhanXuong.TenPhanXuong })
            .Distinct()
            .ToList();

        if (assignedPhanXuongs.Count == 0 && account.PhanXuongId.HasValue)
        {
            assignedPhanXuongs.Add(new
            {
                PhanXuongId = account.PhanXuongId.Value,
                TenPhanXuong = account.PhanXuong?.TenPhanXuong
            });
        }

        var user = new NguoiDungValidation
        {
            IDNguoiDung = account.IdnguoiDung,
            TenDangNhap = account.TenDangNhap ?? string.Empty,
            MatKhau = account.MatKhau ?? string.Empty,
            HoTen = account.TenDangNhap ?? string.Empty,
            IDQuyen = account.Idquyen ?? 0,
            TenQuyen = quyen?.TenQuyen ?? string.Empty,
            IsLock = account.IsLock ?? 0,
            PhanXuongId = assignedPhanXuongs.FirstOrDefault()?.PhanXuongId,
            TenPhanXuong = assignedPhanXuongs.FirstOrDefault()?.TenPhanXuong,
            PhanXuongIds = assignedPhanXuongs.Select(x => x.PhanXuongId).ToList(),
            TenPhanXuongs = assignedPhanXuongs
                .Select(x => x.TenPhanXuong)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Cast<string>()
                .ToList()
        };

        return Ok(new ApiResponse<NguoiDungValidation>
        {
            Status = true,
            Message = "Lay thong tin nguoi dung thanh cong",
            Data = user
        });
    }
}
