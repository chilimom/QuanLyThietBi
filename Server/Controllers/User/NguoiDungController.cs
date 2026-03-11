using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Helpers;
using Server.Models;

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
                Message = "Du lieu khong hop le",
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
                Message = "Ten dang nhap va mat khau khong duoc de trong!",
                Data = null
            });
        }

        var assignedPhanXuongIds = NormalizeAssignedPhanXuongIds(request);
        if (!await ValidatePhanXuongAssignment(request.Idquyen, assignedPhanXuongIds))
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Danh sach phan xuong duoc gan khong hop le.",
                Data = null
            });
        }

        var existingUser = await _context.NguoiDungs
            .FirstOrDefaultAsync(u => u.TenDangNhap == username);

        if (existingUser != null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = $"Ten dang nhap '{username}' da ton tai!",
                Data = null
            });
        }

        var user = new NguoiDung
        {
            TenDangNhap = username,
            MatKhau = Encryptor.MD5Hash(password),
            NhanVienId = null,
            Idquyen = request.Idquyen,
            IsLock = request.IsLock ?? 0,
            PhanXuongId = assignedPhanXuongIds.FirstOrDefault()
        };

        _context.NguoiDungs.Add(user);
        await _context.SaveChangesAsync();

        await SyncUserPhanXuongs(user.IdnguoiDung, assignedPhanXuongIds);

        return Ok(new ApiResponse<object>
        {
            Status = true,
            Message = "Tao tai khoan nguoi dung thanh cong!",
            Data = new
            {
                user.IdnguoiDung,
                user.TenDangNhap,
                user.Idquyen,
                user.IsLock,
                PhanXuongIds = assignedPhanXuongIds
            }
        });
    }

    [Authorize(Roles = "4")]
    [HttpGet("getAllND")]
    public async Task<IActionResult> GetAllND(
        [FromQuery] string? keyword = null,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string sortOrder = "asc")
    {
        var users = await _context.NguoiDungs
            .AsNoTracking()
            .Include(x => x.NguoiDungPhanXuongs)
                .ThenInclude(x => x.PhanXuong)
            .ToListAsync();

        var roleMap = await _context.Quyens.AsNoTracking()
            .ToDictionaryAsync(x => x.Idquyen, x => x.TenQuyen ?? "");

        var query = users.Select(a =>
        {
            var phanXuongs = a.NguoiDungPhanXuongs
                .Select(x => x.PhanXuong)
                .Where(x => x != null)
                .Select(x => new { x!.PhanXuongId, x.TenPhanXuong })
                .Distinct()
                .ToList();

            return new NguoiDungValidation
            {
                IDNguoiDung = a.IdnguoiDung,
                TenDangNhap = a.TenDangNhap ?? "",
                MatKhau = a.MatKhau ?? "",
                HoTen = a.TenDangNhap ?? "",
                IDQuyen = a.Idquyen ?? 0,
                TenQuyen = roleMap.TryGetValue(a.Idquyen ?? 0, out var tenQuyen) ? tenQuyen : "",
                IsLock = a.IsLock ?? 0,
                PhanXuongId = phanXuongs.FirstOrDefault()?.PhanXuongId ?? a.PhanXuongId,
                TenPhanXuong = phanXuongs.FirstOrDefault()?.TenPhanXuong,
                PhanXuongIds = phanXuongs.Select(x => x.PhanXuongId).ToList(),
                TenPhanXuongs = phanXuongs
                    .Select(x => x.TenPhanXuong)
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Cast<string>()
                    .ToList()
            };
        }).AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var pat = keyword.Trim().ToLower();
            query = query.Where(x =>
                (x.HoTen ?? "").ToLower().Contains(pat) ||
                (x.TenDangNhap ?? "").ToLower().Contains(pat) ||
                (x.TenQuyen ?? "").ToLower().Contains(pat) ||
                x.TenPhanXuongs.Any(name => (name ?? "").ToLower().Contains(pat)));
        }

        var total = query.Count();
        query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderBy(x => x.TenDangNhap)
            : query.OrderByDescending(x => x.TenDangNhap);

        var data = query
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();

        return Ok(new ApiResponsePagination<List<NguoiDungValidation>>
        {
            Status = true,
            Message = "Lay danh sach nguoi dung thanh cong!",
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
                Message = "Khong tim thay nguoi dung can xoa.",
                Data = null
            });
        }

        _context.NguoiDungs.Remove(nguoidung);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>
        {
            Status = true,
            Message = "Xoa nguoi dung thanh cong!",
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
                Message = "Du lieu khong hop le",
                Data = null
            });
        }

        var nguoidung = await _context.NguoiDungs
            .Include(x => x.NguoiDungPhanXuongs)
            .FirstOrDefaultAsync(x => x.IdnguoiDung == id);

        if (nguoidung == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Khong tim thay nguoi dung can cap nhat.",
                Data = null
            });
        }

        var assignedPhanXuongIds = NormalizeAssignedPhanXuongIds(request);
        if (!await ValidatePhanXuongAssignment(request.Idquyen, assignedPhanXuongIds))
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Danh sach phan xuong duoc gan khong hop le.",
                Data = null
            });
        }

        var newUsername = request.TenDangNhap?.Trim();
        if (!string.IsNullOrEmpty(newUsername) &&
            !string.Equals(newUsername, nguoidung.TenDangNhap?.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            var exists = await _context.NguoiDungs
                .AnyAsync(u => u.TenDangNhap == newUsername && u.IdnguoiDung != id);

            if (exists)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = $"Ten dang nhap '{newUsername}' da ton tai!"
                });
            }

            nguoidung.TenDangNhap = newUsername;
        }

        if (!string.IsNullOrWhiteSpace(request.MatKhau))
        {
            nguoidung.MatKhau = Encryptor.MD5Hash(request.MatKhau);
        }

        nguoidung.NhanVienId = null;
        nguoidung.Idquyen = request.Idquyen;
        nguoidung.IsLock = request.IsLock;
        nguoidung.PhanXuongId = assignedPhanXuongIds.FirstOrDefault();

        _context.NguoiDungs.Update(nguoidung);
        await _context.SaveChangesAsync();

        await SyncUserPhanXuongs(id, assignedPhanXuongIds);

        return Ok(new ApiResponse<object>
        {
            Status = true,
            Message = "Cap nhat nguoi dung thanh cong!",
            Data = new
            {
                nguoidung.IdnguoiDung,
                nguoidung.TenDangNhap,
                nguoidung.Idquyen,
                nguoidung.IsLock,
                PhanXuongIds = assignedPhanXuongIds
            }
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
                Message = "Du lieu khong hop le",
                Data = null
            });
        }

        var nguoidung = await _context.NguoiDungs.FindAsync(id);
        if (nguoidung == null)
        {
            return Ok(new ApiResponse<object>
            {
                Status = false,
                Message = "Khong tim thay nguoi dung can cap nhat.",
                Data = null
            });
        }

        if (!string.IsNullOrWhiteSpace(request.Matkhaumoi))
        {
            nguoidung.MatKhau = Encryptor.MD5Hash(request.Matkhaumoi);
        }

        _context.NguoiDungs.Update(nguoidung);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>
        {
            Status = true,
            Message = "Cap nhat nguoi dung thanh cong!",
            Data = new
            {
                nguoidung.IdnguoiDung,
                nguoidung.TenDangNhap
            }
        });
    }

    private async Task<bool> ValidatePhanXuongAssignment(int? roleId, IReadOnlyCollection<int> phanXuongIds)
    {
        if (roleId == 4)
        {
            if (phanXuongIds.Count == 0) return true;
            var count = await _context.PhanXuongs.CountAsync(x => phanXuongIds.Contains(x.PhanXuongId));
            return count == phanXuongIds.Count;
        }

        if (phanXuongIds.Count == 0)
        {
            return false;
        }

        var validCount = await _context.PhanXuongs.CountAsync(x => phanXuongIds.Contains(x.PhanXuongId));
        return validCount == phanXuongIds.Count;
    }

    private static List<int> NormalizeAssignedPhanXuongIds(NguoiDungDto request)
    {
        var ids = (request.PhanXuongIds ?? new List<int>())
            .Where(x => x > 0)
            .Distinct()
            .ToList();

        if (ids.Count == 0 && request.PhanXuongId.HasValue && request.PhanXuongId.Value > 0)
        {
            ids.Add(request.PhanXuongId.Value);
        }

        return ids;
    }

    private async Task SyncUserPhanXuongs(int nguoiDungId, IReadOnlyCollection<int> phanXuongIds)
    {
        var existing = await _context.NguoiDungPhanXuongs
            .Where(x => x.NguoiDungId == nguoiDungId)
            .ToListAsync();

        if (existing.Count > 0)
        {
            _context.NguoiDungPhanXuongs.RemoveRange(existing);
        }

        if (phanXuongIds.Count > 0)
        {
            _context.NguoiDungPhanXuongs.AddRange(
                phanXuongIds.Select(id => new NguoiDungPhanXuong
                {
                    NguoiDungId = nguoiDungId,
                    PhanXuongId = id
                }));
        }

        var user = await _context.NguoiDungs.FindAsync(nguoiDungId);
        if (user != null)
        {
            user.PhanXuongId = phanXuongIds.FirstOrDefault();
        }

        await _context.SaveChangesAsync();
    }
}
