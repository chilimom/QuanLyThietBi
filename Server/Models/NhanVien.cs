using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class NhanVien
{
    public int Id { get; set; }

    public string? MaNv { get; set; }

    public string? HoTen { get; set; }

    public string? HoTenKhongDau { get; set; }

    public string? DiaChi { get; set; }

    public DateOnly? NgayVaoLam { get; set; }

    public int? IdphongBan { get; set; }

    public int? IdtinhTrangLv { get; set; }

    public virtual PhongBan? IdphongBanNavigation { get; set; }

    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
}
