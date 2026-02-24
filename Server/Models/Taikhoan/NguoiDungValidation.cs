using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class NguoiDungValidation
    {
        public int IDNguoiDung { get; set; }
        public string? TenDangNhap { get; set; }
        public string? MatKhau { get; set; }
        public int NhanVienID { get; set; }
        public string? MaNV { get; set; }
        public string? HoTen { get; set; }
        public string? TenPB { get; set; }
        public int IDQuyen { get; set; }
        public string? TenQuyen { get; set; }
        public int IsLock { get; set; }
    }
}