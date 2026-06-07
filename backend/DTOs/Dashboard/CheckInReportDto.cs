namespace backend.DTOs.Dashboard;

public class CheckInReportDto
{
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;

    public int TotalCheckIns { get; set; }
    public int UniqueMembers { get; set; }

    public DateOnly? PeakDay { get; set; }
    public int? PeakHour { get; set; }

    public List<DailyCheckInDto> CheckInsByDay { get; set; } = new();
    public List<HourlyCheckInDto> CheckInsByHour { get; set; } = new();
}

public class DailyCheckInDto
{
    public DateOnly Date { get; set; }
    public int Count { get; set; }
}

public class HourlyCheckInDto
{
    public int Hour { get; set; }
    public int Count { get; set; }
}
