using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace backend.Services;


public class OpenAIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OpenAIService> _logger;

    private const string OpenAIEndpoint = "https://api.openai.com/v1/chat/completions";

    public OpenAIService(HttpClient httpClient, IConfiguration configuration, ILogger<OpenAIService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    private static string SystemPrompt => @"You are an AI fitness assistant integrated into a gym management system.

Capabilities:
- Answer fitness questions
- Suggest workout plans (weekly schedule with exercises, sets, reps)
- Suggest nutrition plans (meals, calories, macros)
- Use provided user data to personalize advice

Rules:
- Ask follow-up questions if missing info (age, weight, goal, experience level)
- Do NOT give medical advice
- Keep answers safe and evidence-based
- Respond in Vietnamese (tiếng Việt) by default
- Be encouraging and motivating

If the user asks for a full plan, return a structured JSON response:
{
  ""WorkoutPlan"": {
    ""Goal"": ""..."",
    ""DaysPerWeek"": 0,
    ""Schedule"": [
      {
        ""Day"": ""Thứ 2"",
        ""Focus"": ""Ngực + Vai"",
        ""Exercises"": [
          { ""Name"": ""..."", ""Sets"": 0, ""Reps"": ""..."", ""Rest"": ""..."" }
        ]
      }
    ]
  },
  ""NutritionAdvice"": {
    ""DailyCalories"": 0,
    ""Macros"": { ""Protein"": ""..g"", ""Carbs"": ""..g"", ""Fat"": ""..g"" },
    ""MealPlan"": [
      { ""Meal"": ""Bữa sáng"", ""Foods"": ""..."", ""Calories"": 0 }
    ]
  }
}

Otherwise, respond conversationally in plain text.";

    public async Task<string> ChatAsync(string userMessage, string userContext, List<ChatMessage>? history = null, bool isPlanRequest = false)
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        var model = _configuration["OpenAI:Model"] ?? "gpt-4o-mini";
        var maxTokens = int.TryParse(_configuration["OpenAI:MaxTokens"], out var mt) ? mt : 2000;

        // Plan requests need more tokens and stricter output
        if (isPlanRequest)
        {
            maxTokens = Math.Max(maxTokens, 3000);
        }

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogError("OpenAI API key is not configured");
            return "Hệ thống AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.";
        }

        try
        {
            var messages = new List<object>
            {
                new { role = "system", content = SystemPrompt },
                new { role = "system", content = $"Current user context:\n{userContext}" }
            };

            // Add chat history for context (last N messages)
            if (history != null)
            {
                foreach (var msg in history)
                {
                    messages.Add(new { role = msg.Role, content = msg.Content });
                }
            }

            // Add current user message
            if (isPlanRequest)
            {
                // Enforce JSON-only output for plan requests
                messages.Add(new { role = "user", content = userMessage + "\n\nIMPORTANT: Return ONLY valid JSON with \"WorkoutPlan\" and \"NutritionAdvice\" keys. Do NOT include any text, explanation, or markdown before or after the JSON. Start your response with { and end with }." });
            }
            else
            {
                messages.Add(new { role = "user", content = userMessage });
            }

            var requestBody = new
            {
                model,
                messages,
                max_tokens = maxTokens,
                temperature = isPlanRequest ? 0.3 : 0.7
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            _logger.LogInformation("Calling OpenAI API | Model: {Model} | MaxTokens: {MaxTokens} | MessageLength: {Length}",
                model, maxTokens, userMessage.Length);

            var response = await _httpClient.PostAsync(OpenAIEndpoint, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("OpenAI API error: {StatusCode} | Body: {Body}",
                    response.StatusCode, responseBody);
                return $"⚠️ Lỗi khi gọi AI (HTTP {(int)response.StatusCode}). Vui lòng thử lại sau.";
            }

            var result = JsonDocument.Parse(responseBody);
            var aiMessage = result.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            _logger.LogInformation("OpenAI response received | Length: {Length}", aiMessage?.Length ?? 0);

            return aiMessage ?? "Xin lỗi, tôi không thể trả lời lúc này.";
        }
        catch (TaskCanceledException)
        {
            _logger.LogWarning("OpenAI API request timed out");
            return "⚠️ Yêu cầu bị timeout. Vui lòng thử lại.";
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Network error when calling OpenAI API");
            return "⚠️ Lỗi kết nối đến AI. Vui lòng kiểm tra mạng và thử lại.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error when calling OpenAI API");
            return "⚠️ Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.";
        }
    }

    public class ChatMessage
    {
        public string Role { get; set; } = null!;
        public string Content { get; set; } = null!;
    }
}
