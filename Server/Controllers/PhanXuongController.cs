using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Helpers;
using Server.Models;
using Server.Models.PhanXuongDtos;

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

        [Authorize]
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var query = _context.PhanXuongs.AsQueryable();

            if (!UserAccessHelper.IsAdmin(User))
            {
                var assignedPhanXuongIds = UserAccessHelper.GetPhanXuongIds(User);
                if (assignedPhanXuongIds.Count == 0)
                {
                    return Forbid();
                }

                query = query.Where(x => assignedPhanXuongIds.Contains(x.PhanXuongId));
            }

            var data = await query
                .Select(x => new
                {
                    x.PhanXuongId,
                    x.TenPhanXuong
                })
                .ToListAsync();

            return Ok(data);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!UserAccessHelper.IsAdmin(User))
            {
                var assignedPhanXuongIds = UserAccessHelper.GetPhanXuongIds(User);
                if (!assignedPhanXuongIds.Contains(id))
                {
                    return Forbid();
                }
            }

            var px = await _context.PhanXuongs
                .Select(x => new
                {
                    x.PhanXuongId,
                    x.TenPhanXuong
                })
                .FirstOrDefaultAsync(x => x.PhanXuongId == id);

            if (px == null)
                return NotFound("Khong tim thay phan xuong");

            return Ok(px);
        }

        [HttpPost("create")]
        [Authorize(Roles = "4")]
        public async Task<IActionResult> Create([FromBody] CreatePhanXuongRequest model)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            if (string.IsNullOrWhiteSpace(model.TenPhanXuong))
                return BadRequest("Ten phan xuong khong duoc de trong");

            var phanXuong = new PhanXuong
            {
                TenPhanXuong = model.TenPhanXuong.Trim()
            };

            _context.PhanXuongs.Add(phanXuong);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = phanXuong.PhanXuongId }, new
            {
                status = true,
                message = "Them phan xuong thanh cong",
                data = new
                {
                    phanXuong.PhanXuongId,
                    phanXuong.TenPhanXuong
                }
            });
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "4")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePhanXuongRequest model)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var px = await _context.PhanXuongs.FindAsync(id);

            if (px == null)
                return NotFound("Khong tim thay phan xuong");

            if (string.IsNullOrWhiteSpace(model.TenPhanXuong))
                return BadRequest("Ten phan xuong khong duoc de trong");

            px.TenPhanXuong = model.TenPhanXuong.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = true,
                message = "Cap nhat thanh cong",
                data = new
                {
                    px.PhanXuongId,
                    px.TenPhanXuong
                }
            });
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "4")]
        public async Task<IActionResult> Delete(int id)
        {
            var px = await _context.PhanXuongs.FindAsync(id);

            if (px == null)
                return NotFound("Khong tim thay phan xuong");

            _context.PhanXuongs.Remove(px);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = true,
                message = "Xoa thanh cong"
            });
        }
    }
}
