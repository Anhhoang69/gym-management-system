using backend.Enums;

namespace backend.DTOs.Profile;

/// <summary>
/// Thông tin hội viên hiển thị trong /api/me (chỉ khi role = Member)
/// </summary>
public class MemberProfileInfo
{
    public Guid? AccessCardId { get; set; }
    public string? CardCode { get; set; }
    public AccessCardStatus? CardStatus { get; set; }
    public DateTime? CardExpireDate { get; set; }

    public int TotalContracts { get; set; }
    public ActiveContractInfo? ActiveContract { get; set; }
}

public class ActiveContractInfo
{
    public Guid ContractId { get; set; }
    public string PackageName { get; set; } = null!;
    public ContractStatus Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    /// <summary>Buổi PT cá nhân còn lại</summary>
    public int RemainingPrivateSessions { get; set; }

    /// <summary>Buổi tập nhóm còn lại</summary>
    public int RemainingGroupSessions { get; set; }
}
