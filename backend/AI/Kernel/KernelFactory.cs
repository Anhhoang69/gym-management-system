using Microsoft.SemanticKernel;

namespace backend.AI.Kernel;

/// <summary>
/// Factory that creates a configured Semantic Kernel instance per request.
///
/// Provider selection is driven by "AI:Provider" in appsettings.json:
///   "OpenAI"  — uses OpenAI API with gpt-4o-mini (default)
///   "Ollama"  — uses Ollama local server via OpenAI-compatible API (/v1 endpoint)
///
/// The Kernel created here does NOT yet contain tools — tools are added
/// by AIService after RBAC filtering (AIToolRegistry.GetAvailableTools).
/// </summary>
public class KernelFactory
{
    private readonly IConfiguration _config;
    private readonly ILogger<KernelFactory> _logger;

    public KernelFactory(IConfiguration config, ILogger<KernelFactory> logger)
    {
        _config = config;
        _logger = logger;
    }

    /// <summary>
    /// Creates a fresh Kernel with the configured LLM connector.
    /// Called once per chat request from AIService.
    /// </summary>
    public Microsoft.SemanticKernel.Kernel Create()
    {
        var provider = _config["AI:Provider"] ?? "OpenAI";
        var builder  = Microsoft.SemanticKernel.Kernel.CreateBuilder();

        if (provider.Equals("Ollama", StringComparison.OrdinalIgnoreCase))
        {
            ConfigureOllama(builder);
        }
        else
        {
            ConfigureOpenAI(builder);
        }

        return builder.Build();
    }

    // ── Private configuration helpers ────────────────────────────────────────

    private void ConfigureOpenAI(IKernelBuilder builder)
    {
        var apiKey = _config["AI:OpenAI:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.StartsWith("REPLACE_"))
        {
            apiKey = _config["OpenAI:ApiKey"];
        }

        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.StartsWith("REPLACE_"))
        {
            _logger.LogError("KernelFactory | OpenAI API Key is not configured");
            throw new InvalidOperationException(
                "OpenAI API key is missing. " +
                "Set AI:OpenAI:ApiKey or OpenAI:ApiKey in appsettings.json, or environment variable OpenAI__ApiKey.");
        }

        var model = _config["AI:OpenAI:Model"] ?? _config["OpenAI:Model"] ?? "gpt-4o-mini";

        builder.AddOpenAIChatCompletion(modelId: model, apiKey: apiKey);

        _logger.LogInformation("KernelFactory | Provider: OpenAI | Model: {Model}", model);
    }

    private void ConfigureOllama(IKernelBuilder builder)
    {
        // Ollama exposes an OpenAI-compatible API at /v1 — no extra connector needed.
        // SK treats it as a local OpenAI endpoint.
        var baseUrl = _config["AI:Ollama:BaseUrl"] ?? "http://localhost:11434";
        var model   = _config["AI:Ollama:Model"]   ?? "llama3.2";

#pragma warning disable SKEXP0010
        builder.AddOpenAIChatCompletion(
            modelId:  model,
            apiKey:   "ollama",                        // Ollama ignores the API key
            endpoint: new Uri($"{baseUrl}/v1")
        );
#pragma warning restore SKEXP0010

        _logger.LogInformation("KernelFactory | Provider: Ollama | Model: {Model} | Url: {Url}",
            model, baseUrl);
    }
}
