using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Helpers;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/thietbikhuvuc")]
    public class ThietBiKhuVucController : ControllerBase
    {
        private static readonly HashSet<string> AllowedNhomThietBi = new(StringComparer.OrdinalIgnoreCase)
        {
            "ThietBiMang",
            "MayTinhVanHanh",
            "ThietBiCCTV"
        };

        private readonly QLThietBiContext _context;

        public ThietBiKhuVucController(QLThietBiContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ThietBiKhuVucValidation request)
        {
            if (!IsValidRequest(request, out var message))
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = message,
                    Data = null
                });
            }

            var scopedPhanXuongIds = GetScopedPhanXuongIds();
            if (scopedPhanXuongIds.Count > 0 && !scopedPhanXuongIds.Contains(request.PhanXuongId))
            {
                return Forbid();
            }

            var phanXuongExists = await _context.PhanXuongs.AnyAsync(x => x.PhanXuongId == request.PhanXuongId);
            if (!phanXuongExists)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Phan xuong khong ton tai.",
                    Data = null
                });
            }

            var entity = new ThietBiKhuVuc
            {
                PhanXuongId = request.PhanXuongId,
                NhomThietBi = request.NhomThietBi!.Trim(),
                MaVatTu = request.MaVatTu?.Trim(),
                TenVatTu = request.TenVatTu!.Trim(),
                ViTri = request.ViTri?.Trim(),
                SoLuong = request.SoLuong,
                SerialNumber = request.SerialNumber?.Trim(),
                TinhTrang = request.TinhTrang?.Trim(),
                LichSuThayThe = request.LichSuThayThe?.Trim(),
                NgayCapNhat = request.NgayCapNhat ?? DateTime.Now
            };

            _context.ThietBiKhuVucs.Add(entity);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<ThietBiKhuVuc>
            {
                Status = true,
                Message = "Them thiet bi khu vuc thanh cong.",
                Data = entity
            });
        }

        [Authorize]
        [HttpGet("get")]
        public async Task<IActionResult> Get(
            [FromQuery] int? phanXuongId = null,
            [FromQuery] string? nhomThietBi = null,
            [FromQuery] string? keyword = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            if (page <= 0) page = 1;
            if (limit <= 0) limit = 10;

            var query = _context.ThietBiKhuVucs
                .Include(x => x.PhanXuong)
                .AsQueryable();

            var scopedPhanXuongIds = GetScopedPhanXuongIds();
            if (scopedPhanXuongIds.Count > 0)
            {
                query = query.Where(x => scopedPhanXuongIds.Contains(x.PhanXuongId));
            }
            else if (phanXuongId.HasValue)
            {
                query = query.Where(x => x.PhanXuongId == phanXuongId.Value);
            }

            if (!string.IsNullOrWhiteSpace(nhomThietBi))
            {
                var normalizedNhom = NormalizeNhom(nhomThietBi);
                query = query.Where(x => x.NhomThietBi == normalizedNhom);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.Trim().ToLower();
                query = query.Where(x =>
                    (x.MaVatTu ?? "").ToLower().Contains(kw) ||
                    (x.TenVatTu ?? "").ToLower().Contains(kw) ||
                    (x.ViTri ?? "").ToLower().Contains(kw) ||
                    (x.SerialNumber ?? "").ToLower().Contains(kw) ||
                    (x.TinhTrang ?? "").ToLower().Contains(kw) ||
                    (x.LichSuThayThe ?? "").ToLower().Contains(kw));
            }

            var totalCount = await query.CountAsync();

            var data = await query
                .OrderBy(x => x.PhanXuongId)
                .ThenBy(x => x.NhomThietBi)
                .ThenByDescending(x => x.NgayCapNhat)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(x => new ThietBiKhuVucValidation
                {
                    Id = x.Id,
                    PhanXuongId = x.PhanXuongId,
                    TenPhanXuong = x.PhanXuong.TenPhanXuong,
                    NhomThietBi = x.NhomThietBi,
                    MaVatTu = x.MaVatTu,
                    TenVatTu = x.TenVatTu,
                    ViTri = x.ViTri,
                    SoLuong = x.SoLuong,
                    SerialNumber = x.SerialNumber,
                    TinhTrang = x.TinhTrang,
                    LichSuThayThe = x.LichSuThayThe,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToListAsync();

            return Ok(new ApiResponsePagination<List<ThietBiKhuVucValidation>>
            {
                Status = true,
                Message = "Lay danh sach thiet bi khu vuc thanh cong.",
                Data = data,
                TotalItems = totalCount,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling((double)totalCount / limit)
            });
        }

        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ThietBiKhuVucValidation request)
        {
            if (!IsValidRequest(request, out var message))
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = message,
                    Data = null
                });
            }

            var scopedPhanXuongIds = GetScopedPhanXuongIds();
            if (scopedPhanXuongIds.Count > 0 && !scopedPhanXuongIds.Contains(request.PhanXuongId))
            {
                return Forbid();
            }

            var entity = await _context.ThietBiKhuVucs.FindAsync(id);
            if (entity == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Khong tim thay thiet bi.",
                    Data = null
                });
            }

            if (scopedPhanXuongIds.Count > 0 && !scopedPhanXuongIds.Contains(entity.PhanXuongId))
            {
                return Forbid();
            }

            var phanXuongExists = await _context.PhanXuongs.AnyAsync(x => x.PhanXuongId == request.PhanXuongId);
            if (!phanXuongExists)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Phan xuong khong ton tai.",
                    Data = null
                });
            }

            entity.PhanXuongId = request.PhanXuongId;
            entity.NhomThietBi = request.NhomThietBi!.Trim();
            entity.MaVatTu = request.MaVatTu?.Trim();
            entity.TenVatTu = request.TenVatTu!.Trim();
            entity.ViTri = request.ViTri?.Trim();
            entity.SoLuong = request.SoLuong;
            entity.SerialNumber = request.SerialNumber?.Trim();
            entity.TinhTrang = request.TinhTrang?.Trim();
            entity.LichSuThayThe = request.LichSuThayThe?.Trim();
            entity.NgayCapNhat = request.NgayCapNhat ?? DateTime.Now;

            _context.ThietBiKhuVucs.Update(entity);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<ThietBiKhuVuc>
            {
                Status = true,
                Message = "Cap nhat thiet bi thanh cong.",
                Data = entity
            });
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.ThietBiKhuVucs.FindAsync(id);
            if (entity == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Khong tim thay thiet bi.",
                    Data = null
                });
            }

            var scopedPhanXuongIds = GetScopedPhanXuongIds();
            if (scopedPhanXuongIds.Count > 0 && !scopedPhanXuongIds.Contains(entity.PhanXuongId))
            {
                return Forbid();
            }

            _context.ThietBiKhuVucs.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Xoa thiet bi thanh cong.",
                Data = null
            });
        }

        [Authorize]
        [HttpGet("statistics")]
        public async Task<IActionResult> Statistics([FromQuery] int? phanXuongId = null)
        {
            var query = _context.ThietBiKhuVucs
                .Include(x => x.PhanXuong)
                .AsQueryable();

            var scopedPhanXuongIds = GetScopedPhanXuongIds();
            if (scopedPhanXuongIds.Count > 0)
            {
                query = query.Where(x => scopedPhanXuongIds.Contains(x.PhanXuongId));
            }
            else if (phanXuongId.HasValue)
            {
                query = query.Where(x => x.PhanXuongId == phanXuongId.Value);
            }

            var raw = await query
                .GroupBy(x => new { x.PhanXuongId, x.PhanXuong.TenPhanXuong })
                .Select(g => new
                {
                    g.Key.PhanXuongId,
                    g.Key.TenPhanXuong,
                    TongBanGhi = g.Count(),
                    TongSoLuong = g.Sum(x => x.SoLuong),
                    ThietBiMang = g.Where(x => x.NhomThietBi == "ThietBiMang").Sum(x => x.SoLuong),
                    MayTinhVanHanh = g.Where(x => x.NhomThietBi == "MayTinhVanHanh").Sum(x => x.SoLuong),
                    ThietBiCCTV = g.Where(x => x.NhomThietBi == "ThietBiCCTV").Sum(x => x.SoLuong)
                })
                .OrderBy(x => x.PhanXuongId)
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Thong ke thiet bi theo khu vuc.",
                Data = raw
            });
        }

        private static bool IsValidRequest(ThietBiKhuVucValidation request, out string message)
        {
            if (request.PhanXuongId <= 0)
            {
                message = "Phan xuong khong hop le.";
                return false;
            }

            if (string.IsNullOrWhiteSpace(request.NhomThietBi))
            {
                message = "Nhom thiet bi la bat buoc.";
                return false;
            }

            var normalizedNhom = NormalizeNhom(request.NhomThietBi);
            if (!AllowedNhomThietBi.Contains(normalizedNhom))
            {
                message = "Nhom thiet bi khong hop le.";
                return false;
            }

            request.NhomThietBi = normalizedNhom;

            if (string.IsNullOrWhiteSpace(request.TenVatTu))
            {
                message = "Ten vat tu la bat buoc.";
                return false;
            }

            if (string.IsNullOrWhiteSpace(request.ViTri))
            {
                message = "Vi tri la bat buoc.";
                return false;
            }

            if (request.SoLuong < 0)
            {
                message = "So luong khong hop le.";
                return false;
            }

            message = string.Empty;
            return true;
        }

        private static string NormalizeNhom(string value)
        {
            var normalized = value.Trim();
            if (normalized.Equals("Thiet bi mang", StringComparison.OrdinalIgnoreCase)) return "ThietBiMang";
            if (normalized.Equals("May tinh van hanh", StringComparison.OrdinalIgnoreCase)) return "MayTinhVanHanh";
            if (normalized.Equals("Thiet bi CCTV", StringComparison.OrdinalIgnoreCase)) return "ThietBiCCTV";
            return normalized;
        }

        private IReadOnlyCollection<int> GetScopedPhanXuongIds()
        {
            if (UserAccessHelper.IsAdmin(User))
            {
                return Array.Empty<int>();
            }

            return UserAccessHelper.GetPhanXuongIds(User);
        }
    }
}
