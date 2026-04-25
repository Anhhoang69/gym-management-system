export default function AIPlanCard({ data }) {
  const plan = data?.WorkoutPlan || data?.workoutPlan
  const nutrition = data?.nutritionAdvice || data?.NutritionAdvice

  if (!plan) {
    return (
      <div className="text-sm text-red-400">
        Không đọc được dữ liệu kế hoạch 😥
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-third)] p-4 rounded-lg border border-[var(--border)] space-y-5">

      {/* ================= GOAL ================= */}
      <div>
        <h3 className="font-semibold text-sm">🎯 Mục tiêu</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          {plan.Goal || "N/A"} • {plan.DaysPerWeek || "?"} buổi/tuần
        </p>
      </div>

      {/* ================= SCHEDULE ================= */}
      <div>
        <h3 className="font-semibold text-sm mb-2">📅 Lịch tập</h3>

        <div className="space-y-3">
          {plan.Schedule?.map((day, i) => (
            <div
              key={i}
              className="p-3 rounded-md bg-[var(--bg)] border border-[var(--border)]"
            >
              {/* Day */}
              <div className="font-medium text-sm">
                {day.Day || "?"} — {day.Focus || ""}
              </div>

              {/* Exercises */}
              <ul className="mt-2 text-xs text-[var(--text-secondary)] space-y-1">
                {day.Exercises?.map((ex, j) => (
                  <li key={j}>
                    • {ex.Name || "?"} — {ex.Sets || "?"} sets × {ex.Reps || "?"} ({ex.Rest || "?"})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ================= NUTRITION ================= */}
      {nutrition && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">🥗 Dinh dưỡng</h3>

          {/* Calories + Macros */}
          <div className="text-sm text-[var(--text-secondary)]">
            <div>
              🔥 Calories: <span className="font-medium text-white">
                {nutrition.DailyCalories || "?"}
              </span>
            </div>

            <div>
              ⚖️ Macros:
              {" "}
              <span className="text-green-400">P: {nutrition.Macros?.Protein || "?"}</span>,
              {" "}
              <span className="text-yellow-400">C: {nutrition.Macros?.Carbs || "?"}</span>,
              {" "}
              <span className="text-pink-400">F: {nutrition.Macros?.Fat || "?"}</span>
            </div>
          </div>

          {/* Meal Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nutrition.MealPlan?.map((meal, i) => (
              <div
                key={i}
                className="p-3 rounded-md bg-[var(--bg)] border border-[var(--border)]"
              >
                {/* Meal name */}
                <div className="font-medium text-sm flex justify-between">
                  <span>{meal.Meal || "Meal"}</span>
                  <span className="text-xs text-gray-400">
                    {meal.Calories || "?"} kcal
                  </span>
                </div>

                {/* Food */}
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {meal.Foods || "Không có dữ liệu"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}