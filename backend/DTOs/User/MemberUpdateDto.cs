namespace backend.DTOs.User;

using backend.Enums;

/// <summary>
/// Dữ liệu cập nhật đặc thù cho Member (trong PUT /api/users/{id}).
/// </summary>
public class MemberUpdateDto
{
    /// <summary>
    /// Cập nhật trạng thái thẻ hội viên (Active/Lost/Expired/Disabled).
    /// Null = không thay đổi.
    /// </summary>
    public AccessCardStatus? AccessCardStatus { get; set; }

    /// <summary>
    /// Tạo Contract mới (đổi gói / gia hạn).
    /// Phải cung cấp cả hai hoặc không cung cấp gì.
    /// Contract sẽ được tạo ở trạng thái Pending — cần chạy tiếp luồng C2.
    /// </summary>
    public Guid? NewPackageId { get; set; }

    public Guid? NewPricingId { get; set; }
}
