using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Microsoft.AspNetCore.Authorization;
namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NhanVienController : ControllerBase
    {
        private readonly QLThietBiContext _context;

        public NhanVienController(QLThietBiContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "4")]
        [HttpPost("createNV")]
        public async Task<IActionResult> CreateNhanVien([FromBody] NhanVienDto request)
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
            var existingId = await _context.NhanViens.FirstOrDefaultAsync(nv => nv.Id == request.Id);
            if (existingId != null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = $"Nhân viên đã tồn tại!",
                    Data = null
                });
            }

            // Kiểm tra trùng mã nhân viên
            var existingNv = await _context.NhanViens
                .FirstOrDefaultAsync(nv => nv.MaNv == request.MaNv);

            if (existingNv != null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = $"Mã nhân viên '{request.MaNv}' đã tồn tại!",
                    Data = null
                });
            }

            //  Tạo mới
            var nhanVien = new NhanVien
            {
                Id = request.Id,
                MaNv = request.MaNv,
                HoTen = request.HoTen,
                HoTenKhongDau = request.HoTenKhongDau,
                DiaChi = request.DiaChi,
                NgayVaoLam = request.NgayVaoLam,
                IdphongBan = request.IdPhongBan,
                IdtinhTrangLv = 0
            };

            _context.NhanViens.Add(nhanVien);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<NhanVien>
            {
                Status = true,
                Message = "Thêm nhân viên thành công!",
                Data = nhanVien
            });
        }

        [Authorize(Roles = "4")]
        [HttpGet("getNV")]
        public async Task<IActionResult> GetAllNhanViens(
        [FromQuery] string? keyword = null,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string sortOrder = "asc")
        {
            var query = _context.NhanViens
                .AsNoTracking()
                // .Include(nv => nv.IdphongBanNavigation) // 
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
                });

            // Search (dịch sang SQL LIKE, chạy trên DB)
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var pat = $"%{keyword.Trim()}%";
                query = query.Where(x =>
                    EF.Functions.Like(x.HoTen ?? "", pat) ||
                    EF.Functions.Like(x.TenPhongBan ?? "", pat) ||
                    EF.Functions.Like(x.MaNv ?? "", pat) ||
                    EF.Functions.Like(x.DiaChi ?? "", pat) ||
                    EF.Functions.Like(x.HoTenKhongDau ?? "", pat)
                );
            }

            // Đếm sau khi lọc
            var total = await query.CountAsync();

            // Sort (đơn giản theo HoTen)
            bool asc = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase);
            query = asc
                ? query.OrderBy(x => x.HoTen).ThenBy(x => x.Id)
                : query.OrderByDescending(x => x.HoTen).ThenByDescending(x => x.Id);

            // Paging + materialize
            if (page < 1) page = 1;
            if (limit < 1) limit = 10;

            var data = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return Ok(new ApiResponsePagination<List<NhanVienDto>>
            {
                Status = true,
                Message = "Lấy danh sách nhân viên thành công!",
                Data = data,
                TotalItems = total,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling((double)total / limit)
            });
        }
        [Authorize(Roles = "4")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNhanVien(int id)
        {
            // 1. Kiểm tra nhân viên có tồn tại
            var nhanvien = await _context.NhanViens.FindAsync(id);
            if (nhanvien == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Không tìm thấy nhân viên.",
                    Data = null
                });
            }

            // 2. Kiểm tra nhân viên đã có tài khoản người dùng chưa
            var exitsNguoidung = await _context.NguoiDungs
                .AnyAsync(nd => nd.NhanVienId == id);

            if (exitsNguoidung)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Nhân viên đã có tài khoản",
                    Data = null
                });
            }

            // 3. Thực hiện xóa nhân viên
            _context.NhanViens.Remove(nhanvien);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Xóa nhân viên thành công!",
                Data = null
            });
        }

        [Authorize(Roles = "4")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateNhanVien(int id, [FromBody] NhanVienDto request)
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

            var nhanVien = await _context.NhanViens.FindAsync(id);
            if (nhanVien == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Không tìm thấy nhân viên.",
                    Data = null
                });
            }

            // Kiểm tra trùng mã nhân viên khác Id hiện tại
            var maNvDaTonTai = await _context.NhanViens
                .FirstOrDefaultAsync(nv => nv.MaNv == request.MaNv && nv.Id != id);
            if (maNvDaTonTai != null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = $"Mã nhân viên '{request.MaNv}' đã tồn tại!",
                    Data = null
                });
            }

            // Cập nhật thông tin
            nhanVien.MaNv = request.MaNv;
            nhanVien.HoTen = request.HoTen;
            nhanVien.HoTenKhongDau = request.HoTenKhongDau;
            nhanVien.DiaChi = request.DiaChi;
            nhanVien.NgayVaoLam = request.NgayVaoLam;
            nhanVien.IdphongBan = request.IdPhongBan;

            _context.NhanViens.Update(nhanVien);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<NhanVien>
            {
                Status = true,
                Message = "Cập nhật nhân viên thành công!",
                Data = nhanVien
            });
        }

    }
}