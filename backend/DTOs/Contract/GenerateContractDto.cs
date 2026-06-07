namespace backend.DTOs.Contract;

/// <summary>POST /api/contracts — Generate Contract</summary>
public class GenerateContractDto
{
    public Guid DraftId { get; set; }
}
