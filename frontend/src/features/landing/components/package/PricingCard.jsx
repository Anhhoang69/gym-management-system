import { Check, User, Crown, Star } from 'lucide-react';

const iconMap = {
  basic: User,
  premium: Star,
  elite: Crown,
};

const colorVars = {
  basic: {
    plan: 'var(--plan-basic)',
    onPlan: 'var(--on-plan-basic)',
  },
  premium: {
    plan: 'var(--plan-premium)',
    onPlan: 'var(--on-plan-premium)',
  },
  elite: {
    plan: 'var(--plan-elite)',
    onPlan: 'var(--on-plan-elite)',
  },
};

export default function PricingCard({
  type,
  title,
  subtitle,
  monthlyPrice,
  duration,
  features,
  limitations,
  highlight = false,
}) {
  const Icon = iconMap[type];
  const colors = colorVars[type];

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
        highlight ? 'ring-2' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg-third)',
        border: '2px solid var(--border)',
        borderColor: highlight ? colors.plan : 'var(--border)',
      }}
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div
          className="mb-3 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.plan }}
        >
          <Icon className="h-7 w-7" style={{ color: colors.onPlan }} />
        </div>
        <h3 className="mb-1 text-2xl font-bold text-(--text-primary)">{title}</h3>
        <p className="text-sm text-(--text-secondary)">{subtitle}</p>
      </div>

      <div className="mb-6 text-center">
        <div className="mb-2 flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold text-(--text-primary)">{monthlyPrice}</span>
          <span className="text-(--text-secondary)">/tháng</span>
        </div>
        <div
          className="inline-block rounded-lg px-4 py-2 font-semibold"
          style={{ backgroundColor: colors.plan, color: colors.onPlan }}
        >
          {duration}
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <p className="text-sm font-semibold text-(--text-primary)">Quyền lợi chính:</p>
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: colors.plan }} />
            <span className="text-sm text-(--text-secondary)">{feature}</span>
          </div>
        ))}
      </div>

      {limitations && (
        <div className="mb-6 rounded-lg bg-(--hover) p-3">
          <p className="mb-1 text-xs font-semibold text-(--text-primary)">Phù hợp với:</p>
          <p className="text-xs text-(--text-secondary)">{limitations}</p>
        </div>
      )}

      <button
        className="w-full rounded-lg py-3 font-semibold transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: colors.plan, color: colors.onPlan }}
      >
        Chọn gói {title}
      </button>
    </div>
  );
}
