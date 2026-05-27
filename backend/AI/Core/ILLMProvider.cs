namespace backend.AI.Core;

/// <summary>
/// Provider-agnostic LLM abstraction.
/// AIService depends only on this interface — it has no knowledge of OpenAI, Claude, or Ollama shapes.
/// </summary>
public interface ILLMProvider
{
    /// <summary>Human-readable provider name for logging: "OpenAI" | "Ollama"</summary>
    string ProviderName { get; }

    /// <summary>
    /// Send a chat request to the provider and return a response.
    /// If the response contains ToolCalls, the caller must execute them and loop.
    /// </summary>
    Task<LLMResponse> ChatAsync(LLMRequest request, CancellationToken ct = default);
}
