using System.ComponentModel.DataAnnotations;

namespace Server.Models.PhanXuongDtos
{
    public class UpdatePhanXuongRequest
    {
        [Required]
        public string? TenPhanXuong { get; set; }
    }
}
