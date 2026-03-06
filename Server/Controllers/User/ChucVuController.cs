using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChucVuController : ControllerBase
{
    private readonly QLThietBiContext _context;

    public ChucVuController(QLThietBiContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "4")]
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var data = await _context.ChucVus.AsNoTracking().OrderBy(x => x.TenChucVu).ToListAsync();
        return Ok(new ApiResponse<List<ChucVu>> { Status = true, Message = "Lay danh sach chuc vu thanh cong!", Data = data });
    }

    [Authorize(Roles = "4")]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] ChucVu model)
    {
        if (string.IsNullOrWhiteSpace(model.TenChucVu))
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten chuc vu khong hop le!" });
        }

        var name = model.TenChucVu.Trim();
        var exists = await _context.ChucVus.AnyAsync(x => x.TenChucVu == name);
        if (exists)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten chuc vu da ton tai!" });
        }

        _context.ChucVus.Add(new ChucVu { TenChucVu = name });
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Status = true, Message = "Them chuc vu thanh cong!" });
    }

    [Authorize(Roles = "4")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ChucVu model)
    {
        var row = await _context.ChucVus.FirstOrDefaultAsync(x => x.IdChucVu == id);
        if (row == null)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay chuc vu!" });
        }

        if (string.IsNullOrWhiteSpace(model.TenChucVu))
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten chuc vu khong hop le!" });
        }

        var name = model.TenChucVu.Trim();
        var exists = await _context.ChucVus.AnyAsync(x => x.TenChucVu == name && x.IdChucVu != id);
        if (exists)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Ten chuc vu da ton tai!" });
        }

        row.TenChucVu = name;
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Status = true, Message = "Cap nhat chuc vu thanh cong!" });
    }

    [Authorize(Roles = "4")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var row = await _context.ChucVus.FirstOrDefaultAsync(x => x.IdChucVu == id);
        if (row == null)
        {
            return Ok(new ApiResponse<object> { Status = false, Message = "Khong tim thay chuc vu!" });
        }

        _context.ChucVus.Remove(row);
        await _context.SaveChangesAsync();
        return Ok(new ApiResponse<object> { Status = true, Message = "Xoa chuc vu thanh cong!" });
    }
}
