using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

using System.Reflection;
using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
namespace Server.Controllers
{
[ApiController]
[Route("api/[controller]")]
    public class QuyenController : ControllerBase
    {
        private readonly QLThietBiContext _context;

        public QuyenController(QLThietBiContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "4")]
        [HttpGet("getQuyen")]
        public async Task<ActionResult> GetAllQuyen()
        {
            var quyens = await _context.Quyens.ToListAsync();
            var response = new ApiResponse<List<Quyen>>
            {
                Status = true,
                Message = "Lấy danh sách quyền thành công!",
                Data = quyens
            };

            return Ok(response);
        }

        [Authorize(Roles = "4")]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Quyen model)
        {
            if (string.IsNullOrWhiteSpace(model.TenQuyen))
            {
                return Ok(new ApiResponse<object> { Status = false, Message = "Ten quyen khong hop le!" });
            }

            var exists = await _context.Quyens.AnyAsync(x => x.TenQuyen == model.TenQuyen.Trim());
            if (exists)
            {
                return Ok(new ApiResponse<object> { Status = false, Message = "Ten quyen da ton tai!" });
            }

            var nextId = (await _context.Quyens.MaxAsync(x => (int?)x.Idquyen) ?? 0) + 1;
            _context.Quyens.Add(new Quyen { Idquyen = nextId, TenQuyen = model.TenQuyen.Trim() });
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object> { Status = true, Message = "Them quyen thanh cong!" });
        }

        [Authorize(Roles = "4")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Quyen model)
        {
            var quyen = await _context.Quyens.FirstOrDefaultAsync(x => x.Idquyen == id);
            if (quyen == null)
            {
                return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay quyen!" });
            }

            if (string.IsNullOrWhiteSpace(model.TenQuyen))
            {
                return Ok(new ApiResponse<object> { Status = false, Message = "Ten quyen khong hop le!" });
            }

            var exists = await _context.Quyens.AnyAsync(x => x.TenQuyen == model.TenQuyen.Trim() && x.Idquyen != id);
            if (exists)
            {
                return Ok(new ApiResponse<object> { Status = false, Message = "Ten quyen da ton tai!" });
            }

            quyen.TenQuyen = model.TenQuyen.Trim();
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object> { Status = true, Message = "Cap nhat quyen thanh cong!" });
        }

        [Authorize(Roles = "4")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var quyen = await _context.Quyens.FirstOrDefaultAsync(x => x.Idquyen == id);
            if (quyen == null)
            {
                return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay quyen!" });
            }

            var used = await _context.NguoiDungs.AnyAsync(x => x.Idquyen == id);
            if (used)
            {
                return Ok(new ApiResponse<object> { Status = false, Message = "Quyen dang duoc gan cho tai khoan!" });
            }

            _context.Quyens.Remove(quyen);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object> { Status = true, Message = "Xoa quyen thanh cong!" });
        }
    }
}
