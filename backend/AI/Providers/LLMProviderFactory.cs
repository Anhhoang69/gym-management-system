using backend.AI.Core;

namespace backend.AI.Providers;

/// <summary>
/// Resolves the active ILLMProvider from configuration.
/// Switch providers by changing "AI:Provider" in appsettings without touching any service code.
/// </summary>
public class LLMProviderFactory
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LLMProviderFactory> _logger;

    public LLMProviderFactory(
        IServiceProvider serviceProvider,
        IConfiguration configuration,
        ILogger<LLMProviderFactory> logger)
    {
        _serviceProvider = serviceProvider;
        _configuration = configuration;
        _logger = logger;
    }

    public ILLMProvider GetProvider()
    {
        var providerName = _configuration["AI:Provider"] ?? "OpenAI";

        _logger.LogInformation("LLMProviderFactory | Resolving provider: {Provider}", providerName);

        return providerName switch
        {
            "Ollama" => _serviceProvider.GetRequiredService<OllamaProvider>(),
            _        => _serviceProvider.GetRequiredService<OpenAIProvider>()  // default: OpenAI
        };
    }
}
