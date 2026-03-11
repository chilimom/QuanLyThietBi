using System.ComponentModel.DataAnnotations;

namespace Server.Models.PhanXuongDtos
{
    public class CreatePhanXuongRequest
    {
        [Required]
        public string? TenPhanXuong { get; set; }
    }
}
