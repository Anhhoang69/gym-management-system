using System.Globalization;
using System.Text;

namespace backend.Services;

public class IntentService
{
    private static readonly Dictionary<string, string[]> IntentKeywords = new()
    {
        ["membership"] = new[]
        {
            "buoi", "session", "goi tap", "hop dong", "contract",
            "con lai", "remaining", "het han", "expire", "gia han",
            "membership", "the tap", "the thanh vien"
        },
        ["package"] = new[]
        {
            "goi", "package", "bang gia", "price", "pricing",
            "nang cap", "upgrade", "dang ky", "register",
            "goi tap"
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
            "xay dung chuong trinh", "chuong trinh tap"
        };

        return planKeywords.Any(k => normalized.Contains(k));
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
