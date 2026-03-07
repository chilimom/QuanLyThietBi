using System;

namespace Server.Models
{
    public class ThietBiKhuVucValidation
    {
        public int Id { get; set; }
        public int PhanXuongId { get; set; }
        public string? TenPhanXuong { get; set; }
        public string? NhomThietBi { get; set; }
        public string? MaVatTu { get; set; }
        public string? TenVatTu { get; set; }
        public string? ViTri { get; set; }
        public int SoLuong { get; set; }
        public string? SerialNumber { get; set; }
        public string? TinhTrang { get; set; }
        public string? LichSuThayThe { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }
}
