using System.Security.Cryptography;
using System.Text;
using backend.Options;
using Microsoft.AspNetCore.Http;

namespace backend.Helpers;

/// <summary>
/// Static helper xây dựng và xác thực chữ ký HMAC-SHA512 với VNPay v2.1.0.
/// Spec: raw hash = "key=UrlEncode(value)&key=UrlEncode(value)" (sort alphabetical).
/// </summary>
public static class VNPayHelper
{
    // ── Build Payment URL ──────────────────────────────────────────────────

    /// <summary>
    /// Tạo redirect URL sang trang thanh toán VNPay.
    /// Hash = HMAC-SHA512 trên chuỗi key=UrlEncode(value) (cùng encoding với query string).
    /// </summary>
    public static string BuildPaymentUrl(
        Guid invoiceId,
        string txnRef,
        string orderInfo,
        decimal amount,
        string clientIp,
        VNPayOptions opts)
    {
        var now = DateTime.UtcNow.AddHours(7); // VNPay dùng GMT+7

        // orderInfo chỉ dùng ASCII để tránh encoding mismatch
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
            ["vnp_IpAddr"]     = clientIp,
            ["vnp_CreateDate"] = now.ToString("yyyyMMddHHmmss"),
            ["vnp_ExpireDate"] = now.AddMinutes(opts.TimeoutMinutes).ToString("yyyyMMddHHmmss"),
        };

        // VNPay v2.1.0: raw hash = same encoding as query string
        var rawHash = BuildHashData(vnpParams);
        var secureHash = HmacSha512(opts.HashSecret, rawHash);

        // Build full URL
        var query = new StringBuilder();
        foreach (var (k, v) in vnpParams)
            query.Append($"&{k}={Uri.EscapeDataString(v)}");

        query.Append($"&vnp_SecureHash={secureHash}");

        return $"{opts.BaseUrl}?{query.ToString().TrimStart('&')}";
    }

    /// <summary>
    /// Trả về raw hash string (để log debug).
    /// </summary>
    public static string GetRawHashData(SortedDictionary<string, string> vnpParams)
        => BuildHashData(vnpParams);

    // ── Validate Signature ────────────────────────────────────────────────

    /// <summary>
    /// Kiểm tra chữ ký HMAC-SHA512 của request IPN hoặc ReturnUrl từ VNPay.
    /// ASP.NET Core tự decode query params → dùng lại UrlEncode để tính hash.
    /// </summary>
    public static bool ValidateSignature(IQueryCollection query, string hashSecret)
    {
        var receivedHash = query["vnp_SecureHash"].ToString();
        if (string.IsNullOrEmpty(receivedHash)) return false;

        var vnpParams = GetSortedParams(query, exclude: ["vnp_SecureHash", "vnp_SecureHashType"]);
        var rawHash = BuildHashData(vnpParams);
        var expectedHash = HmacSha512(hashSecret, rawHash);

        return string.Equals(expectedHash, receivedHash, StringComparison.OrdinalIgnoreCase);
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
            var val = query[key].ToString();
            if (!string.IsNullOrEmpty(val))
                result[key] = val;
        }
        return result;
    }

    /// <summary>
    /// Build raw hash string: key=UrlEncode(value)&key=UrlEncode(value)
    /// VNPay v2.1.0 yêu cầu dùng cùng encoding với query string để verify.
    /// </summary>
    private static string BuildHashData(SortedDictionary<string, string> dict)
    {
        var sb = new StringBuilder();
        foreach (var (k, v) in dict)
        {
            if (sb.Length > 0) sb.Append('&');
            sb.Append(k);
            sb.Append('=');
            sb.Append(Uri.EscapeDataString(v)); // SAME as query string encoding
        }
        return sb.ToString();
    }

    private static string HmacSha512(string key, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash).ToLower();
    }

    /// <summary>Remove diacritics (bỏ dấu tiếng Việt) để orderInfo luôn ASCII.</summary>
    private static string RemoveDiacritics(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in normalized)
        {
            var category = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
