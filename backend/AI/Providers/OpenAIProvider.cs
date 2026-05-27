using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using backend.AI.Core;

namespace backend.AI.Providers;

/// <summary>
/// OpenAI Chat Completions provider.
/// Supports tool/function calling — maps ToolDefinition list to OpenAI "tools" format
/// and parses tool_calls array from the response into List&lt;ToolInvocation&gt;.
/// </summary>
public class OpenAIProvider : ILLMProvider
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<OpenAIProvider> _logger;

    private const string OpenAIEndpoint = "https://api.openai.com/v1/chat/completions";

    public string ProviderName => "OpenAI";

    public OpenAIProvider(HttpClient httpClient, IConfiguration configuration, ILogger<OpenAIProvider> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LLMResponse> ChatAsync(LLMRequest request, CancellationToken ct = default)
    {
        var apiKey = _configuration["AI:OpenAI:ApiKey"]
            ?? _configuration["OpenAI:ApiKey"];  // backward-compat fallback

        var model = _configuration["AI:OpenAI:Model"] ?? "gpt-4o-mini";
        var maxTokens = int.TryParse(_configuration["AI:OpenAI:MaxTokens"], out var mt) ? mt : 2000;

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogError("OpenAI API key is not configured");
            return new LLMResponse("Hệ thống AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.", null);
        }

        try
        {
            // Build messages array for OpenAI
            var messages = request.Messages.Select(m =>
            {
                if (m.ToolCallId != null)
                {
                    // tool result message — role="tool" with tool_call_id
                    return (object)new { role = m.Role, content = m.Content, tool_call_id = m.ToolCallId };
                }
                return (object)new { role = m.Role, content = m.Content };
            }).ToList();

            object requestBody;

            if (request.Tools != null && request.Tools.Count > 0)
            {
                // Build OpenAI tools format from ToolDefinitions
                var openAiTools = request.Tools.Select(t => new
                {
                    type = "function",
                    function = new
                    {
                        name = t.Name,
                        description = t.Description,
                        parameters = t.InputSchema
                    }
                }).ToList();

                requestBody = new
                {
                    model,
                    messages,
                    tools = openAiTools,
                    tool_choice = "auto",
                    max_tokens = maxTokens,
                    temperature = request.Temperature
                };
            }
            else
            {
                requestBody = new
                {
                    model,
                    messages,
                    max_tokens = maxTokens,
                    temperature = request.Temperature
                };
            }

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            _logger.LogInformation("OpenAIProvider | Model: {Model} | Tools: {ToolCount} | Messages: {MsgCount}",
                model, request.Tools?.Count ?? 0, request.Messages.Count);

            var response = await _httpClient.PostAsync(OpenAIEndpoint, content, ct);
            var responseBody = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("OpenAI API error: {Status} | Body: {Body}",
                    response.StatusCode, responseBody);
                return new LLMResponse($"⚠️ Lỗi AI (HTTP {(int)response.StatusCode}). Vui lòng thử lại.", null);
            }

            var result = JsonDocument.Parse(responseBody);
            var choice = result.RootElement.GetProperty("choices")[0];
            var message = choice.GetProperty("message");
            var finishReason = choice.GetProperty("finish_reason").GetString();

            // Check for tool_calls
            if (finishReason == "tool_calls" && message.TryGetProperty("tool_calls", out var toolCallsEl))
            {
                var toolInvocations = new List<ToolInvocation>();

                foreach (var tc in toolCallsEl.EnumerateArray())
                {
                    var callId = tc.GetProperty("id").GetString() ?? Guid.NewGuid().ToString();
                    var toolName = tc.GetProperty("function").GetProperty("name").GetString() ?? "";
                    var argsStr = tc.GetProperty("function").GetProperty("arguments").GetString() ?? "{}";

                    JsonElement argsEl;
                    try
                    {
                        argsEl = JsonDocument.Parse(argsStr).RootElement;
                    }
                    catch
                    {
                        argsEl = JsonDocument.Parse("{}").RootElement;
                    }

                    toolInvocations.Add(new ToolInvocation(callId, toolName, argsEl));
                }

                _logger.LogInformation("OpenAIProvider | tool_calls: {Count}", toolInvocations.Count);
                return new LLMResponse(null, toolInvocations);
            }

            // Regular text response
            var text = message.GetProperty("content").GetString()
                ?? "Xin lỗi, tôi không thể trả lời lúc này.";

            _logger.LogInformation("OpenAIProvider | Text response length: {Len}", text.Length);
            return new LLMResponse(text, null);
        }
        catch (TaskCanceledException)
        {
            _logger.LogWarning("OpenAIProvider | Request timed out");
            return new LLMResponse("⚠️ Yêu cầu bị timeout. Vui lòng thử lại.", null);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "OpenAIProvider | Network error");
            return new LLMResponse("⚠️ Lỗi kết nối đến AI. Vui lòng kiểm tra mạng.", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAIProvider | Unexpected error");
            return new LLMResponse("⚠️ Đã xảy ra lỗi. Vui lòng thử lại sau.", null);
        }
    }
}
