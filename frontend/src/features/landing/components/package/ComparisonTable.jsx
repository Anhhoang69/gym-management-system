import { Check, X } from 'lucide-react';
import Brush from '../../../../assets/brush.svg';

export default function ComparisonTable() {
  const features = [
    { name: 'Tập tại các chi nhánh', basic: true, premium: true, elite: true },
    { name: 'Thiết bị Cardio & Weights', basic: true, premium: true, elite: true },
    { name: 'Phòng thay đồ & tủ khóa', basic: true, premium: true, elite: true },
    { name: 'Personal Training', basic: false, premium: '4 buổi/tháng', elite: 'Không giới hạn' },
    { name: 'Khu vực VIP', basic: false, premium: false, elite: true },
    { name: 'Group Classes', basic: false, premium: true, elite: true },
    { name: 'Tư vấn dinh dưỡng', basic: false, premium: 'Cơ bản', elite: 'Chuyên sâu' },
    { name: 'Phòng tắm xông', basic: false, premium: false, elite: true },
    { name: 'Massage Trị liệu', basic: false, premium: false, elite: true },
  ];

  const renderCell = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="mx-auto h-5 w-5" style={{ color: 'var(--brand)' }} />
      ) : (
        <X className="mx-auto h-5 w-5 text-(--text-secondary) opacity-30" />
      );
    }
    return <span className="text-sm text-(--text-secondary)">{value}</span>;
  };

  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 container mx-auto text-center">
        <div className="relative mx-auto inline-block">
          <img
            src={Brush}
            alt=""
            aria-hidden="true"
            className="block w-[440px] md:w-[540px] lg:w-[570px]"
          />

          <span className="--text-secondary absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-wide italic md:text-6xl">
            Quyền lợi
          </span>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-(--bg-secondary)">
                  <th className="px-6 py-4 text-left font-semibold text-(--text-primary)">
                    Tiện ích/ Gói tập
                  </th>
                  <th
                    className="px-6 py-4 text-center font-semibold"
                    style={{ color: 'var(--plan-basic)' }}
                  >
                    Basic
                  </th>
                  <th
                    className="px-6 py-4 text-center font-semibold"
                    style={{ color: 'var(--plan-premium)' }}
                  >
                    Premium
                  </th>
                  <th
                    className="px-6 py-4 text-center font-semibold"
                    style={{ color: 'var(--plan-elite)' }}
                  >
                    Elite VIP
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-(--bg-third)' : 'bg-(--bg-secondary)'}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="px-6 py-4 font-medium text-(--text-primary)">{feature.name}</td>
                    <td className="px-6 py-4 text-center">{renderCell(feature.basic)}</td>
                    <td className="px-6 py-4 text-center">{renderCell(feature.premium)}</td>
                    <td className="px-6 py-4 text-center">{renderCell(feature.elite)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
