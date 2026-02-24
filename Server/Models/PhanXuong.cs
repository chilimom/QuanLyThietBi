
using System.Collections.Generic;

namespace Server.Models
{
    public partial class PhanXuong
    {
        public int PhanXuongId { get; set; }
        public string? TenPhanXuong { get; set; }

        // ✅ BẮT BUỘC PHẢI CÓ
        public virtual ICollection<VatTuCntt> VatTuCntts { get; set; }
            = new List<VatTuCntt>();
    }
}
