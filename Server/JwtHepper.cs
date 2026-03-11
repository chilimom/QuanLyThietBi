using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public static class JwtHelper
{
    public const string PhanXuongClaimType = "phan_xuong_id";

    public static string GenerateToken(string manv, int role, IEnumerable<int>? phanXuongIds, string secretKey, string issuer, int minutes = 480)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, manv),
            new Claim(ClaimTypes.Role, role.ToString())
        };

        if (phanXuongIds != null)
        {
            foreach (var phanXuongId in phanXuongIds.Distinct())
            {
                claims.Add(new Claim(PhanXuongClaimType, phanXuongId.ToString()));
            }
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer,
            issuer,
            claims,
            expires: DateTime.UtcNow.AddMinutes(minutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }
}
