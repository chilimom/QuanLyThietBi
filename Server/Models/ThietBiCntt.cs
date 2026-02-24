using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class ThietBiCntt
{
    public int Id { get; set; }

    public string? SerialNumber { get; set; }

    public string? ServiceTag { get; set; }

    public string? TenThietBi { get; set; }

    public string? LoaiThietBi { get; set; }

    public string? DonViSuDung { get; set; }

    public string? NguoiQuanLy { get; set; }

    public DateTime? NgayNhap { get; set; }

    public string? TrangThai { get; set; }
}
