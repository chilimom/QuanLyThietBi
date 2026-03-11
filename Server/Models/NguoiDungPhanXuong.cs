namespace Server.Models;

public partial class NguoiDungPhanXuong
{
    public int NguoiDungId { get; set; }
    public int PhanXuongId { get; set; }

    public virtual NguoiDung NguoiDung { get; set; } = null!;
    public virtual PhanXuong PhanXuong { get; set; } = null!;
}
