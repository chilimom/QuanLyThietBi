using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class NguoiDung
{
    public int IdnguoiDung { get; set; }

    public string? TenDangNhap { get; set; }

    public string? MatKhau { get; set; }

    public int? NhanVienId { get; set; }

    public int? Idquyen { get; set; }

    public int? IsLock { get; set; }

    // public string? RefreshToken { get; set; }

    public virtual NhanVien? NhanVien { get; set; }
    
}
