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
    }
}