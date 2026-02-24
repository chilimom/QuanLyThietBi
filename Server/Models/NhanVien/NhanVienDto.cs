namespace Server.Models
{
    public class NhanVienDto
    {
        public int Id { get; set; }
        public string? MaNv { get; set; }
        public string? HoTen { get; set; }
        public string? HoTenKhongDau { get; set; }
        public string? DiaChi { get; set; }
        public string? TenPhongBan { get; set;}
        public DateOnly? NgayVaoLam { get; set; }
        public int? IdPhongBan { get; set; }
    }
}