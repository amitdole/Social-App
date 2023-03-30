using CloudinaryDotNet.Actions;

namespace API.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotosAsync(IFormFile file);

        Task<DeletionResult> DeletePhotoSync(string publicId);
    }
}
