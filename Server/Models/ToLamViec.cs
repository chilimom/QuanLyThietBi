using System.Collections.Generic;

namespace Server.Models;

public partial class ToLamViec
{
    public int IdToLamViec { get; set; }

    public string? TenToLamViec { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();
}

