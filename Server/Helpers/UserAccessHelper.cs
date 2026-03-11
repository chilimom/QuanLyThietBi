using System.Security.Claims;

namespace Server.Helpers;

public static class UserAccessHelper
{
    public static bool IsAdmin(ClaimsPrincipal user)
    {
        return string.Equals(user.FindFirstValue(ClaimTypes.Role), "4", StringComparison.Ordinal);
    }

    public static IReadOnlyCollection<int> GetPhanXuongIds(ClaimsPrincipal user)
    {
        return user.FindAll(JwtHelper.PhanXuongClaimType)
            .Select(x => int.TryParse(x.Value, out var id) ? id : 0)
            .Where(x => x > 0)
            .Distinct()
            .ToArray();
    }

    public static int? GetPrimaryPhanXuongId(ClaimsPrincipal user)
    {
        return GetPhanXuongIds(user).FirstOrDefault();
    }
}
