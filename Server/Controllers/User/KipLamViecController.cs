using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KipLamViecController : ControllerBase
{
    private readonly QLThietBiContext _context;

    public KipLamViecController(QLThietBiContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "4")]
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.KipLamViecs.AsNoTracking().OrderBy(x => x.TenKipLamViec).ToListAsync();
        return Ok(new ApiResponse<List<KipLamViec>> { Status = true, Message = "Lay danh sach kip lam viec thanh cong!", Data = data });
    }

    [Authorize(Roles = "4")]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] KipLamViec model)
    {
        if (string.IsNullOrWhiteSpace(model.TenKipLamViec))
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten kip lam viec khong hop le!" });
        }

        var name = model.TenKipLamViec.Trim();
        var exists = await _context.KipLamViecs.AnyAsync(x => x.TenKipLamViec == name);
        if (exists)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten kip lam viec da ton tai!" });
        }

        _context.KipLamViecs.Add(new KipLamViec { TenKipLamViec = name });
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Status = true, Message = "Them kip lam viec thanh cong!" });
    }

    [Authorize(Roles = "4")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] KipLamViec model)
    {
        var row = await _context.KipLamViecs.FirstOrDefaultAsync(x => x.IdKipLamViec == id);
        if (row == null)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay kip lam viec!" });
        }

        if (string.IsNullOrWhiteSpace(model.TenKipLamViec))
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten kip lam viec khong hop le!" });
        }

        var name = model.TenKipLamViec.Trim();
        var exists = await _context.KipLamViecs.AnyAsync(x => x.TenKipLamViec == name && x.IdKipLamViec != id);
        if (exists)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten kip lam viec da ton tai!" });
        }

        row.TenKipLamViec = name;
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Status = true, Message = "Cap nhat kip lam viec thanh cong!" });
    }

    [Authorize(Roles = "4")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var row = await _context.KipLamViecs.FirstOrDefaultAsync(x => x.IdKipLamViec == id);
        if (row == null)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay kip lam viec!" });
        }

        _context.KipLamViecs.Remove(row);
        await _context.SaveChangesAsync();
        return Ok(new ApiResponse<object> { Status = true, Message = "Xoa kip lam viec thanh cong!" });
    }
}
