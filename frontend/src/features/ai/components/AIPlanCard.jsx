import { useState } from "react"
import { Dumbbell, Apple, Target, Calendar, Flame, Scale, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { useLanguage } from "../../../shared/contexts/LanguageContext"

// ─── Exercise Row ─────────────────────────────────────────────────────────────
function ExerciseRow({ ex }) {
  const { locale } = useLanguage()
  return (
    <div
      className="flex flex-row items-center justify-between gap-2.5 px-3.5 py-2.5 bg-[var(--bg-third)] rounded-xl border border-[var(--border)] transition-shadow duration-200"
    >
      <div className="font-semibold text-sm text-[var(--text-primary)] flex-1">
        {ex.Name || ex.name}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <span
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-md px-2 py-0.5 text-xs font-semibold"
        >
          {ex.Sets || ex.sets} sets × {ex.Reps || ex.reps}
        </span>
        <span
          className="bg-[var(--hover)] text-[var(--text-secondary)] border border-[var(--border)] rounded-md px-2 py-0.5 text-xs font-medium"
        >
          {locale === 'vi' ? 'nghỉ' : 'rest'} {ex.Rest || ex.rest}
        </span>
      </div>
    </div>
  )
}

// ─── Meal Row ─────────────────────────────────────────────────────────────────
function MealRow({ meal }) {
  return (
    <div
      className="flex items-start gap-3 px-3.5 py-2.5 bg-[var(--bg-third)] rounded-xl border border-[var(--border)]"
    >
      <div className="flex-1">
        <div className="font-bold text-sm text-[var(--text-primary)]">
          {meal.Meal || meal.meal}
        </div>
        <div className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">
          {meal.Foods || meal.foods}
        </div>
      </div>
      <div
        className="flex-shrink-0 bg-[var(--hover)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-xs font-bold text-[var(--text-primary)]"
      >
        {meal.Calories || meal.calories} kcal
      </div>
    </div>
  )
}

// ─── Day Section (collapsible) ────────────────────────────────────────────────
function DaySection({ day, isActive, onClick }) {
  const { locale } = useLanguage()
  const exercises = day.Exercises || day.exercises || []
  return (
    <div className="mb-2">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-none cursor-pointer font-bold text-sm transition-all duration-200 ${
          isActive 
            ? "bg-[var(--brand)] text-black" 
            : "bg-[var(--hover)] text-[var(--text-primary)] hover:bg-[var(--border)]/20"
        }`}
      >
        <span className="flex items-center gap-2">
          <Dumbbell size={14} />
          {day.Day || day.day}
          <span className="font-medium opacity-75 text-xs">
            — {day.Focus || day.focus}
          </span>
        </span>
        {isActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isActive && (
        <div className="mt-1.5 flex flex-col gap-1.5 pl-1">
          {exercises.length === 0 ? (
            <div className="text-xs text-[var(--text-secondary)] px-3.5 py-2">
              {locale === 'vi' ? "Ngày nghỉ phục hồi" : "Rest & recovery day"}
            </div>
          ) : (
            exercises.map((ex, j) => <ExerciseRow key={j} ex={ex} />)
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main AIPlanCard ──────────────────────────────────────────────────────────
export default function AIPlanCard({ data }) {
  const { locale } = useLanguage()
  const plan = data?.WorkoutPlan || data?.workoutPlan
  const nutrition = data?.nutritionAdvice || data?.NutritionAdvice

  const [activeTab, setActiveTab] = useState("workout")
  const [activeDay, setActiveDay] = useState(0)

  if (!plan) {
    return (
      <div className="text-sm text-red-500 p-4 flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl">
        <AlertCircle size={16} />
        <span>{locale === 'vi' ? "Không đọc được dữ liệu kế hoạch 😥" : "Failed to parse plan data 😥"}</span>
      </div>
    )
  }

  const schedule = plan.Schedule || plan.schedule || []

  return (
    <div className="h-full flex flex-col text-[var(--text-primary)]">

      {/* GOAL HEADER */}
      <div className="pb-3.5 mb-3.5 border-b border-[var(--border)]">
        <h2 className="text-[17px] font-black flex items-center gap-2 m-0">
          <Target className="text-red-500" size={18} />
          {plan.Goal || plan.goal || (locale === 'vi' ? "Kế hoạch tập luyện" : "Training Plan")}
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 flex items-center gap-1.5">
          <Calendar className="text-blue-500" size={14} />
          {plan.DaysPerWeek || plan.daysPerWeek || "?"} {locale === 'vi' ? "buổi/tuần" : "sessions/week"}
          &nbsp;·&nbsp;
          <span className="text-[var(--brand)] font-bold">
            {locale === 'vi' ? "Được tạo bởi EnerGym AI" : "Created by EnerGym AI"}
          </span>
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-5 border-b border-[var(--border)] mb-4">
        <button 
          onClick={() => setActiveTab("workout")}
          className={`flex items-center gap-1.5 pb-2.5 text-sm font-semibold border-none bg-none cursor-pointer transition-all duration-200 border-b-2 ${
            activeTab === "workout"
              ? "border-[var(--brand)] text-[var(--brand)]"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Dumbbell size={14} /> {locale === 'vi' ? "Lịch tập" : "Workout Schedule"}
        </button>
        {nutrition && (
          <button 
            onClick={() => setActiveTab("nutrition")}
            className={`flex items-center gap-1.5 pb-2.5 text-sm font-semibold border-none bg-none cursor-pointer transition-all duration-200 border-b-2 ${
              activeTab === "nutrition"
                ? "border-green-500 text-green-500"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Apple size={14} /> {locale === 'vi' ? "Dinh dưỡng" : "Nutrition Plan"}
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto pr-1">

        {/* WORKOUT TAB */}
        {activeTab === "workout" && (
          <div>
            {schedule.length === 0 ? (
              <div className="text-[var(--text-secondary)] text-sm">
                {locale === 'vi' ? "Không có lịch tập." : "No workout schedule."}
              </div>
            ) : (
              schedule.map((day, i) => (
                <DaySection
                  key={i}
                  day={day}
                  isActive={activeDay === i}
                  onClick={() => setActiveDay(activeDay === i ? -1 : i)}
                />
              ))
            )}
          </div>
        )}

        {/* NUTRITION TAB */}
        {activeTab === "nutrition" && nutrition && (
          <div className="flex flex-col gap-4">

            {/* Macros summary */}
            <div className="grid grid-cols-2 gap-2.5">
              <div
                className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-2.5"
              >
                <div
                  className="w-9 h-9 rounded-full bg-orange-500/15 flex items-center justify-center text-orange-500 flex-shrink-0"
                >
                  <Flame size={16} />
                </div>
                <div>
                  <div className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Calories</div>
                  <div className="text-lg font-black text-orange-500">
                    {nutrition.DailyCalories || nutrition.dailyCalories} kcal
                  </div>
                </div>
              </div>

              <div
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2.5"
              >
                <div
                  className="w-9 h-9 rounded-full bg-green-500/15 flex items-center justify-center text-green-500 flex-shrink-0"
                >
                  <Scale size={14} />
                </div>
                <div>
                  <div className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Macros</div>
                  <div className="text-xs font-semibold text-green-600 dark:text-green-400 leading-tight">
                    P: {(nutrition.Macros || nutrition.macros)?.Protein || (nutrition.Macros || nutrition.macros)?.protein}g<br />
                    C: {(nutrition.Macros || nutrition.macros)?.Carbs || (nutrition.Macros || nutrition.macros)?.carbs}g · F: {(nutrition.Macros || nutrition.macros)?.Fat || (nutrition.Macros || nutrition.macros)?.fat}g
                  </div>
                </div>
              </div>
            </div>

            {/* Meal plan */}
            <div>
              <h3 className="text-sm font-bold mb-2.5 text-[var(--text-primary)]">
                {locale === 'vi' ? "Thực đơn tham khảo" : "Sample Meal Plan"}
              </h3>
              <div className="flex flex-col gap-2">
                {(nutrition.MealPlan || nutrition.mealPlan || []).map((meal, i) => (
                  <MealRow key={i} meal={meal} />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
