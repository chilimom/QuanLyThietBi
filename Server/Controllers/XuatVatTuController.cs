using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using ClosedXML.Excel;
using Microsoft.JSInterop.Infrastructure;
using System;
using System.Text.Json;
namespace Server.Controllers;

using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class XuatVatTuController : ControllerBase
{
    private readonly QLThietBiContext _context;

    public XuatVatTuController(QLThietBiContext context)
    {
        _context = context;
    }

    // =========================
    // REQUEST CLASS (NỘI BỘ)
    // =========================
    public class XuatVatTuItem
    {
        public string MaVT { get; set; }
        public string TenVT { get; set; }
        public int SoLuong { get; set; }
        public string GhiChu { get; set; }
    }

    public class XuatVatTuBulkCreate
    {
        public string OrderNo { get; set; }
        public string EQ { get; set; }
        public List<XuatVatTuItem> VatTus { get; set; }
    }

    private static bool TryGetPropertyIgnoreCase(JsonElement element, string propertyName, out JsonElement value)
    {
        if (element.TryGetProperty(propertyName, out value))
            return true;

        var pascalName = char.ToUpperInvariant(propertyName[0]) + propertyName.Substring(1);
        if (element.TryGetProperty(pascalName, out value))
            return true;

        value = default;
        return false;
    }

    // =========================
    // POST: api/XuatVatTu/bulk
    // =========================
    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulk(XuatVatTuBulkCreate request)
    {
        if (request == null || request.VatTus == null || !request.VatTus.Any())
            return BadRequest("Danh sách vật tư trống");

        var entities = request.VatTus.Select(vt => new XuatVatTu
        {
            OrderNo = request.OrderNo,
            EQ = request.EQ,
            MaVT = vt.MaVT,
            TenVT = vt.TenVT,
            SoLuong = vt.SoLuong,
            GhiChu = vt.GhiChu
        }).ToList();

        _context.XuatVatTus.AddRange(entities);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            order = request.OrderNo,
            total = entities.Count
        });
    }

    // =========================
    // GET: api/XuatVatTu/order/{orderNo}
    // =========================
    [HttpGet("order/{orderNo}")]
    public async Task<IActionResult> GetByOrder(string orderNo)
    {
        var data = await _context.XuatVatTus
            .Where(x => x.OrderNo == orderNo)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                id = x.Id,               // ✅ THÊM
                maVT = x.MaVT,
                tenVT = x.TenVT,
                soLuong = x.SoLuong,
                ghiChu = x.GhiChu
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpPut("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateXuatVatTu(
    int id,
    [FromBody] JsonElement body
)
    {
        var entity = await _context.XuatVatTus
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null)
            return NotFound("Không tìm thấy vật tư xuất");

        // ✅ ĐỌC JSON ĐÚNG CÁCH
        if (TryGetPropertyIgnoreCase(body, "maVT", out var maVTProp))
            entity.MaVT = maVTProp.GetString();

        if (TryGetPropertyIgnoreCase(body, "tenVT", out var tenVTProp))
            entity.TenVT = tenVTProp.GetString();

        if (TryGetPropertyIgnoreCase(body, "soLuong", out var soLuongProp))
            entity.SoLuong = soLuongProp.GetInt32();

        if (TryGetPropertyIgnoreCase(body, "ghiChu", out var ghiChuProp))
            entity.GhiChu = ghiChuProp.GetString();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            id = entity.Id,
            maVT = entity.MaVT,
            tenVT = entity.TenVT,
            soLuong = entity.SoLuong,
            ghiChu = entity.GhiChu
        });
    }

    [HttpDelete("{id}")]
    [HttpDelete("delete/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteXuatVatTu(int id)
    {
        var entity = await _context.XuatVatTus
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null)
            return NotFound("Khong tim thay vat tu xuat");

        _context.XuatVatTus.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            id
        });
    }

}

