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
        var account = await _context.NguoiDungs.Include(x => x.NhanVien)
                    .FirstOrDefaultAsync(x =>
                        x.TenDangNhap == request.Manv &&
                        x.MatKhau == mk &&
                        x.IsLock == 0);
        if (account == null || account.MatKhau != mk)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Tài khoản hoặc mật khẩu không đúng!",
                Data = null
            });
        }

        if (account.IsLock == 1)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Tài khoản đã bị khóa!",
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

        // var refreshToken = JwtHelper.GenerateRefreshToken();
        // account.RefreshToken = refreshToken;
        // account.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        var response = new ApiResponse<LoginReponse>
        {
            Status = true,
            Message = "Đăng nhập thành công!",
            Data = new LoginReponse
            {
                AccessToken = accessToken,
                // RefreshToken = refreshToken,
                MaNv = account?.TenDangNhap,
                Role = role,
                HoTen = account?.NhanVien?.HoTen
            }
        };

        return Ok(response);
    }
    // [HttpPost("logout")]
    // public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
    // {
    //     var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);
    //     if (user == null)
    //         return NotFound(new { message = "Không tìm thấy người dùng." });

    //     user.RefreshToken = null;
    //     await _context.SaveChangesAsync();

    //     return Ok(new ApiResponse<string>
    //     {
    //         Status = true,
    //         Message = "Đăng xuất thành công!",
    //         Data = null,
    //     });
    // }

    [Authorize]
    [HttpGet("detail")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var username = User.FindFirst(ClaimTypes.Name)?.Value;

        var user = await (
            from a in _context.NguoiDungs
            join nv in _context.NhanViens on a.NhanVienId equals nv.Id
            join q in _context.Quyens on a.Idquyen equals q.Idquyen
            join pb in _context.PhongBans on nv.IdphongBan equals pb.IdphongBan
            where a.TenDangNhap == username
            select new NguoiDungValidation
            {
                IDNguoiDung = a.IdnguoiDung,
                TenDangNhap = a.TenDangNhap!,
                MatKhau = a.MatKhau!,
                NhanVienID = a.NhanVienId ?? 0,
                MaNV = nv.MaNv!,
                HoTen = nv.HoTen!,
                TenPB = pb.TenPhongBan!,
                IDQuyen = a.Idquyen ?? 0,
                TenQuyen = q.TenQuyen!,
                IsLock = a.IsLock ?? 0
            }
        ).FirstOrDefaultAsync();

        if (user == null)
            return NotFound(new ApiResponse<string> { Status = false, Message = "Không tìm thấy người dùng!" });

        return Ok(new ApiResponse<NguoiDungValidation>
        {
            Status = true,
            Message = "Lấy thông tin người dùng thành công",
            Data = user
        });
    }

    
    


}