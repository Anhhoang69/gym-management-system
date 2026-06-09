using System.Security.Cryptography;
using System.Text;
using backend.Options;
using Microsoft.AspNetCore.Http;

namespace backend.Helpers;

/// <summary>
/// Static helper xây dựng và xác thực chữ ký HMAC-SHA512 với VNPay.
/// Không dùng DI — gọi trực tiếp từ VNPayService.
/// </summary>
public static class VNPayHelper
{
    // ── Build Payment URL ──────────────────────────────────────────────────

    /// <summary>
    /// Tạo redirect URL sang trang thanh toán VNPay.
    /// Params được sort theo alphabet, ký HMAC-SHA512, append vào query string.
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

        var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"]    = opts.Version,
            ["vnp_Command"]    = opts.Command,
            ["vnp_TmnCode"]    = opts.TmnCode,
            ["vnp_Amount"]     = ((long)(amount * 100)).ToString(),
            ["vnp_CurrCode"]   = opts.CurrencyCode,
            ["vnp_TxnRef"]     = txnRef,
            ["vnp_OrderInfo"]  = orderInfo,
            ["vnp_OrderType"]  = "billpayment",
            ["vnp_Locale"]     = opts.Locale,
            ["vnp_ReturnUrl"]  = opts.ReturnUrl,
            ["vnp_IpAddr"]     = clientIp,
            ["vnp_CreateDate"] = now.ToString("yyyyMMddHHmmss"),
            ["vnp_ExpireDate"] = now.AddMinutes(opts.TimeoutMinutes).ToString("yyyyMMddHHmmss"),
        };

        var rawHash = BuildRawData(vnpParams);
        var secureHash = HmacSha512(opts.HashSecret, rawHash);

        var query = new StringBuilder();
        foreach (var (k, v) in vnpParams)
            query.Append($"&{k}={Uri.EscapeDataString(v)}");

        query.Append($"&vnp_SecureHash={secureHash}");

        return $"{opts.BaseUrl}?{query.ToString().TrimStart('&')}";
    }

    // ── Validate Signature ────────────────────────────────────────────────

    /// <summary>
    /// Kiểm tra chữ ký HMAC-SHA512 của request IPN hoặc ReturnUrl từ VNPay.
    /// Loại vnp_SecureHash và vnp_SecureHashType khỏi dict trước khi ký.
    /// </summary>
    public static bool ValidateSignature(IQueryCollection query, string hashSecret)
    {
        var receivedHash = query["vnp_SecureHash"].ToString();
        if (string.IsNullOrEmpty(receivedHash)) return false;

        var vnpParams = GetSortedParams(query, exclude: new[] { "vnp_SecureHash", "vnp_SecureHashType" });
        var rawHash = BuildRawData(vnpParams);
        var expectedHash = HmacSha512(hashSecret, rawHash);

        return string.Equals(expectedHash, receivedHash, StringComparison.OrdinalIgnoreCase);
    }

    // ── Parse params ─────────────────────────────────────────────────────

    /// <summary>Lấy tất cả VNPay params từ query collection (trừ SecureHash) thành dict.</summary>
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

    private static string BuildRawData(SortedDictionary<string, string> dict)
    {
        var sb = new StringBuilder();
        foreach (var (k, v) in dict)
        {
            if (sb.Length > 0) sb.Append('&');
            sb.Append(k);
            sb.Append('=');
            sb.Append(v);
        }
        return sb.ToString();
    }

    private static string HmacSha512(string key, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash).ToLower();
    }
}
