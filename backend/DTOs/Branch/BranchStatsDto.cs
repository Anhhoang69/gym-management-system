namespace backend.DTOs.Branch;

public class BranchStatsDto
{
    public int TotalBranches { get; set; }

    public int ActiveBranches { get; set; }

    public int PendingBranches { get; set; }

    public int InactiveBranches { get; set; }
}