namespace backend.Enums;

public enum ApplicationRuleType
{
    /// <summary>Tự động chọn khuyến mãi giảm nhiều nhất cho khách hàng</summary>
    BestDiscount,

    /// <summary>Áp theo thứ tự Priority field (số nhỏ hơn = ưu tiên cao hơn)</summary>
    HighestPriority,

    /// <summary>Chỉ áp dụng 1 khuyến mãi duy nhất, không được gộp với khuyến mãi khác</summary>
    NonStackable
}
