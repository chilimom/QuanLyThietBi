using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class PhongBan
{
    public int IdphongBan { get; set; }

    public string? TenPhongBan { get; set; }

    public bool? Pchn { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();
}
