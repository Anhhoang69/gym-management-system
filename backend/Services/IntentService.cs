using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace backend.Services;

public class IntentService
{
    private static readonly Dictionary<string, string[]> IntentKeywords = new()
    {
        ["membership"] = new[]
        {
            "buoi", "session", "hop dong", "contract",
            "con lai", "remaining", "het han", "expire", "gia han",
            "membership", "the tap", "the thanh vien",
            "cua toi", "cua minh", "da dang ky", "da dang ki",
            "dang dung", "dang dung", "dang tap", "da mua"
        },
        ["package"] = new[]
        {
            "goi tap hien co", "cac goi tap", "goi tap tai gym",
            "bang gia", "price", "pricing", "nang cap goi",
            "upgrade goi", "mua goi", "dang ky goi", "goi basic",
            "goi premium", "goi elite", "goi trial"
        },
        ["schedule"] = new[]
        {
            "lich", "schedule", "lop hoc", "class", "booking",
            "dat lich", "thoi gian", "time", "gio", "hour",
            "hom nay", "today", "ngay mai", "tomorrow"
        },
        ["attendance"] = new[]
        {
            "diem danh", "checkin", "check-in", "check in",
            "lan tap", "so lan", "frequency", "attendance",
            "tuan nay", "this week"
        },
        ["fitness"] = new[]
        {
            "tap", "workout", "exercise", "bai tap",
            "co bap", "muscle", "giam can", "lose weight",
            "tang co", "build muscle", "cardio", "strength",
            "fitness", "gym", "diet", "nutrition", "dinh duong",
            "che do an", "protein", "calories", "training",
            "lap lich", "ke hoach", "tu van", "goi y"
        }
    };

    public string Detect(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return "general";

        var normalized = RemoveDiacritics(message.ToLower().Trim());

        // Score each intent by keyword matches
        var scores = new Dictionary<string, int>();

        foreach (var (intent, keywords) in IntentKeywords)
        {
            var score = keywords.Count(keyword => normalized.Contains(keyword));
            if (score > 0)
                scores[intent] = score;
        }

        if (scores.Count == 0)
            return "general";

        // Return intent with highest score
        return scores.OrderByDescending(x => x.Value).First().Key;
    }

    public bool IsPlanRequest(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return false;

        var normalized = RemoveDiacritics(message.ToLower().Trim());

        var planKeywords = new[]
        {
            // Lập lịch / kế hoạch tập
            "lap lich", "tao lich", "xay dung lich", "ke hoach tap",
            "tao plan", "plan tap", "workout plan", "full plan",
            "generate plan", "toan bo lich",
            // Dinh dưỡng / chế độ ăn
            "che do an", "nutrition plan", "ke hoach dinh duong",
            "thuc don", "menu an uong",
            // Gợi ý / tư vấn toàn diện
            "goi y lich", "tu van lich", "tu van ke hoach",
            "xay dung chuong trinh", "chuong trinh tap",
            // Mục tiêu cụ thể → thường cần plan
            "giam can", "tang co", "tang can", "giam mo",
            "muon giam", "muon tang", "can giam", "can tang",
            "giam beo", "dot mo", "can thep"
        };

        if (planKeywords.Any(k => normalized.Contains(k)))
            return true;

        // Ví dụ: "giảm 5kg trong 2 tháng", "tăng 3kg sau 1 tuần"
        if (Regex.IsMatch(normalized, @"\d+\s*kg"))
        {
            var goalVerbs = new[] { "giam", "tang", "dat", "thang", "tuan" };
            if (goalVerbs.Any(v => normalized.Contains(v)))
                return true;
        }

        return false;
    }

    private static string RemoveDiacritics(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();

        foreach (var c in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
