/**
 * Maps backend tool names (from GET /api/ai/tools) to frontend quick action display.
 * Keys MUST match the tool.Name returned by the backend AIToolRegistry.
 *
 * Each entry:
 *   label   – Short display text on the button
 *   icon    – Emoji icon
 *   prompt  – Message to auto-send when clicked
 *   roles   – (optional) only show for these roles if tool name alone isn't enough
 */
export const TOOL_QUICK_ACTION_MAP = {
  // ── Member / Fitness ──────────────────────────────────
  get_membership_info: {
    label: "Thông tin thẻ tập",
    icon: "CreditCard",
    prompt: "Xem thông tin thẻ tập và hợp đồng hiện tại của tôi."
  },
  get_available_packages: {
    label: "Xem gói tập",
    icon: "Package",
    prompt: "Cho tôi xem các gói tập đang có và giá của từng gói."
  },
  get_my_schedule: {
    label: "Lịch tập của tôi",
    icon: "Calendar",
    prompt: "Cho tôi xem lịch đặt lớp và lịch tập của tôi tuần này."
  },
  book_class: {
    label: "Đặt lớp học",
    icon: "CalendarPlus",
    prompt: "Tôi muốn đặt một lớp học."
  },
  cancel_booking: {
    label: "Hủy lịch đặt lớp",
    icon: "CalendarX",
    prompt: "Hủy lịch đặt lớp đã hẹn của tôi."
  },
  get_attendance_summary: {
    label: "Lịch sử đi tập",
    icon: "ClipboardList",
    prompt: "Tóm tắt lịch sử đi tập và điểm danh của tôi."
  },
  get_member_training_overview: {
    label: "Tổng quan tập luyện",
    icon: "Activity",
    prompt: "Xem tổng quan tiến độ tập luyện của tôi."
  },
  generate_fitness_plan: {
    label: "Lập kế hoạch tập",
    icon: "Dumbbell",
    prompt: "Hãy lập kế hoạch tập luyện tuần cho tôi dựa trên mục tiêu giảm cân."
  },
  ask_fitness_coach: {
    label: "Tư vấn tập luyện",
    icon: "Activity",
    prompt: "Tư vấn cho tôi cách tập luyện hiệu quả để giảm mỡ và tăng cơ."
  },
  get_nutrition_advice: {
    label: "Chế độ dinh dưỡng",
    icon: "Apple",
    prompt: "Tư vấn chế độ ăn uống phù hợp cho người muốn giảm cân."
  },
  get_member_profile: {
    label: "Hồ sơ hội viên",
    icon: "User",
    prompt: "Xem thông tin hồ sơ và hợp đồng gói tập của tôi."
  },

  // ── Staff / Receptionist ─────────────────────────────
  get_checkin_today: {
    label: "Check-in hôm nay",
    icon: "CheckSquare",
    prompt: "Danh sách hội viên đã check-in hôm nay tại chi nhánh."
  },
  get_checkin_report: {
    label: "Báo cáo check-in",
    icon: "CheckSquare",
    prompt: "Xem báo cáo danh sách hội viên check-in hôm nay."
  },
  checkin_lookup: {
    label: "Tra cứu check-in",
    icon: "Search",
    prompt: "Tra cứu lịch sử check-in của hội viên."
  },
  lookup_member: {
    label: "Tra cứu hội viên",
    icon: "Search",
    prompt: "Tra cứu thông tin hội viên theo tên hoặc email."
  },
  member_lookup: {
    label: "Tra cứu hội viên",
    icon: "Search",
    prompt: "Tra cứu thông tin hội viên theo tên hoặc email."
  },
  contract_lookup: {
    label: "Tra cứu hợp đồng",
    icon: "FileText",
    prompt: "Tra cứu thông tin hợp đồng của hội viên."
  },
  booking_lookup: {
    label: "Tra cứu lịch đặt",
    icon: "Calendar",
    prompt: "Tra cứu lịch đặt lớp của hội viên."
  },
  get_expiring_cards: {
    label: "Thẻ sắp hết hạn",
    icon: "Clock",
    prompt: "Danh sách hội viên có thẻ sắp hết hạn trong 7 ngày tới."
  },

  // ── Staff / Sales ─────────────────────────────────────
  get_lead_summary: {
    label: "Tóm tắt leads",
    icon: "TrendingUp",
    prompt: "Báo cáo tóm tắt tình trạng leads hôm nay."
  },
  get_lead_status: {
    label: "Trạng thái Leads",
    icon: "TrendingUp",
    prompt: "Tóm tắt trạng thái leads hôm nay và tiến độ chuyển đổi."
  },
  get_lead_pipeline: {
    label: "Đường ống dẫn leads",
    icon: "ListTodo",
    prompt: "Xem biểu đồ đường ống dẫn leads hiện tại."
  },
  get_sales_funnel: {
    label: "Phễu bán hàng",
    icon: "Filter",
    prompt: "Xem biểu đồ phễu bán hàng (Sales Funnel)."
  },
  get_sales_summary: {
    label: "Doanh số hôm nay",
    icon: "DollarSign",
    prompt: "Báo cáo doanh số bán hàng hôm nay của tôi."
  },
  update_lead_status: {
    label: "Cập nhật lead",
    icon: "UserCheck",
    prompt: "Cập nhật trạng thái cho các leads đang xử lý."
  },

  // ── PT ───────────────────────────────────────────────
  get_my_classes: {
    label: "Lớp của tôi",
    icon: "Calendar",
    prompt: "Xem lịch dạy và danh sách lớp học của tôi hôm nay."
  },
  get_my_teaching_schedule: {
    label: "Lịch dạy của tôi",
    icon: "Calendar",
    prompt: "Xem lịch dạy của tôi trong tuần này."
  },
  get_class_roster: {
    label: "Danh sách lớp dạy",
    icon: "Users",
    prompt: "Xem danh sách học viên trong lớp dạy của tôi."
  },
  get_student_progress: {
    label: "Tiến độ học viên",
    icon: "BarChart3",
    prompt: "Báo cáo tiến độ tập luyện và số buổi còn lại của học viên."
  },
  create_training_plan: {
    label: "Lập kế hoạch cho học viên",
    icon: "FileText",
    prompt: "Lập kế hoạch tập luyện cá nhân hóa cho học viên."
  },
  get_personal_payroll: {
    label: "Bảng lương của tôi",
    icon: "Coins",
    prompt: "Xem thông tin bảng lương cá nhân tháng này của tôi."
  },

  // ── Branch Admin ──────────────────────────────────────
  get_branch_revenue: {
    label: "Doanh thu chi nhánh",
    icon: "TrendingUp",
    prompt: "Báo cáo doanh thu chi nhánh tháng này so với tháng trước."
  },
  get_branch_payroll: {
    label: "Lương nhân viên chi nhánh",
    icon: "Coins",
    prompt: "Xem báo cáo tổng hợp lương nhân viên chi nhánh tháng này."
  },
  get_pt_performance: {
    label: "Hiệu suất PT",
    icon: "BarChart3",
    prompt: "Báo cáo hiệu suất và doanh số của đội ngũ PT chi nhánh."
  },
  get_branch_checkin_stats: {
    label: "Thống kê check-in",
    icon: "Users",
    prompt: "Thống kê lượt check-in của chi nhánh trong tuần này."
  },
  get_staff_performance: {
    label: "Hiệu suất nhân viên",
    icon: "Briefcase",
    prompt: "Đánh giá hiệu suất làm việc của nhân viên tháng này."
  },

  // ── GymOwner ─────────────────────────────────────────
  get_system_overview: {
    label: "Tổng quan hệ thống",
    icon: "LayoutDashboard",
    prompt: "Tổng quan hoạt động toàn bộ hệ thống gym tháng này."
  },
  get_system_dashboard: {
    label: "Tổng quan hệ thống",
    icon: "LayoutDashboard",
    prompt: "Tổng quan hoạt động toàn bộ hệ thống gym tháng này."
  },
  get_revenue_summary: {
    label: "Doanh thu tổng",
    icon: "PieChart",
    prompt: "Báo cáo doanh thu tổng hợp tất cả chi nhánh tháng này."
  },
  get_global_revenue: {
    label: "Doanh thu tổng",
    icon: "PieChart",
    prompt: "Báo cáo doanh thu tổng hợp tất cả chi nhánh tháng này."
  },
  get_ai_usage_cost: {
    label: "Chi phí AI",
    icon: "Cpu",
    prompt: "Báo cáo lượng token AI đã dùng và chi phí ước tính."
  },

  // ── SuperAdmin ────────────────────────────────────────
  get_payroll_overview: {
    label: "Tổng quan lương",
    icon: "Coins",
    prompt: "Báo cáo tổng hợp bảng lương toàn hệ thống tháng này."
  },
  get_token_usage: {
    label: "Token AI usage",
    icon: "BarChart",
    prompt: "Thống kê token AI đã tiêu thụ trong 30 ngày qua theo từng role."
  }
}

/**
 * Given a list of tools from GET /api/ai/tools,
 * returns quick action entries for the sidebar.
 * Falls back to tool description if no mapping found.
 * Limits to max 6 suggestions.
 */
export function buildQuickActions(tools = []) {
  const mapped = tools
    .map((tool) => {
      const def = TOOL_QUICK_ACTION_MAP[tool.name]
      if (def) return def

      // Fallback: use tool description as prompt
      return {
        label: tool.name.replace(/_/g, " "),
        icon: "Terminal",
        prompt: tool.description || `Sử dụng ${tool.name}`
      }
    })
    .slice(0, 6)

  return mapped
}
