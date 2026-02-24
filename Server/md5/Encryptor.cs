// Helpers/Encryptor.cs
using System.Security.Cryptography;
using System.Text;

namespace Server.Helpers
{
    public static class Encryptor
    {
        public static string MD5Hash(string input)
        {
            using var md5 = MD5.Create();
            var inputBytes = Encoding.UTF8.GetBytes(input);
            var hashBytes = md5.ComputeHash(inputBytes);

            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
