using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToLamViecController : ControllerBase
{
    private readonly QLThietBiContext _context;

    public ToLamViecController(QLThietBiContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "4")]
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.ToLamViecs.AsNoTracking().OrderBy(x => x.TenToLamViec).ToListAsync();
        return Ok(new ApiResponse<List<ToLamViec>> { Status = true, Message = "Lay danh sach to lam viec thanh cong!", Data = data });
    }

    [Authorize(Roles = "4")]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] ToLamViec model)
    {
        if (string.IsNullOrWhiteSpace(model.TenToLamViec))
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten to lam viec khong hop le!" });
        }

        var name = model.TenToLamViec.Trim();
        var exists = await _context.ToLamViecs.AnyAsync(x => x.TenToLamViec == name);
        if (exists)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten to lam viec da ton tai!" });
        }

        _context.ToLamViecs.Add(new ToLamViec { TenToLamViec = name });
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Status = true, Message = "Them to lam viec thanh cong!" });
    }

    [Authorize(Roles = "4")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ToLamViec model)
    {
        var row = await _context.ToLamViecs.FirstOrDefaultAsync(x => x.IdToLamViec == id);
        if (row == null)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay to lam viec!" });
        }

        if (string.IsNullOrWhiteSpace(model.TenToLamViec))
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten to lam viec khong hop le!" });
        }

        var name = model.TenToLamViec.Trim();
        var exists = await _context.ToLamViecs.AnyAsync(x => x.TenToLamViec == name && x.IdToLamViec != id);
        if (exists)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten to lam viec da ton tai!" });
        }

        row.TenToLamViec = name;
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Status = true, Message = "Cap nhat to lam viec thanh cong!" });
    }

    [Authorize(Roles = "4")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var row = await _context.ToLamViecs.FirstOrDefaultAsync(x => x.IdToLamViec == id);
        if (row == null)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay to lam viec!" });
        }

        _context.ToLamViecs.Remove(row);
        await _context.SaveChangesAsync();
        return Ok(new ApiResponse<object> { Status = true, Message = "Xoa to lam viec thanh cong!" });
    }
}
