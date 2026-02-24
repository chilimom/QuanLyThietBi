using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Microsoft.AspNetCore.Authorization;
namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
public class PhongBanController : ControllerBase
{
    private readonly QLThietBiContext _context;

    public PhongBanController(QLThietBiContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "4")]
    [HttpGet("getPB")]
    public async Task<ActionResult> GetAllPhongBan()
    {
        var phongbans = await _context.PhongBans.ToListAsync();
        var response = new ApiResponse<List<PhongBan>>
        {
            Status = true,
            Message = "Lấy danh sách phòng ban thành công!",
            Data = phongbans
        };

        return Ok(response);
    }
}
}