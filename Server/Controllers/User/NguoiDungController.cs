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
                Message = "Dữ liệu không hợp lệ",
                Data = null
            });
        }

        // Kiểm tra trùng tên đăng nhập
        var existingUser = await _context.NguoiDungs
            .FirstOrDefaultAsync(u => u.TenDangNhap == request.TenDangNhap);

        if (existingUser != null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = $"Tên đăng nhập '{request.TenDangNhap}' đã tồn tại!",
                Data = null
            });
        }

        // Kiểm tra nhân viên có tồn tại không (nếu cần)
        var nhanVien = await _context.NhanViens.FindAsync(request.NhanVienId);
        if (nhanVien == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Không tìm thấy nhân viên tương ứng!",
                Data = null
            });
        }

        //  Tạo tài khoản người dùng
        var user = new NguoiDung
        {
            TenDangNhap = request.TenDangNhap,
            MatKhau = Encryptor.MD5Hash(request.MatKhau!), // Hash mật khẩu trước khi lưu
            NhanVienId = request.NhanVienId,
            Idquyen = request.Idquyen,
            IsLock = 0
        };

        _context.NguoiDungs.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<NguoiDung>
        {
            Status = true,
            Message = "Tạo tài khoản người dùng thành công!",
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

        // Base query (JOIN + select)
        var query =
            from a in _context.NguoiDungs.AsNoTracking()
            join nv in _context.NhanViens.AsNoTracking() on a.NhanVienId equals nv.Id
            join q in _context.Quyens.AsNoTracking() on a.Idquyen equals q.Idquyen
            join pb in _context.PhongBans.AsNoTracking() on nv.IdphongBan equals pb.IdphongBan
            where a.TenDangNhap != username
            select new NguoiDungValidation
            {
                IDNguoiDung = a.IdnguoiDung,
                TenDangNhap = a.TenDangNhap!,
                MatKhau = a.MatKhau!,           // cân nhắc bỏ trường này khi trả danh sách
                NhanVienID = a.NhanVienId ?? 0,
                MaNV = nv.MaNv!,
                HoTen = nv.HoTen!,
                TenPB = pb.TenPhongBan!,
                IDQuyen = a.Idquyen ?? 0,
                TenQuyen = q.TenQuyen!,
                IsLock = a.IsLock ?? 0
            };

        // Tìm kiếm đơn giản
        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var pat = $"%{keyword.Trim()}%";
            query = query.Where(x =>
                EF.Functions.Like(x.HoTen, pat) ||
                EF.Functions.Like(x.TenDangNhap, pat) ||
                EF.Functions.Like(x.MaNV, pat) ||
                EF.Functions.Like(x.TenPB, pat) ||
                EF.Functions.Like(x.TenQuyen, pat)
            );
        }

        // Tổng số dòng sau khi lọc
        var total = await query.CountAsync();

        // Sắp xếp đơn giản theo HoTen
        query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderBy(x => x.HoTen)
            : query.OrderByDescending(x => x.HoTen);

        // Phân trang
        var data = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return Ok(new ApiResponsePagination<List<NguoiDungValidation>>
        {
            Status = true,
            Message = "Lấy danh sách người dùng thành công!",
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
                Message = "Không tìm thấy người dùng cần xóa.",
                Data = null
            });
        }

        _context.NguoiDungs.Remove(nguoidung);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>
        {
            Status = true,
            Message = "Xóa người dùng thành công!",
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
                Message = "Dữ liệu không hợp lệ",
                Data = null
            });
        }

        var nguoidung = await _context.NguoiDungs.FindAsync(id);
        if (nguoidung == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Không tìm thấy người dùng cần cập nhật.",
                Data = null
            });
        }

        // Kiểm tra trùng tên đăng nhập khác ID hiện tại
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
                    Message = $"Tên đăng nhập '{newUsername}' đã tồn tại!",
                });

            nguoidung.TenDangNhap = newUsername;
        }

        // Cập nhật thông tin

        // Nếu mật khẩu được truyền và khác với mật khẩu cũ, thì hash lại
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
            Message = "Cập nhật người dùng thành công!",
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
                Message = "Dữ liệu không hợp lệ",
                Data = null
            });
        }

        var nguoidung = await _context.NguoiDungs.FindAsync(id);
        if (nguoidung == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Không tìm thấy người dùng cần cập nhật.",
                Data = null
            });
        }

        // Nếu mật khẩu được truyền và khác với mật khẩu cũ, thì hash lại
        if (!string.IsNullOrWhiteSpace(request.Matkhaumoi))
        {
            nguoidung.MatKhau = Encryptor.MD5Hash(request.Matkhaumoi);
        }


        _context.NguoiDungs.Update(nguoidung);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<NguoiDung>
        {
            Status = true,
            Message = "Cập nhật người dùng thành công!",
            Data = nguoidung
        });
    }
    [Authorize(Roles = "4")]
    [HttpGet("getMaNV")]
    public async Task<IActionResult> GetMaNV()
    {
        var nhanViens = await _context.NhanViens
            .Include(nv => nv.IdphongBanNavigation)
            .Select(nv => new NhanVienDto
            {
                Id = nv.Id,
                MaNv = nv.MaNv,
                HoTen = nv.HoTen,
                DiaChi = nv.DiaChi,
                NgayVaoLam = nv.NgayVaoLam,
                // TenPhongBan = nv.IdphongBanNavigation.TenPhongBan,
                IdPhongBan = nv.IdphongBan,
                HoTenKhongDau = nv.HoTenKhongDau,
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<NhanVienDto>>
        {
            Status = true,
            Message = "Lấy danh sách nhân viên thành công!",
            Data = nhanViens
        });
    }


}