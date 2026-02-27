using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Server.Models;
// using ClosedXML.Excel;

namespace Server.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class PhanXuongController : ControllerBase
    {
        private readonly QLThietBiContext _context;

        public PhanXuongController(QLThietBiContext context)
        {
            _context = context;
        }

        // ==========================
        // 1) GET ALL
        // ==========================
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.PhanXuongs
                .Select(x => new
                {
                    x.PhanXuongId,
                    x.TenPhanXuong
                })
                .ToListAsync();

            return Ok(data);  // React nhận thẳng array
        }

        // ==========================
        // 2) GET by ID
        // ==========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var px = await _context.PhanXuongs.FindAsync(id);

            if (px == null)
                return NotFound("Không tìm thấy Phân Xưởng");

            return Ok(px);
        }

        // ==========================
        // 3) CREATE
        // ==========================
        [HttpPost("create")]
        [Authorize(Roles = "4")]
        public async Task<IActionResult> Create([FromBody] PhanXuong model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Dữ liệu không hợp lệ!");

            if (string.IsNullOrWhiteSpace(model.TenPhanXuong))
                return BadRequest("Tên phân xưởng không được để trống!");

            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"INSERT INTO PhanXuong (TenPhanXuong) VALUES ({model.TenPhanXuong})"
            );
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = true,
                message = "Thêm Phân Xưởng thành công!"
            });
        }

        // ==========================
        // 4) UPDATE
        // ==========================
        [HttpPut("update/{id}")]
        [Authorize(Roles = "4")]
        public async Task<IActionResult> Update(int id, [FromBody] PhanXuong model)
        {
            var px = await _context.PhanXuongs.FindAsync(id);

            if (px == null)
                return NotFound("Không tìm thấy Phân Xưởng!");

            px.TenPhanXuong = model.TenPhanXuong;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = true,
                message = "Cập nhật thành công!"
            });
        }

        // ==========================
        // 5) DELETE
        // ==========================
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "4")]
        public async Task<IActionResult> Delete(int id)
        {
            var px = await _context.PhanXuongs.FindAsync(id);

            if (px == null)
                return NotFound("Không tìm thấy Phân Xưởng!");

            _context.PhanXuongs.Remove(px);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = true,
                message = "Xóa thành công!"
            });
        }
    }
}
