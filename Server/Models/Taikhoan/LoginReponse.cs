namespace Server.Models
{
    public class LoginReponse
    {
        public string AccessToken { get; set; } = "";
        public string MaNv { get; set; } = "";
        public int? Role { get; set; }
        public string? HoTen { get; set; }
        public int? PhanXuongId { get; set; }
        public string? TenPhanXuong { get; set; }
        public List<int> PhanXuongIds { get; set; } = new();
        public List<string> TenPhanXuongs { get; set; } = new();
    }
}
