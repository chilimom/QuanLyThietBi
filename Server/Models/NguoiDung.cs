using System.Collections.Generic;

namespace Server.Models;

public partial class NguoiDung
{
    public int IdnguoiDung { get; set; }
    public string? TenDangNhap { get; set; }
    public string? MatKhau { get; set; }
    public string? HoTen { get; set; }
    public string? Email { get; set; }
    public string? SoDienThoai { get; set; }
    public string? DiaChi { get; set; }
    public int? NhanVienId { get; set; }
    public int? Idquyen { get; set; }
    public int? IsLock { get; set; }
    public int? PhanXuongId { get; set; }

    public virtual NhanVien? NhanVien { get; set; }
    public virtual PhanXuong? PhanXuong { get; set; }
    public virtual ICollection<NguoiDungPhanXuong> NguoiDungPhanXuongs { get; set; } = new List<NguoiDungPhanXuong>();
}
