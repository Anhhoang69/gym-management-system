namespace backend.Enums;
public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded,
    Expired,    // URL hết hạn 15 phút chưa thanh toán
    Cancelled   // ResponseCode "24": user hủy trên VNPay
}