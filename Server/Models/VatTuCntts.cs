
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("VatTuBaoTri")] // ✅ đặt ngay trên class, không thụt vào
    public partial class VatTuCntt
    {
        public int Id { get; set; }

        public string? Order { get; set; }

        public string? Eq { get; set; }

        public string? MaVT { get; set; }

        public string? TenVT { get; set; }

        public string? DonVi { get; set; }

        public string? SoLuong { get; set; }

        public string? PrMua { get; set; }

        public DateTime? NgayTao { get; set; }

        public string? GhiChu { get; set; }
        public int PhanXuongId { get; set; }
        // Navigation
        public PhanXuong PhanXuong { get; set; }
    }
}
