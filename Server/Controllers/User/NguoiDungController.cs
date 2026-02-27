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

        // Kiá»ƒm tra trÃ¹ng tÃªn Ä‘Äƒng nháº­p
        var existingUser = await _context.NguoiDungs
            .FirstOrDefaultAsync(u => u.TenDangNhap == request.TenDangNhap);

        if (existingUser != null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = $"TÃªn Ä‘Äƒng nháº­p '{request.TenDangNhap}' Ä‘Ã£ tá»“n táº¡i!",
                Data = null
            });
        }

        // Kiá»ƒm tra nhÃ¢n viÃªn cÃ³ tá»“n táº¡i khÃ´ng (náº¿u cáº§n)
        var nhanVien = await _context.NhanViens.FindAsync(request.NhanVienId);
        if (nhanVien == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "KhÃ´ng tÃ¬m tháº¥y nhÃ¢n viÃªn tÆ°Æ¡ng á»©ng!",
                Data = null
            });
        }

        //  Táº¡o tÃ i khoáº£n ngÆ°á»i dÃ¹ng
        var user = new NguoiDung
        {
            TenDangNhap = request.TenDangNhap,
            MatKhau = Encryptor.MD5Hash(request.MatKhau!), // Hash máº­t kháº©u trÆ°á»›c khi lÆ°u
            NhanVienId = request.NhanVienId,
            Idquyen = request.Idquyen,
            IsLock = 0
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
        var username = User.Identity?.Name;

        // Base query (LEFT JOIN + select) to keep users even when linked data is missing
        var query =
            from a in _context.NguoiDungs.AsNoTracking()
            join nv0 in _context.NhanViens.AsNoTracking() on a.NhanVienId equals nv0.Id into nvJoin
            from nv in nvJoin.DefaultIfEmpty()
            join q0 in _context.Quyens.AsNoTracking() on a.Idquyen equals q0.Idquyen into qJoin
            from q in qJoin.DefaultIfEmpty()
            join pb0 in _context.PhongBans.AsNoTracking() on nv.IdphongBan equals pb0.IdphongBan into pbJoin
            from pb in pbJoin.DefaultIfEmpty()
            join cv0 in _context.ChucVus.AsNoTracking() on nv.IdChucVu equals cv0.IdChucVu into cvJoin
            from cv in cvJoin.DefaultIfEmpty()
            join kip0 in _context.KipLamViecs.AsNoTracking() on nv.IdKipLamViec equals kip0.IdKipLamViec into kipJoin
            from kip in kipJoin.DefaultIfEmpty()
            join to0 in _context.ToLamViecs.AsNoTracking() on nv.IdToLamViec equals to0.IdToLamViec into toJoin
            from to in toJoin.DefaultIfEmpty()
            where a.TenDangNhap != username
            select new NguoiDungValidation
            {
                IDNguoiDung = a.IdnguoiDung,
                TenDangNhap = a.TenDangNhap ?? "",
                MatKhau = a.MatKhau ?? "",
                NhanVienID = a.NhanVienId ?? 0,
                MaNV = nv != null ? (nv.MaNv ?? "") : "",
                HoTen = nv != null ? (nv.HoTen ?? "") : "",
                TenPB = pb != null ? (pb.TenPhongBan ?? "") : "",
                TenChucVu = cv != null ? (cv.TenChucVu ?? "") : "",
                TenKipLamViec = kip != null ? (kip.TenKipLamViec ?? "") : "",
                TenToLamViec = to != null ? (to.TenToLamViec ?? "") : "",
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
                EF.Functions.Like(x.MaNV, pat) ||
                EF.Functions.Like(x.TenPB, pat) ||
                EF.Functions.Like(x.TenChucVu, pat) ||
                EF.Functions.Like(x.TenKipLamViec, pat) ||
                EF.Functions.Like(x.TenToLamViec, pat) ||
                EF.Functions.Like(x.TenQuyen, pat)
            );
        }

        // Tá»•ng sá»‘ dÃ²ng sau khi lá»c
        var total = await query.CountAsync();

        // Sáº¯p xáº¿p Ä‘Æ¡n giáº£n theo HoTen
        query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderBy(x => x.HoTen)
            : query.OrderByDescending(x => x.HoTen);

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

        nguoidung.NhanVienId = request.NhanVienId;
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
    [Authorize(Roles = "4")]
    [HttpGet("getMaNV")]
    public async Task<IActionResult> GetMaNV()
    {
        var nhanViens = await _context.NhanViens
            .Include(nv => nv.IdphongBanNavigation)
            .Include(nv => nv.IdChucVuNavigation)
            .Include(nv => nv.IdKipLamViecNavigation)
            .Include(nv => nv.IdToLamViecNavigation)
            .Select(nv => new NhanVienDto
            {
                Id = nv.Id,
                MaNv = nv.MaNv,
                HoTen = nv.HoTen,
                DiaChi = nv.DiaChi,
                NgayVaoLam = nv.NgayVaoLam,
                TenPhongBan = nv.IdphongBanNavigation != null ? nv.IdphongBanNavigation.TenPhongBan : null,
                IdPhongBan = nv.IdphongBan,
                IdChucVu = nv.IdChucVu,
                TenChucVu = nv.IdChucVuNavigation != null ? nv.IdChucVuNavigation.TenChucVu : null,
                IdKipLamViec = nv.IdKipLamViec,
                TenKipLamViec = nv.IdKipLamViecNavigation != null ? nv.IdKipLamViecNavigation.TenKipLamViec : null,
                IdToLamViec = nv.IdToLamViec,
                TenToLamViec = nv.IdToLamViecNavigation != null ? nv.IdToLamViecNavigation.TenToLamViec : null,
                HoTenKhongDau = nv.HoTenKhongDau,
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<NhanVienDto>>
        {
            Status = true,
            Message = "Láº¥y danh sÃ¡ch nhÃ¢n viÃªn thÃ nh cÃ´ng!",
            Data = nhanViens
        });
    }


}
