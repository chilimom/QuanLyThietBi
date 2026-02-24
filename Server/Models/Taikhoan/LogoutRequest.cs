using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class LogoutRequest
    {
        public string? RefreshToken { get; set; }
    }
}