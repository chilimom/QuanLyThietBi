using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;


namespace Server.Models
{
    [Table("XuatVatTu")]   // 🔥 MAP ĐÚNG TÊN BẢNG SQL
    public class XuatVatTu
    {
        public int Id { get; set; }
        public string OrderNo { get; set; }
        public string EQ { get; set; }
        public string MaVT { get; set; }
        public string TenVT { get; set; }
        public int SoLuong { get; set; }
        public string GhiChu { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
