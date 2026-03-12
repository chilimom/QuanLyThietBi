using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Helpers;
using Server.Models;
using System.Globalization;
using System.Text;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/thietbikhuvuc")]
    public class ThietBiKhuVucController : ControllerBase
    {
        private readonly QLThietBiContext _context;

        public ThietBiKhuVucController(QLThietBiContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("groups")]
        public async Task<IActionResult> GetGroups()
        {
            var usageMap = await _context.ThietBiKhuVucs
                .GroupBy(x => x.NhomThietBi)
                .Select(g => new { MaNhom = g.Key, SoThietBi = g.Count() })
                .ToDictionaryAsync(x => x.MaNhom, x => x.SoThietBi);

            var groups = await _context.NhomThietBiKhuVucs
                .AsNoTracking()
                .OrderBy(x => x.TenNhom)
                .Select(x => new NhomThietBiKhuVucValidation
                {
                    Id = x.Id,
                    MaNhom = x.MaNhom,
                    TenNhom = x.TenNhom
                })
                .ToListAsync();

            foreach (var group in groups)
            {
                group.SoThietBi = usageMap.TryGetValue(group.MaNhom ?? string.Empty, out var count) ? count : 0;
            }

            return Ok(new ApiResponse<List<NhomThietBiKhuVucValidation>>
            {
                Status = true,
                Message = "Lay danh sach nhom thiet bi thanh cong.",
                Data = groups
            });
        }

        [Authorize(Roles = "4")]
        [HttpPost("groups")]
        public async Task<IActionResult> CreateGroup([FromBody] NhomThietBiKhuVucValidation request)
        {
            if (!TryNormalizeGroupInput(request, out var maNhom, out var tenNhom, out var message))
            {
                return Ok(new ApiResponse<object> { Status = false, Message = message, Data = null });
            }

            var existed = await _context.NhomThietBiKhuVucs.AnyAsync(x =>
                x.MaNhom.ToLower() == maNhom.ToLower() ||
                x.TenNhom.ToLower() == tenNhom.ToLower());

            if (existed)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Nhom thiet bi da ton tai.",
                    Data = null
                });
            }

            var entity = new NhomThietBiKhuVuc
            {
                MaNhom = maNhom,
                TenNhom = tenNhom
            };

            _context.NhomThietBiKhuVucs.Add(entity);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<NhomThietBiKhuVucValidation>
            {
                Status = true,
                Message = "Them nhom thiet bi thanh cong.",
                Data = new NhomThietBiKhuVucValidation
                {
                    Id = entity.Id,
                    MaNhom = entity.MaNhom,
                    TenNhom = entity.TenNhom,
                    SoThietBi = 0
                }
            });
        }

        [Authorize(Roles = "4")]
        [HttpPut("groups/{id}")]
        public async Task<IActionResult> UpdateGroup(int id, [FromBody] NhomThietBiKhuVucValidation request)
        {
            var entity = await _context.NhomThietBiKhuVucs.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Khong tim thay nhom thiet bi.",
                    Data = null
                });
            }

            if (!TryNormalizeGroupInput(request, out _, out var tenNhom, out var message))
            {
                return Ok(new ApiResponse<object> { Status = false, Message = message, Data = null });
            }

            var duplicated = await _context.NhomThietBiKhuVucs.AnyAsync(x =>
                x.Id != id &&
                x.TenNhom.ToLower() == tenNhom.ToLower());

            if (duplicated)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Ten nhom thiet bi da ton tai.",
                    Data = null
                });
            }

            entity.TenNhom = tenNhom;
            await _context.SaveChangesAsync();

            var soThietBi = await _context.ThietBiKhuVucs.CountAsync(x => x.NhomThietBi == entity.MaNhom);

            return Ok(new ApiResponse<NhomThietBiKhuVucValidation>
            {
                Status = true,
                Message = "Cap nhat nhom thiet bi thanh cong.",
                Data = new NhomThietBiKhuVucValidation
                {
                    Id = entity.Id,
                    MaNhom = entity.MaNhom,
                    TenNhom = entity.TenNhom,
                    SoThietBi = soThietBi
                }
            });
        }

        [Authorize(Roles = "4")]
        [HttpDelete("groups/{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var entity = await _context.NhomThietBiKhuVucs.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Khong tim thay nhom thiet bi.",
                    Data = null
                });
            }

            var usageCount = await _context.ThietBiKhuVucs.CountAsync(x => x.NhomThietBi == entity.MaNhom);
            if (usageCount > 0)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Khong the xoa nhom dang duoc su dung.",
                    Data = null
                });
            }

            _context.NhomThietBiKhuVucs.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Xoa nhom thiet bi thanh cong.",
                Data = null
            });
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ThietBiKhuVucValidation request)
        {
            var validation = await ValidateRequestAsync(request);
            if (!validation.IsValid)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = validation.Message,
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

            if (phanXuongId.HasValue)
            {
                query = query.Where(x => x.PhanXuongId == phanXuongId.Value);
            }

            if (!string.IsNullOrWhiteSpace(nhomThietBi))
            {
                var normalizedNhom = await ResolveNhomThietBiCodeAsync(nhomThietBi);
                if (string.IsNullOrWhiteSpace(normalizedNhom))
                {
                    return Ok(new ApiResponsePagination<List<ThietBiKhuVucValidation>>
                    {
                        Status = true,
                        Message = "Lay danh sach thiet bi khu vuc thanh cong.",
                        Data = new List<ThietBiKhuVucValidation>(),
                        TotalItems = 0,
                        Page = page,
                        Limit = limit,
                        TotalPages = 0
                    });
                }

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
            var validation = await ValidateRequestAsync(request);
            if (!validation.IsValid)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = validation.Message,
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

            if (phanXuongId.HasValue)
            {
                query = query.Where(x => x.PhanXuongId == phanXuongId.Value);
            }

            var nhomLabelMap = await _context.NhomThietBiKhuVucs
                .AsNoTracking()
                .ToDictionaryAsync(x => x.MaNhom, x => x.TenNhom);

            var rows = await query
                .GroupBy(x => new { x.PhanXuongId, x.PhanXuong.TenPhanXuong, x.NhomThietBi })
                .Select(g => new
                {
                    g.Key.PhanXuongId,
                    g.Key.TenPhanXuong,
                    g.Key.NhomThietBi,
                    TongBanGhi = g.Count(),
                    TongSoLuong = g.Sum(x => x.SoLuong)
                })
                .ToListAsync();

            var data = rows
                .GroupBy(x => new { x.PhanXuongId, x.TenPhanXuong })
                .Select(g => new
                {
                    g.Key.PhanXuongId,
                    g.Key.TenPhanXuong,
                    TongBanGhi = g.Sum(x => x.TongBanGhi),
                    TongSoLuong = g.Sum(x => x.TongSoLuong),
                    TongTheoNhom = g
                        .OrderBy(x => nhomLabelMap.TryGetValue(x.NhomThietBi, out var tenNhom) ? tenNhom : x.NhomThietBi)
                        .Select(x => new
                        {
                            MaNhom = x.NhomThietBi,
                            TenNhom = nhomLabelMap.TryGetValue(x.NhomThietBi, out var tenNhom) ? tenNhom : x.NhomThietBi,
                            TongBanGhi = x.TongBanGhi,
                            TongSoLuong = x.TongSoLuong
                        })
                        .ToList()
                })
                .OrderBy(x => x.PhanXuongId)
                .ToList();

            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Thong ke thiet bi theo khu vuc.",
                Data = data
            });
        }

        private async Task<(bool IsValid, string Message)> ValidateRequestAsync(ThietBiKhuVucValidation request)
        {
            if (request.PhanXuongId <= 0)
            {
                return (false, "Phan xuong khong hop le.");
            }

            if (string.IsNullOrWhiteSpace(request.NhomThietBi))
            {
                return (false, "Nhom thiet bi la bat buoc.");
            }

            var normalizedNhom = await ResolveNhomThietBiCodeAsync(request.NhomThietBi);
            if (string.IsNullOrWhiteSpace(normalizedNhom))
            {
                return (false, "Nhom thiet bi khong hop le.");
            }

            request.NhomThietBi = normalizedNhom;

            if (string.IsNullOrWhiteSpace(request.TenVatTu))
            {
                return (false, "Ten vat tu la bat buoc.");
            }

            if (string.IsNullOrWhiteSpace(request.ViTri))
            {
                return (false, "Vi tri la bat buoc.");
            }

            if (request.SoLuong < 0)
            {
                return (false, "So luong khong hop le.");
            }

            return (true, string.Empty);
        }

        private async Task<string?> ResolveNhomThietBiCodeAsync(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var normalizedValue = value.Trim();

            var group = await _context.NhomThietBiKhuVucs
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.MaNhom.ToLower() == normalizedValue.ToLower() ||
                    x.TenNhom.ToLower() == normalizedValue.ToLower());

            return group?.MaNhom;
        }

        private static bool TryNormalizeGroupInput(
            NhomThietBiKhuVucValidation request,
            out string maNhom,
            out string tenNhom,
            out string message)
        {
            tenNhom = request.TenNhom?.Trim() ?? string.Empty;
            maNhom = string.IsNullOrWhiteSpace(request.MaNhom)
                ? GenerateGroupCode(tenNhom)
                : GenerateGroupCode(request.MaNhom);

            if (string.IsNullOrWhiteSpace(tenNhom))
            {
                message = "Ten nhom thiet bi la bat buoc.";
                return false;
            }

            if (string.IsNullOrWhiteSpace(maNhom))
            {
                message = "Khong the tao ma nhom thiet bi hop le.";
                return false;
            }

            request.TenNhom = tenNhom;
            request.MaNhom = maNhom;
            message = string.Empty;
            return true;
        }

        private static string GenerateGroupCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            var normalized = value.Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder();
            var capitalizeNext = true;

            foreach (var ch in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(ch) == UnicodeCategory.NonSpacingMark)
                {
                    continue;
                }

                if (char.IsLetterOrDigit(ch))
                {
                    builder.Append(capitalizeNext
                        ? char.ToUpperInvariant(ch)
                        : char.ToLowerInvariant(ch));
                    capitalizeNext = false;
                }
                else
                {
                    capitalizeNext = true;
                }
            }

            return builder.ToString();
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
