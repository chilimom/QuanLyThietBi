using System;

namespace Server.Models
{
    public partial class ThietBiKhuVuc
    {
        public int Id { get; set; }
        public int PhanXuongId { get; set; }
        public string NhomThietBi { get; set; } = null!;
        public string? MaVatTu { get; set; }
        public string TenVatTu { get; set; } = null!;
        public string? ViTri { get; set; }
        public int SoLuong { get; set; }
        public string? SerialNumber { get; set; }
        public string? TinhTrang { get; set; }
        public string? LichSuThayThe { get; set; }
        public DateTime? NgayCapNhat { get; set; }

        public virtual PhanXuong PhanXuong { get; set; } = null!;
    }
}
