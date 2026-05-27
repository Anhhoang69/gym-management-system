# 🧠 AI Chat Assistant — Trợ lý Fitness AI

> **File liên quan:** `AIController.cs`, `AIService.cs`, `IntentService.cs`, `GymDataService.cs`, `OpenAIService.cs`
> **Models:** `ChatHistory.cs`, `AIRecommendation.cs`, `AIContextCache.cs`

---

## 1. Tổng quan module

Module AI Chat tích hợp OpenAI GPT-4o-mini để cung cấp trợ lý fitness cá nhân hóa cho hội viên. Hệ thống:

- Hiểu intent của user (membership, schedule, attendance, package, fitness)
- Trả lời từ dữ liệu hệ thống (không cần gọi AI) cho câu hỏi đơn giản
- Gọi OpenAI khi cần tư vấn chuyên sâu hoặc tạo workout/nutrition plan
- Lưu lịch sử chat và AI recommendations vào DB

**Vai trò:** Điểm khác biệt của hệ thống — "AI-powered gym management".

---

## 2. Luồng xử lý tổng quát

```
Member gửi tin nhắn
    ↓
AIService.HandleChatAsync()
    ↓
1. Lưu user message vào ChatHistory
    ↓
2. IntentService.Detect() → xác định intent
   IntentService.IsPlanRequest() → có cần generate plan không?
    ↓
3. Load user context (từ cache hoặc DB)
    ↓
4. Routing theo intent:
   - "membership" → GymDataService.GetMembershipInfoAsync() [DB query]
   - "schedule"   → GymDataService.GetScheduleInfoAsync() [DB query]
   - "attendance" → GymDataService.GetAttendanceInfoAsync() [DB query]
   - "package"    → GymDataService.GetPackageInfoAsync() [DB query]
   - "fitness" / isPlanRequest → OpenAI API call
    ↓
5. Nếu là plan request → TrySaveRecommendationAsync() (lưu vào DB)
    ↓
6. Lưu AI response vào ChatHistory
    ↓
7. Return { message, type: "text" | "json" }
```

---

## 3. Intent Detection (IntentService)

### Cơ chế hoạt động
```csharp
public string Detect(string message)
{
    var normalized = RemoveDiacritics(message.ToLower().Trim());
    // Loại bỏ dấu tiếng Việt: "điểm danh" → "diem danh"

    var scores = new Dictionary<string, int>();
    foreach (var (intent, keywords) in IntentKeywords)
    {
        var score = keywords.Count(keyword => normalized.Contains(keyword));
        if (score > 0) scores[intent] = score;
    }

    return scores.OrderByDescending(x => x.Value).First().Key;
    // Intent có nhiều keyword match nhất thắng
}
```

### Intent Keywords (thực tế trong code)
| Intent | Keywords mẫu |
|---|---|
| `membership` | "hop dong", "con lai", "het han", "the tap", "da mua" |
| `package` | "goi tap hien co", "bang gia", "mua goi", "goi premium" |
| `schedule` | "lich", "lop hoc", "booking", "hom nay", "ngay mai" |
| `attendance` | "diem danh", "checkin", "so lan", "tuan nay" |
| `fitness` | "tap", "workout", "bai tap", "giam can", "tang co", "protein" |

### IsPlanRequest — phân biệt "hỏi thông tin" vs "xin kế hoạch"
```csharp
var planKeywords = new[] {
    "lap lich", "ke hoach tap", "workout plan", "full plan",
    "che do an", "nutrition plan", "thuc don",
    "giam can", "tang co", "tang can", "giam mo",
    "muon giam", "muon tang", "can giam", "can tang"
};
// Regex: số + "kg" + goal verb → cũng là plan request
if (Regex.IsMatch(normalized, @"\d+\s*kg"))
    if (goalVerbs.Any(v => normalized.Contains(v))) return true;
```

**Tại sao cần `IsPlanRequest` riêng?**
> "Lịch tập" có thể = hỏi lịch class đã đặt (schedule intent, DB query) HOẶC = xin plan tập mới (fitness intent, OpenAI call). `IsPlanRequest` phân biệt trường hợp này:
```csharp
case "schedule":
    if (!isPlanRequest)
        return GymDataService.GetScheduleInfoAsync(); // Lịch class đã đặt
    goto case "fitness"; // Override → gọi OpenAI
```

---

## 4. OpenAI Integration (OpenAIService)

### System Prompt Strategy
```
You are an AI fitness assistant...
- Respond in Vietnamese (tiếng Việt) by default
- Do NOT give medical advice
- If user asks for full plan, return structured JSON:
  { "WorkoutPlan": {...}, "NutritionAdvice": {...} }
- Otherwise, respond conversationally in plain text
```

### Cấu trúc request tới OpenAI
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "[SystemPrompt]" },
    { "role": "system", "content": "Current user context:\n[userContext]" },
    // Lịch sử chat (tối đa 20 messages)
    { "role": "user", "content": "[prev user msg]" },
    { "role": "assistant", "content": "[prev AI msg]" },
    // Tin nhắn hiện tại
    { "role": "user", "content": "[current message]" }
  ],
  "max_tokens": 2000, // 3000 nếu plan request
  "temperature": 0.7  // 0.3 nếu plan request (deterministic hơn)
}
```

### Plan Request — strict JSON output
```csharp
if (isPlanRequest)
{
    // Enforce JSON-only output
    messages.Add(new {
        role = "user",
        content = userMessage + "\n\nIMPORTANT: Return ONLY valid JSON with " +
                  "\"WorkoutPlan\" and \"NutritionAdvice\" keys. " +
                  "Do NOT include any text before or after the JSON. " +
                  "Start your response with { and end with }."
    });
    maxTokens = Math.Max(maxTokens, 3000);
    temperature = 0.3; // More deterministic for JSON
}
```

---

## 5. Context Cache (GymDataService)

### Tại sao cần cache?
Mỗi chat request sẽ gọi DB để build user context (thông tin hội viên, gói tập, attendance...). Cache tránh N+1 DB queries.

### Cache logic
```csharp
private static readonly TimeSpan CacheTtl = TimeSpan.FromHours(6);

public async Task<string> GetCachedOrBuildContextAsync(Guid memberId)
{
    var cache = await _context.AIContextCaches.FirstOrDefaultAsync(c => c.MemberId == memberId);

    // Cache hit và còn tươi (< 6 giờ)
    if (cache != null && DateTime.UtcNow - cache.UpdatedAt < CacheTtl)
        return cache.CachedContext;

    // Cache miss hoặc stale → rebuild
    var freshContext = await BuildUserContextAsync(memberId);
    // Upsert cache
    ...
    return freshContext;
}
```

### User Context được build từ
```
User Profile:
- Name: [fullName]
- Age: [từ Birthday]
- Gender: [Male/Female]
- Current Package: [tên gói, tier, ngày hết hạn]
- Check-in last 30 days: [count] times (~[avg]/week)
- Upcoming booked classes: [count]
```
→ AI nhận context này để personalize câu trả lời.

---

## 6. Lưu AI Recommendations

Khi response là plan request, system parse JSON và lưu vào DB:
```csharp
private async Task TrySaveRecommendationAsync(Guid memberId, string intent, string aiResponse)
{
    var jsonStr = ExtractJson(aiResponse); // Smart extraction:
    // 1. Nếu response đã là JSON thuần → dùng trực tiếp
    // 2. Nếu có ```json ... ``` → extract
    // 3. Tìm { ... } đầu tiên trong text

    if (jsonStr != null)
    {
        var doc = JsonDocument.Parse(jsonStr);
        // Lấy WorkoutPlan.Goal để làm summary
        workoutPlan = doc.RootElement.GetProperty("WorkoutPlan").GetRawText();
        nutritionAdvice = doc.RootElement.GetProperty("NutritionAdvice").GetRawText();
    }

    // Lưu AIRecommendation dù parse fail hay pass
    _context.AIRecommendations.Add(new AIRecommendation {
        MemberId, Intent, Goal, RawJson, WorkoutPlan, NutritionAdvice
    });
}
```

### Bảng AIRecommendations
```
Id                  Guid PK
MemberId            Guid FK → Members
Intent              string ("fitness" | "schedule" | ...)
Goal                string? (extracted từ WorkoutPlan.Goal)
RawJson             string (full AI response)
WorkoutPlan         string? (JSON string của WorkoutPlan object)
NutritionAdvice     string? (JSON string của NutritionAdvice object)
CreatedAt           DateTime
```

---

## 7. Fallback & Error Handling

```csharp
// OpenAIService.cs
catch (TaskCanceledException)
    return "⚠️ Yêu cầu bị timeout. Vui lòng thử lại.";

catch (HttpRequestException ex)
    return "⚠️ Lỗi kết nối đến AI. Vui lòng kiểm tra mạng.";

// Nếu API key chưa cấu hình
if (string.IsNullOrWhiteSpace(apiKey))
    return "Hệ thống AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.";
```

TrySaveRecommendation wrapped trong try/catch riêng → lỗi parse không crash response.

---

## 8. Database liên quan

```
ChatHistories
├── Id           Guid PK
├── MemberId     Guid FK → Members (Cascade delete)
├── Role         string ("user" | "assistant")
├── Message      string
└── CreatedAt    DateTime

AIRecommendations
├── Id              Guid PK
├── MemberId        Guid FK → Members (Cascade)
├── Intent          string
├── Goal            string?
├── RawJson         string
├── WorkoutPlan     string?
└── NutritionAdvice string?

AIContextCaches
├── MemberId     Guid PK (1-1 với Member)
├── CachedContext string
└── UpdatedAt    DateTime
```

---

## 9. Câu hỏi phản biện thường gặp

**Q: Tại sao dùng OpenAI thay vì tự train model?**
> Train model riêng cần dữ liệu lớn, GPU, chuyên môn ML — vượt scope đồ án sinh viên. OpenAI GPT-4o-mini cung cấp chất lượng cao, hỗ trợ tiếng Việt tốt, chi phí thấp (~$0.15/1M input tokens). Phù hợp cho prototype và proof-of-concept.

**Q: AI có thể đưa ra lời khuyên sai không?**
> Có — đây là limitation của LLM. System prompt có "Do NOT give medical advice" và "Keep answers safe and evidence-based". Nhưng không thể 100% ngăn hallucination. Production solution: thêm disclaimer, human review cho plan quan trọng.

**Q: Intent detection keyword-based có đủ chính xác không?**
> Đủ cho scope hiện tại. Accuracy khoảng 80-90% với các câu hỏi thông thường. Điểm yếu: câu mơ hồ, từ lạ, tiếng Anh-Việt lẫn. Cải thiện: dùng embedding-based classification hoặc fine-tune classifier.

**Q: Tại sao giới hạn 20 messages lịch sử?**
> Mỗi message chiếm tokens trong OpenAI context. GPT-4o-mini có giới hạn context window ~128K tokens, nhưng chi phí tăng theo tokens. 20 messages là trade-off giữa context quality và cost.

**Q: Context cache 6 giờ có đủ fresh không?**
> Đủ cho dữ liệu ít thay đổi (gói tập, profile). Nếu cần invalidate ngay: `GymDataService.InvalidateCacheAsync()` được gọi khi contract activate, profile update. Có thể giảm xuống 1 giờ nếu cần.

**Q: JSON extraction robustness?**
> ExtractJson() có 3 fallback:
> 1. Response đã là JSON thuần → dùng ngay
> 2. Có markdown code fence ` ```json ``` ` → extract
> 3. Tìm brace matching `{ ... }` đầu tiên → extract
> Nếu đều fail → lưu raw response, WorkoutPlan = null.

**Q: Nếu OpenAI API down thì sao?**
> Fallback messages thân thiện trả về user. System không crash. Chat history vẫn được lưu. Gợi ý: thêm retry logic với exponential backoff.

**Q: Rate limiting với OpenAI?**
> Chưa có rate limit per-user. Production: thêm middleware giới hạn X requests/user/hour. Hoặc dùng Redis token bucket.

**Q: AI recommendation lưu để làm gì?**
> Member có thể xem lại lịch sử plan (GET /ai/recommendations). Staff có thể thấy member quan tâm gì để upsell. Data analytics về phổ biến của các loại plan.

**Q: Temperature 0.3 vs 0.7 có nghĩa gì?**
> Temperature điều chỉnh độ ngẫu nhiên. 0.7 = sáng tạo, đa dạng (phù hợp chat tự nhiên). 0.3 = deterministic, nhất quán (phù hợp JSON output — ít hallucinate structure).
