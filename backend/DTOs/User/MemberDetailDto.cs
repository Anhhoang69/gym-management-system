namespace backend.DTOs.User;

public class MemberDetailDto
{
    public AccessCardSummaryDto? AccessCard { get; set; }
    public ContractSummaryDto? ActiveContract { get; set; }
    public int TotalContracts { get; set; }
}
