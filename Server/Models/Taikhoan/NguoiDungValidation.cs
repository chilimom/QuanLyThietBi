namespace Server.Models
{
    public class NguoiDungValidation
    {
        public int IDNguoiDung { get; set; }
        public string? TenDangNhap { get; set; }
        public string? MatKhau { get; set; }
        public string? HoTen { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        public string? AnhDaiDien { get; set; }
        public int IDQuyen { get; set; }
        public string? TenQuyen { get; set; }
        public int IsLock { get; set; }
        public int? PhanXuongId { get; set; }
        public string? TenPhanXuong { get; set; }
        public List<int> PhanXuongIds { get; set; } = new();
        public List<string> TenPhanXuongs { get; set; } = new();
    }
}
