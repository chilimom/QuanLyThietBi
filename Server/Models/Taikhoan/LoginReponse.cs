using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class LoginReponse
    {
        public string AccessToken { get; set; } = "";
        // public string RefreshToken { get; set; } = "";
        public string MaNv { get; set; } = "";
        public int? Role { get; set; } 
        public string? HoTen { get; set; }
    }
}