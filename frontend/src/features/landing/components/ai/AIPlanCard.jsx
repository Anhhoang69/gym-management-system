import { useState } from 'react';
import { FaDumbbell, FaCarrot, FaBullseye, FaCalendarAlt, FaFire, FaBalanceScale } from 'react-icons/fa';

export default function AIPlanCard({ data }) {
  const plan = data?.WorkoutPlan || data?.workoutPlan;
  const nutrition = data?.nutritionAdvice || data?.NutritionAdvice;

  const [activeTab, setActiveTab] = useState('workout');
  const [activeDay, setActiveDay] = useState(0);

  if (!plan) {
    return (
      <div className="text-sm text-red-400 p-4">
        Không đọc được dữ liệu kế hoạch 😥
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col text-[var(--text-primary)]">
      {/* HEADER: GOAL */}
      <div className="pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FaBullseye className="text-red-500" /> Mục tiêu: {plan.Goal || "N/A"}
        </h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1 flex items-center gap-2 font-medium">
          <FaCalendarAlt className="text-blue-500" /> {plan.DaysPerWeek || "?"} buổi/tuần
        </p>
      </div>

      {/* TABS */}
      <div className="flex pt-3 gap-6 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('workout')}
          className={`pb-2 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
            activeTab === 'workout' 
              ? 'text-[var(--brand)]' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FaDumbbell /> Lịch tập
          {activeTab === 'workout' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--brand)] rounded-t-full"></div>}
        </button>
        {nutrition && (
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`pb-2 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
              activeTab === 'nutrition' 
                ? 'text-green-500' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FaCarrot /> Dinh dưỡng
            {activeTab === 'nutrition' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-green-500 rounded-t-full"></div>}
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto py-3 scroll-smooth">
        
        {/* WORKOUT TAB */}
        {activeTab === 'workout' && (
          <div className="space-y-4">
            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {plan.Schedule?.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    activeDay === i 
                      ? 'bg-[var(--brand)] text-black shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.Day}
                </button>
              ))}
            </div>

            {/* Selected Day Content */}
            {plan.Schedule?.[activeDay] && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
                <h3 className="text-[16px] font-bold mb-3 flex items-center gap-2">
                  <span className="text-[var(--brand)]">|</span> {plan.Schedule[activeDay].Focus || "Ngày tập"}
                </h3>
                <div className="space-y-2.5">
                  {plan.Schedule[activeDay].Exercises?.map((ex, j) => (
                    <div key={j} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="font-bold text-[14px]">{ex.Name}</div>
                      <div className="flex flex-wrap gap-2 text-[12px]">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-semibold border border-blue-100">
                          {ex.Sets} sets × {ex.Reps}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium border border-gray-200">
                          Nghỉ: {ex.Rest}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* NUTRITION TAB */}
        {activeTab === 'nutrition' && nutrition && (
          <div className="space-y-4">
            {/* Macros Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-orange-50 p-3 rounded-2xl flex items-center gap-3 border border-orange-100">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                  <FaFire size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-orange-600/80 font-bold uppercase tracking-wider">Calories</div>
                  <div className="text-lg font-black text-orange-600">{nutrition.DailyCalories}</div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-2xl flex items-center gap-3 border border-green-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 shrink-0">
                  <FaBalanceScale size={18} />
                </div>
                <div>
                  <div className="text-[11px] text-green-600/80 font-bold uppercase tracking-wider">Macros</div>
                  <div className="text-[12px] font-bold text-green-600 leading-tight mt-0.5">
                    P: {nutrition.Macros?.Protein} <br/>
                    C: {nutrition.Macros?.Carbs} • F: {nutrition.Macros?.Fat}
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Plan */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-[15px] mb-2">Thực đơn tham khảo</h3>
              {nutrition.MealPlan?.map((meal, i) => (
                <div key={i} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 transition-all hover:shadow-md">
                  <div className="flex-1">
                    <div className="font-bold text-[14px]">{meal.Meal}</div>
                    <div className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">{meal.Foods}</div>
                  </div>
                  <div className="shrink-0 bg-white px-3 py-1.5 rounded-xl text-[12px] font-bold text-gray-600 border border-gray-200 shadow-sm">
                    {meal.Calories}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}