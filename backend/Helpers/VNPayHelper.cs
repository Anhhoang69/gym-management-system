using System.Net;
using System.Security.Cryptography;
using System.Text;
using backend.Options;
using Microsoft.AspNetCore.Http;

namespace backend.Helpers;

/// <summary>
/// Static helper xây dựng và xác thực chữ ký HMAC-SHA512 với VNPay v2.1.0.
/// Spec: hash data = "key=WebUtility.UrlEncode(value)&..." (spaces → '+', giống PHP urlencode).
/// </summary>
public static class VNPayHelper
{
    // ── Build Payment URL ──────────────────────────────────────────────────

    public static string BuildPaymentUrl(
        Guid invoiceId,
        string txnRef,
        string orderInfo,
        decimal amount,
        string clientIp,
        VNPayOptions opts)
    {
        var now = DateTime.UtcNow.AddHours(7); // VNPay dùng GMT+7

        // IPv6-mapped IPv4 (::ffff:x.x.x.x) → lấy phần IPv4
        var safeIp = ExtractIpv4(clientIp);

        // orderInfo chỉ ASCII để tránh encoding edge cases
        var safeOrderInfo = RemoveDiacritics(orderInfo);

        var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"]    = opts.Version,
            ["vnp_Command"]    = opts.Command,
            ["vnp_TmnCode"]    = opts.TmnCode,
            ["vnp_Amount"]     = ((long)(amount * 100)).ToString(),
            ["vnp_CurrCode"]   = opts.CurrencyCode,
            ["vnp_TxnRef"]     = txnRef,
            ["vnp_OrderInfo"]  = safeOrderInfo,
            ["vnp_OrderType"]  = "other",
            ["vnp_Locale"]     = opts.Locale,
            ["vnp_ReturnUrl"]  = opts.ReturnUrl,
            ["vnp_IpAddr"]     = safeIp,
            ["vnp_CreateDate"] = now.ToString("yyyyMMddHHmmss"),
            ["vnp_ExpireDate"] = now.AddMinutes(opts.TimeoutMinutes).ToString("yyyyMMddHHmmss"),
        };

        // Hash data: WebUtility.UrlEncode → spaces thành '+' (chuẩn VNPay, giống PHP/Java)
        var rawHash = BuildHashData(vnpParams);
        var secureHash = HmacSha512(opts.HashSecret, rawHash);

        // URL: cùng encoding với hash
        var query = new StringBuilder();
        foreach (var (k, v) in vnpParams)
            query.Append($"&{k}={WebUtility.UrlEncode(v)}");

        query.Append($"&vnp_SecureHash={secureHash}");

        return $"{opts.BaseUrl}?{query.ToString().TrimStart('&')}";
    }

    /// <summary>Trả raw hash string để log debug.</summary>
    public static string GetRawHashData(SortedDictionary<string, string> vnpParams)
        => BuildHashData(vnpParams);

    // ── Validate Signature ────────────────────────────────────────────────
    public static bool ValidateSignature(IQueryCollection query, string hashSecret, Microsoft.Extensions.Logging.ILogger? logger = null)
    {
        var receivedHash = query["vnp_SecureHash"].ToString();
        if (string.IsNullOrEmpty(receivedHash))
        {
            logger?.LogWarning("VNPAY VALIDATE | vnp_SecureHash is empty or missing.");
            return false;
        }

        var vnpParams = GetSortedParams(query, exclude: ["vnp_SecureHash", "vnp_SecureHashType"]);
        var rawHash = BuildHashData(vnpParams);
        var expectedHash = HmacSha512(hashSecret, rawHash);

        logger?.LogInformation("VNPAY VALIDATE | ReceivedHash: {ReceivedHash}", receivedHash);
        logger?.LogInformation("VNPAY VALIDATE | ExpectedHash: {ExpectedHash}", expectedHash);
        logger?.LogInformation("VNPAY VALIDATE | RawHashData:  {RawHashData}", rawHash);

        bool isValid = string.Equals(expectedHash, receivedHash, StringComparison.OrdinalIgnoreCase);
        if (!isValid)
        {
            logger?.LogWarning("VNPAY VALIDATE | Signature mismatch!");
        }
        else
        {
            logger?.LogInformation("VNPAY VALIDATE | Signature matches successfully.");
        }

        return isValid;
    }

    // ── Parse params ─────────────────────────────────────────────────────

    public static Dictionary<string, string> GetAllParams(IQueryCollection query)
        => GetSortedParams(query).ToDictionary(kv => kv.Key, kv => kv.Value);

    // ── Private helpers ───────────────────────────────────────────────────

    private static SortedDictionary<string, string> GetSortedParams(
        IQueryCollection query,
        string[]? exclude = null)
    {
        var result = new SortedDictionary<string, string>(StringComparer.Ordinal);
        foreach (var key in query.Keys)
        {
            if (exclude != null && exclude.Contains(key)) continue;
            if (string.IsNullOrEmpty(key)) continue;
            if (!key.StartsWith("vnp_", StringComparison.OrdinalIgnoreCase)) continue; // ONLY VNPAY PARAMS
            var val = query[key].ToString();
            if (!string.IsNullOrEmpty(val))
                result[key] = val;
        }
        return result;
    }

    /// <summary>
    /// Hash data: key=WebUtility.UrlEncode(value)&...
    /// WebUtility.UrlEncode: space → '+' (chuẩn VNPay, giống PHP urlencode / Java URLEncoder).
    /// </summary>
    private static string BuildHashData(SortedDictionary<string, string> dict)
    {
        var sb = new StringBuilder();
        foreach (var (k, v) in dict)
        {
            if (sb.Length > 0) sb.Append('&');
            sb.Append(k);
            sb.Append('=');
            sb.Append(WebUtility.UrlEncode(v)); // space → '+'
        }
        return sb.ToString();
    }

    private static string HmacSha512(string key, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash).ToLower();
    }

    /// <summary>
    /// Lấy IPv4 từ địa chỉ IPv6-mapped (::ffff:x.x.x.x → x.x.x.x).
    /// VNPay không hỗ trợ IPv6.
    /// </summary>
    private static string ExtractIpv4(string ip)
    {
        if (string.IsNullOrEmpty(ip)) return "127.0.0.1";
        // IPv6-mapped IPv4: ::ffff:100.64.0.4
        const string prefix = "::ffff:";
        if (ip.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            return ip[prefix.Length..];
        // Loopback IPv6
        if (ip == "::1") return "127.0.0.1";
        return ip;
    }

    /// <summary>Bỏ dấu tiếng Việt → ASCII thuần.</summary>
    private static string RemoveDiacritics(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in normalized)
        {
            var cat = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (cat != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
