using System.Collections.Generic;

namespace Server.Models;

public partial class KipLamViec
{
    public int IdKipLamViec { get; set; }

    public string? TenKipLamViec { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();
}

