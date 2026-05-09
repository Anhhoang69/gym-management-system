namespace backend.Enums;

public enum RequestCategory
{
    BranchCreate,       // tạo chi nhánh mới → chờ GymOwner duyệt → Active
    BranchUpdate,
    BranchDeactivate,
    ContractChange,
    RefundRequest
}