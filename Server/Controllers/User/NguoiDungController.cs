using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Azure;
using Server.Helpers;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class NguoiDungController : ControllerBase
{
    private readonly QLThietBiContext _context;
    private readonly IConfiguration _config;
    private readonly PasswordHasher<string> _hasher = new();

    public NguoiDungController(QLThietBiContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [Authorize(Roles = "4")]
    [HttpPost("createND")]
    public async Task<IActionResult> CreateNguoiDung([FromBody] NguoiDungDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Status = false,
                Message = "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡",
                Data = null
            });
        }

        var username = request.TenDangNhap?.Trim();
        var password = request.MatKhau?.Trim();
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Tên đăng nhập và mật khẩu không được để trống!",
                Data = null
            });
        }

        // Kiá»ƒm tra trÃ¹ng tÃªn Ä‘Äƒng nháº­p
        var existingUser = await _context.NguoiDungs
            .FirstOrDefaultAsync(u => u.TenDangNhap == username);

        if (existingUser != null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = $"TÃªn Ä‘Äƒng nháº­p '{username}' Ä‘Ã£ tá»“n táº¡i!",
                Data = null
            });
        }

        //  Táº¡o tÃ i khoáº£n ngÆ°á»i dÃ¹ng
        var user = new NguoiDung
        {
            TenDangNhap = username,
            MatKhau = Encryptor.MD5Hash(password), // Hash máº­t kháº©u trÆ°á»›c khi lÆ°u
            NhanVienId = null,
            Idquyen = request.Idquyen,
            IsLock = request.IsLock ?? 0
        };

        _context.NguoiDungs.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<NguoiDung>
        {
            Status = true,
            Message = "Táº¡o tÃ i khoáº£n ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng!",
            Data = null
        });
    }

    // 
    [Authorize(Roles = "4")]
    [HttpGet("getAllND")]
    public async Task<IActionResult> GetAllND(
        [FromQuery] string? keyword = null,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string sortOrder = "asc")
    {
        // Base query
        var query =
            from a in _context.NguoiDungs.AsNoTracking()
            join q0 in _context.Quyens.AsNoTracking() on a.Idquyen equals q0.Idquyen into qJoin
            from q in qJoin.DefaultIfEmpty()
            select new NguoiDungValidation
            {
                IDNguoiDung = a.IdnguoiDung,
                TenDangNhap = a.TenDangNhap ?? "",
                MatKhau = a.MatKhau ?? "",
                HoTen = a.TenDangNhap ?? "",
                IDQuyen = a.Idquyen ?? 0,
                TenQuyen = q != null ? (q.TenQuyen ?? "") : "",
                IsLock = a.IsLock ?? 0
            };

        // TÃ¬m kiáº¿m Ä‘Æ¡n giáº£n
        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var pat = $"%{keyword.Trim()}%";
            query = query.Where(x =>
                EF.Functions.Like(x.HoTen, pat) ||
                EF.Functions.Like(x.TenDangNhap, pat) ||
                EF.Functions.Like(x.TenQuyen, pat)
            );
        }

        // Tá»•ng sá»‘ dÃ²ng sau khi lá»c
        var total = await query.CountAsync();

        // Sáº¯p xáº¿p theo tÃªn Ä‘Äƒng nháº­p
        query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderBy(x => x.TenDangNhap)
            : query.OrderByDescending(x => x.TenDangNhap);

        // PhÃ¢n trang
        var data = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return Ok(new ApiResponsePagination<List<NguoiDungValidation>>
        {
            Status = true,
            Message = "Láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng!",
            Data = data,
            TotalItems = total,
            Page = page,
            Limit = limit,
            TotalPages = (int)Math.Ceiling((double)total / limit)
        });
    }
    [Authorize(Roles = "4")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteNguoiDung(int id)
    {
        var nguoidung = await _context.NguoiDungs.FindAsync(id);
        if (nguoidung == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng cáº§n xÃ³a.",
                Data = null
            });
        }

        _context.NguoiDungs.Remove(nguoidung);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>
        {
            Status = true,
            Message = "XÃ³a ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng!",
            Data = null
        });
    }
    [Authorize(Roles = "4")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateNguoiDung(int id, [FromBody] NguoiDungDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Status = false,
                Message = "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡",
                Data = null
            });
        }

        var nguoidung = await _context.NguoiDungs.FindAsync(id);
        if (nguoidung == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng cáº§n cáº­p nháº­t.",
                Data = null
            });
        }

        // Kiá»ƒm tra trÃ¹ng tÃªn Ä‘Äƒng nháº­p khÃ¡c ID hiá»‡n táº¡i
        var newUsername = request.TenDangNhap?.Trim();
        if (!string.IsNullOrEmpty(newUsername) &&
            !string.Equals(newUsername, nguoidung.TenDangNhap?.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            var exists = await _context.NguoiDungs
                .AnyAsync(u => u.TenDangNhap == newUsername && u.IdnguoiDung != id);

            if (exists)
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = $"TÃªn Ä‘Äƒng nháº­p '{newUsername}' Ä‘Ã£ tá»“n táº¡i!",
                });

            nguoidung.TenDangNhap = newUsername;
        }

        // Cáº­p nháº­t thÃ´ng tin

        // Náº¿u máº­t kháº©u Ä‘Æ°á»£c truyá»n vÃ  khÃ¡c vá»›i máº­t kháº©u cÅ©, thÃ¬ hash láº¡i
        if (!string.IsNullOrWhiteSpace(request.MatKhau))
        {
            nguoidung.MatKhau = Encryptor.MD5Hash(request.MatKhau);
        }

        nguoidung.NhanVienId = null;
        nguoidung.Idquyen = request.Idquyen;
        nguoidung.IsLock = request.IsLock;

        _context.NguoiDungs.Update(nguoidung);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<NguoiDung>
        {
            Status = true,
            Message = "Cáº­p nháº­t ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng!",
            Data = nguoidung
        });
    }
    [Authorize]
    [HttpPut("updatePass/{id}")]
    public async Task<IActionResult> UpdatePass(int id, [FromBody] MatkhauDto request)
    {
        if (!ModelState.IsValid)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡",
                Data = null
            });
        }

        var nguoidung = await _context.NguoiDungs.FindAsync(id);
        if (nguoidung == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng cáº§n cáº­p nháº­t.",
                Data = null
            });
        }

        // Náº¿u máº­t kháº©u Ä‘Æ°á»£c truyá»n vÃ  khÃ¡c vá»›i máº­t kháº©u cÅ©, thÃ¬ hash láº¡i
        if (!string.IsNullOrWhiteSpace(request.Matkhaumoi))
        {
            nguoidung.MatKhau = Encryptor.MD5Hash(request.Matkhaumoi);
        }


        _context.NguoiDungs.Update(nguoidung);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<NguoiDung>
        {
            Status = true,
            Message = "Cáº­p nháº­t ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng!",
            Data = nguoidung
        });
    }
}
