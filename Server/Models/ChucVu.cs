using System.Collections.Generic;

namespace Server.Models;

public partial class ChucVu
{
    public int IdChucVu { get; set; }

    public string? TenChucVu { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();
}

