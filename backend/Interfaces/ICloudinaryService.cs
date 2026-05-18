namespace backend.Interfaces;

public interface ICloudinaryService
{
    Task<string> UploadImageAsync(IFormFile file, string folder = "gym");
    Task DeleteImageAsync(string publicId);
}
