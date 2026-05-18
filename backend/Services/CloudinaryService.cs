using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using backend.Interfaces;

namespace backend.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var cloudName  = configuration["Cloudinary:CloudName"]  ?? throw new InvalidOperationException("Cloudinary:CloudName is missing");
        var apiKey     = configuration["Cloudinary:ApiKey"]     ?? throw new InvalidOperationException("Cloudinary:ApiKey is missing");
        var apiSecret  = configuration["Cloudinary:ApiSecret"]  ?? throw new InvalidOperationException("Cloudinary:ApiSecret is missing");

        var account    = new Account(cloudName, apiKey, apiSecret);
        _cloudinary    = new Cloudinary(account) { Api = { Secure = true } };
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder = "gym")
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty or null");

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File           = new FileDescription(file.FileName, stream),
            Folder         = folder,
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception($"Cloudinary upload failed: {result.Error.Message}");

        return result.SecureUrl.ToString();
    }

    public async Task DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}
