using System.Collections.Generic;

namespace Server.Models
{
    public partial class PhanXuong
    {
        public int PhanXuongId { get; set; }
        public string? TenPhanXuong { get; set; }

        public virtual ICollection<VatTuCntt> VatTuCntts { get; set; } = new List<VatTuCntt>();
        public virtual ICollection<ThietBiKhuVuc> ThietBiKhuVucs { get; set; } = new List<ThietBiKhuVuc>();
        public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
        public virtual ICollection<NguoiDungPhanXuong> NguoiDungPhanXuongs { get; set; } = new List<NguoiDungPhanXuong>();
    }
}
