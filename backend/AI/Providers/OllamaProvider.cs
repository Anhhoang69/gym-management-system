using System.Text;
using System.Text.Json;
using backend.AI.Core;

namespace backend.AI.Providers;

/// <summary>
/// Ollama local model provider — enables offline demo without API keys.
/// Supports tool calling for models that implement it (llama3.1+).
/// Falls back to plain text if the model doesn't return tool_calls.
/// </summary>
public class OllamaProvider : ILLMProvider
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OllamaProvider> _logger;

    public string ProviderName => "Ollama";

    public OllamaProvider(HttpClient httpClient, IConfiguration configuration, ILogger<OllamaProvider> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LLMResponse> ChatAsync(LLMRequest request, CancellationToken ct = default)
    {
        var baseUrl = _configuration["AI:Ollama:BaseUrl"] ?? "http://localhost:11434";
        var model = _configuration["AI:Ollama:Model"] ?? "llama3.2";

        try
        {
            var messages = request.Messages.Select(m => new { role = m.Role, content = m.Content }).ToList();

            object requestBody;

            if (request.Tools != null && request.Tools.Count > 0)
            {
                var ollamaTools = request.Tools.Select(t => new
                {
                    type = "function",
                    function = new
                    {
                        name = t.Name,
                        description = t.Description,
                        parameters = t.InputSchema
                    }
                }).ToList();

                requestBody = new { model, messages, tools = ollamaTools, stream = false };
            }
            else
            {
                requestBody = new { model, messages, stream = false };
            }

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _logger.LogInformation("OllamaProvider | Model: {Model} | BaseUrl: {Url}", model, baseUrl);

            var response = await _httpClient.PostAsync($"{baseUrl}/api/chat", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("OllamaProvider error: {Status} | {Body}", response.StatusCode, err);
                return new LLMResponse("⚠️ Ollama không phản hồi. Vui lòng kiểm tra dịch vụ local.", null);
            }

            var responseBody = await response.Content.ReadAsStringAsync(ct);
            var result = JsonDocument.Parse(responseBody);
            var message = result.RootElement.GetProperty("message");

            // Check for tool_calls (Ollama format mirrors OpenAI for compatible models)
            if (message.TryGetProperty("tool_calls", out var toolCallsEl) && toolCallsEl.ValueKind == JsonValueKind.Array)
            {
                var toolInvocations = new List<ToolInvocation>();
                foreach (var tc in toolCallsEl.EnumerateArray())
                {
                    var toolName = tc.GetProperty("function").GetProperty("name").GetString() ?? "";
                    var argsEl = tc.GetProperty("function").TryGetProperty("arguments", out var args)
                        ? args
                        : JsonDocument.Parse("{}").RootElement;

                    toolInvocations.Add(new ToolInvocation(Guid.NewGuid().ToString(), toolName, argsEl));
                }

                if (toolInvocations.Count > 0)
                    return new LLMResponse(null, toolInvocations);
            }

            var text = message.GetProperty("content").GetString()
                ?? "Xin lỗi, tôi không thể trả lời lúc này.";

            return new LLMResponse(text, null);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "OllamaProvider | Cannot connect to Ollama at {Url}", baseUrl);
            return new LLMResponse("⚠️ Không thể kết nối tới Ollama. Đảm bảo Ollama đang chạy.", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OllamaProvider | Unexpected error");
            return new LLMResponse("⚠️ Đã xảy ra lỗi với Ollama provider.", null);
        }
    }
}
