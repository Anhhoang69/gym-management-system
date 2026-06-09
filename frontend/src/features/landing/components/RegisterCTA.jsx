import { useLanguage } from '../../../shared/contexts/LanguageContext';

const ctaTranslations = {
  vi: {
    title: "Đăng ký tập thử miễn phí ngay hôm nay!",
    subtitle: "Hãy để lại thông tin để nhận tư vấn chi tiết về chương trình hội viên tại Energym và ưu đãi “Tập thử miễn phí” ngay hôm nay!",
    fullName: "Họ và tên",
    placeholderName: "Nhập họ và tên",
    phone: "Số điện thoại",
    placeholderPhone: "Nhập số điện thoại",
    branch: "Chi nhánh",
    selectBranch: "Chọn chi nhánh",
    branchQ1: "EnerGym Quận 1",
    branchBT: "EnerGym Bình Thạnh",
    branchTD: "EnerGym Thủ Đức",
    packageInterest: "Gói tập quan tâm",
    placeholderPackage: "VD: Gym / PT / Yoga",
    email: "Email",
    placeholderEmail: "Nhập email",
    content: "Nội dung",
    placeholderContent: "Nội dung cần tư vấn...",
    submitBtn: "ĐĂNG KÝ NGAY!"
  },
  en: {
    title: "Register for a Free Trial Today!",
    subtitle: "Please leave your details to receive advice on the membership programs and the \"Free Trial\" promotion today!",
    fullName: "Full Name",
    placeholderName: "Enter your full name",
    phone: "Phone Number",
    placeholderPhone: "Enter your phone number",
    branch: "Branch",
    selectBranch: "Select a branch",
    branchQ1: "EnerGym District 1",
    branchBT: "EnerGym Binh Thanh",
    branchTD: "EnerGym Thu Duc",
    packageInterest: "Interested Package",
    placeholderPackage: "e.g. Gym / PT / Yoga",
    email: "Email",
    placeholderEmail: "Enter your email",
    content: "Message",
    placeholderContent: "Enter your request here...",
    submitBtn: "REGISTER NOW!"
  }
};

export default function RegisterCTA() {
  const { locale } = useLanguage();
  const tCta = (key) => ctaTranslations[locale]?.[key] || ctaTranslations.vi[key] || key;

  return (
    <section id="register" className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-(--bg-third) px-6 py-10 shadow-lg sm:px-10">
          {/* Title */}
          <h2 className="mb-2 text-center text-3xl font-bold tracking-wide uppercase">
            {tCta('title')}
          </h2>

          <p className="mb-8 text-center text-sm text-(--text-secondary)">
            {tCta('subtitle')}
          </p>

          {/* Form */}
          <form className="grid gap-5 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            {/* Left column */}
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {tCta('fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={tCta('placeholderName')}
                  className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  {tCta('phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder={tCta('placeholderPhone')}
                  className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{tCta('branch')}</label>
                <select className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none">
                  <option>{tCta('selectBranch')}</option>
                  <option>{tCta('branchQ1')}</option>
                  <option>{tCta('branchBT')}</option>
                  <option>{tCta('branchTD')}</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{tCta('packageInterest')}</label>
                <input
                  type="text"
                  placeholder={tCta('placeholderPackage')}
                  className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col">
              <label className="mb-1 block text-sm font-medium">
                {tCta('email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder={tCta('placeholderEmail')}
                className="mb-5 w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
              />

              <label className="mb-1 block text-sm font-medium">{tCta('content')}</label>
              <textarea
                rows={6}
                placeholder={tCta('placeholderContent')}
                className="w-full flex-1 resize-none rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
              />

              {/* Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-(--brand) px-8 py-3 text-sm font-semibold text-(--on-brand) transition hover:opacity-90 active:scale-[0.98]"
                >
                  {tCta('submitBtn')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
