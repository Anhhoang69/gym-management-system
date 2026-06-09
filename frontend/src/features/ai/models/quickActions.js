/**
 * Maps backend tool names (from GET /api/ai/tools) to frontend quick action display.
 * Keys MUST match the tool.Name returned by the backend AIToolRegistry.
 *
 * Each entry:
 *   icon    – Emoji icon or Lucide name
 *   vi/en   – Localized configurations (label, prompt)
 */
export const TOOL_QUICK_ACTION_MAP = {
  // ── Member / Fitness ──────────────────────────────────
  get_membership_info: {
    icon: "CreditCard",
    vi: { label: "Thông tin thẻ tập", prompt: "Xem thông tin thẻ tập và hợp đồng hiện tại của tôi." },
    en: { label: "Membership Info", prompt: "View my current membership info and contract." }
  },
  get_available_packages: {
    icon: "Package",
    vi: { label: "Xem gói tập", prompt: "Cho tôi xem các gói tập đang có và giá của từng gói." },
    en: { label: "View Packages", prompt: "Show me the available gym packages and their pricing." }
  },
  get_my_schedule: {
    icon: "Calendar",
    vi: { label: "Lịch tập của tôi", prompt: "Cho tôi xem lịch đặt lớp và lịch tập của tôi tuần này." },
    en: { label: "My Schedule", prompt: "Show me my class bookings and training schedule for this week." }
  },
  book_class: {
    icon: "CalendarPlus",
    vi: { label: "Đặt lớp học", prompt: "Tôi muốn đặt một lớp học." },
    en: { label: "Book Class", prompt: "I would like to book a class." }
  },
  cancel_booking: {
    icon: "CalendarX",
    vi: { label: "Hủy lịch đặt lớp", prompt: "Hủy lịch đặt lớp đã hẹn của tôi." },
    en: { label: "Cancel Booking", prompt: "Cancel my scheduled class booking." }
  },
  get_attendance_summary: {
    icon: "ClipboardList",
    vi: { label: "Lịch sử đi tập", prompt: "Tóm tắt lịch sử đi tập và điểm danh của tôi." },
    en: { label: "Attendance History", prompt: "Summarize my workout attendance and check-in history." }
  },
  get_member_training_overview: {
    icon: "Activity",
    vi: { label: "Tổng quan tập luyện", prompt: "Xem tổng quan tiến độ tập luyện của tôi." },
    en: { label: "Workout Overview", prompt: "Show an overview of my training progress." }
  },
  generate_fitness_plan: {
    icon: "Dumbbell",
    vi: { label: "Lập kế hoạch tập", prompt: "Hãy lập kế hoạch tập luyện tuần cho tôi dựa trên mục tiêu giảm cân." },
    en: { label: "Create Workout Plan", prompt: "Generate a weekly workout plan for me based on weight loss goals." }
  },
  ask_fitness_coach: {
    icon: "Activity",
    vi: { label: "Tư vấn tập luyện", prompt: "Tư vấn cho tôi cách tập luyện hiệu quả để giảm mỡ và tăng cơ." },
    en: { label: "Fitness Coaching", prompt: "Advise me on effective ways to lose fat and build muscle." }
  },
  get_nutrition_advice: {
    icon: "Apple",
    vi: { label: "Chế độ dinh dưỡng", prompt: "Tư vấn chế độ ăn uống phù hợp cho người muốn giảm cân." },
    en: { label: "Nutrition Advice", prompt: "Provide custom meal planning advice for healthy weight loss." }
  },
  get_member_profile: {
    icon: "User",
    vi: { label: "Hồ sơ hội viên", prompt: "Xem thông tin hồ sơ và hợp đồng gói tập của tôi." },
    en: { label: "Member Profile", prompt: "View my profile details and gym membership contract." }
  },

  // ── Staff / Receptionist ─────────────────────────────
  get_checkin_today: {
    icon: "CheckSquare",
    vi: { label: "Check-in hôm nay", prompt: "Danh sách hội viên đã check-in hôm nay tại chi nhánh." },
    en: { label: "Today's Check-ins", prompt: "List of members who have checked in today at this branch." }
  },
  get_checkin_report: {
    icon: "CheckSquare",
    vi: { label: "Báo cáo check-in", prompt: "Xem báo cáo danh sách hội viên check-in hôm nay." },
    en: { label: "Check-in Report", prompt: "View the check-in report for members today." }
  },
  checkin_lookup: {
    icon: "Search",
    vi: { label: "Tra cứu check-in", prompt: "Tra cứu lịch sử check-in của hội viên." },
    en: { label: "Check-in Lookup", prompt: "Lookup check-in history for a member." }
  },
  lookup_member: {
    icon: "Search",
    vi: { label: "Tra cứu hội viên", prompt: "Tra cứu thông tin hội viên theo tên hoặc email." },
    en: { label: "Member Lookup", prompt: "Lookup member details by name or email." }
  },
  member_lookup: {
    icon: "Search",
    vi: { label: "Tra cứu hội viên", prompt: "Tra cứu thông tin hội viên theo tên hoặc email." },
    en: { label: "Member Lookup", prompt: "Lookup member details by name or email." }
  },
  contract_lookup: {
    icon: "FileText",
    vi: { label: "Tra cứu hợp đồng", prompt: "Tra cứu thông tin hợp đồng của hội viên." },
    en: { label: "Contract Lookup", prompt: "Lookup contract details for a member." }
  },
  booking_lookup: {
    icon: "Calendar",
    vi: { label: "Tra cứu lịch đặt", prompt: "Tra cứu lịch đặt lớp của hội viên." },
    en: { label: "Booking Lookup", prompt: "Lookup class booking history for a member." }
  },
  get_expiring_cards: {
    icon: "Clock",
    vi: { label: "Thẻ sắp hết hạn", prompt: "Danh sách hội viên có thẻ sắp hết hạn trong 7 ngày tới." },
    en: { label: "Expiring Memberships", prompt: "List members whose cards expire within the next 7 days." }
  },

  // ── Staff / Sales ─────────────────────────────────────
  get_lead_summary: {
    icon: "TrendingUp",
    vi: { label: "Tóm tắt leads", prompt: "Báo cáo tóm tắt tình trạng leads hôm nay." },
    en: { label: "Leads Summary", prompt: "Summary report of lead statuses today." }
  },
  get_lead_status: {
    icon: "TrendingUp",
    vi: { label: "Trạng thái Leads", prompt: "Tóm tắt trạng thái leads hôm nay và tiến độ chuyển đổi." },
    en: { label: "Lead Statuses", prompt: "Summary of lead pipeline statuses and conversion rates." }
  },
  get_lead_pipeline: {
    icon: "ListTodo",
    vi: { label: "Đường ống dẫn leads", prompt: "Xem biểu đồ đường ống dẫn leads hiện tại." },
    en: { label: "Lead Pipeline", prompt: "View the current lead pipeline stages." }
  },
  get_sales_funnel: {
    icon: "Filter",
    vi: { label: "Phễu bán hàng", prompt: "Xem biểu đồ phễu bán hàng (Sales Funnel)." },
    en: { label: "Sales Funnel", prompt: "Show the sales funnel conversion chart." }
  },
  get_sales_summary: {
    icon: "DollarSign",
    vi: { label: "Doanh số hôm nay", prompt: "Báo cáo doanh số bán hàng hôm nay của tôi." },
    en: { label: "Today's Sales", prompt: "View my sales performance summary for today." }
  },
  update_lead_status: {
    icon: "UserCheck",
    vi: { label: "Cập nhật lead", prompt: "Cập nhật trạng thái cho các leads đang xử lý." },
    en: { label: "Update Lead", prompt: "Update the status of processing leads." }
  },

  // ── PT ───────────────────────────────────────────────
  get_my_classes: {
    icon: "Calendar",
    vi: { label: "Lớp của tôi", prompt: "Xem lịch dạy và danh sách lớp học của tôi hôm nay." },
    en: { label: "My Classes", prompt: "View my teaching schedule and student list for today." }
  },
  get_my_teaching_schedule: {
    icon: "Calendar",
    vi: { label: "Lịch dạy của tôi", prompt: "Xem lịch dạy của tôi trong tuần này." },
    en: { label: "Teaching Schedule", prompt: "Show my teaching calendar for this week." }
  },
  get_class_roster: {
    icon: "Users",
    vi: { label: "Danh sách lớp dạy", prompt: "Xem danh sách học viên trong lớp dạy của tôi." },
    en: { label: "Class Roster", prompt: "View student enrollments in my classes." }
  },
  get_student_progress: {
    icon: "BarChart3",
    vi: { label: "Tiến độ học viên", prompt: "Báo cáo tiến độ tập luyện và số buổi còn lại của học viên." },
    en: { label: "Student Progress", prompt: "Report training progress and remaining class counts for students." }
  },
  create_training_plan: {
    icon: "FileText",
    vi: { label: "Lập kế hoạch cho học viên", prompt: "Lập kế hoạch tập luyện cá nhân hóa cho học viên." },
    en: { label: "Create Student Plan", prompt: "Generate a personalized workout plan for a student." }
  },
  get_personal_payroll: {
    icon: "Coins",
    vi: { label: "Bảng lương của tôi", prompt: "Xem thông tin bảng lương cá nhân tháng này của tôi." },
    en: { label: "My Payroll", prompt: "View my personal payroll breakdown for this month." }
  },

  // ── Branch Admin ──────────────────────────────────────
  get_branch_revenue: {
    icon: "TrendingUp",
    vi: { label: "Doanh thu chi nhánh", prompt: "Báo cáo doanh thu chi nhánh tháng này so với tháng trước." },
    en: { label: "Branch Revenue", prompt: "Report branch revenue for this month compared to the last." }
  },
  get_branch_payroll: {
    icon: "Coins",
    vi: { label: "Lương nhân viên chi nhánh", prompt: "Xem báo cáo tổng hợp lương nhân viên chi nhánh tháng này." },
    en: { label: "Branch Payroll", prompt: "View aggregate employee payroll report for this branch." }
  },
  get_pt_performance: {
    icon: "BarChart3",
    vi: { label: "Hiệu suất PT", prompt: "Báo cáo hiệu suất và doanh số của đội ngũ PT chi nhánh." },
    en: { label: "PT Performance", prompt: "Report trainer sales and workout session performance." }
  },
  get_branch_checkin_stats: {
    icon: "Users",
    vi: { label: "Thống kê check-in", prompt: "Thống kê lượt check-in của chi nhánh trong tuần này." },
    en: { label: "Check-in Stats", prompt: "Weekly guest and member check-in analytics." }
  },
  get_staff_performance: {
    icon: "Briefcase",
    vi: { label: "Hiệu suất nhân viên", prompt: "Đánh giá hiệu suất làm việc của nhân viên tháng này." },
    en: { label: "Staff Performance", prompt: "Evaluate employee KPIs and task completion stats." }
  },

  // ── GymOwner ─────────────────────────────────────────
  get_system_overview: {
    icon: "LayoutDashboard",
    vi: { label: "Tổng quan hệ thống", prompt: "Tổng quan hoạt động toàn bộ hệ thống gym tháng này." },
    en: { label: "System Overview", prompt: "Show high-level system activity and growth metrics." }
  },
  get_system_dashboard: {
    icon: "LayoutDashboard",
    vi: { label: "Tổng quan hệ thống", prompt: "Tổng quan hoạt động toàn bộ hệ thống gym tháng này." },
    en: { label: "System Overview", prompt: "Show high-level system activity and growth metrics." }
  },
  get_revenue_summary: {
    icon: "PieChart",
    vi: { label: "Doanh thu tổng", prompt: "Báo cáo doanh thu tổng hợp tất cả chi nhánh tháng này." },
    en: { label: "Total Revenue", prompt: "Aggregate financial performance report across all branches." }
  },
  get_global_revenue: {
    icon: "PieChart",
    vi: { label: "Doanh thu tổng", prompt: "Báo cáo doanh thu tổng hợp tất cả chi nhánh tháng này." },
    en: { label: "Total Revenue", prompt: "Aggregate financial performance report across all branches." }
  },
  get_ai_usage_cost: {
    icon: "Cpu",
    vi: { label: "Chi phí AI", prompt: "Báo cáo lượng token AI đã dùng và chi phí ước tính." },
    en: { label: "AI Cost Analysis", prompt: "Show AI token consumption and estimated system cost." }
  },

  // ── SuperAdmin ────────────────────────────────────────
  get_payroll_overview: {
    icon: "Coins",
    vi: { label: "Tổng quan lương", prompt: "Báo cáo tổng hợp bảng lương toàn hệ thống tháng này." },
    en: { label: "System Payroll", prompt: "System-wide salary and commission payout summary." }
  },
  get_token_usage: {
    icon: "BarChart",
    vi: { label: "Token AI usage", prompt: "Thống kê token AI đã tiêu thụ trong 30 ngày qua theo từng role." },
    en: { label: "Token Analytics", prompt: "AI tokens spent by roles over the last 30 days." }
  }
}

/**
 * Given a list of tools from GET /api/ai/tools,
 * returns quick action entries for the sidebar.
 * Falls back to tool description if no mapping found.
 * Limits to max 6 suggestions.
 */
export function buildQuickActions(tools = [], locale = 'vi') {
  const mapped = tools
    .map((tool) => {
      const def = TOOL_QUICK_ACTION_MAP[tool.name]
      if (def) {
        const langData = def[locale] || def.vi
        return {
          icon: def.icon,
          label: langData.label,
          prompt: langData.prompt
        }
      }

      // Fallback: use tool description as prompt
      return {
        label: tool.name.replace(/_/g, " "),
        icon: "Terminal",
        prompt: tool.description || (locale === 'vi' ? `Sử dụng ${tool.name}` : `Use ${tool.name}`)
      }
    })
    .slice(0, 6)

  return mapped
}
