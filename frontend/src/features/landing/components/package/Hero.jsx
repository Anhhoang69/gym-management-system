import Brush from '../../../../assets/brush.svg';

export default function Hero() {
  return (
    <section className="bg-(--bg) px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto text-center">
        {/* BRUSH TITLE */}
        <div className="relative mx-auto inline-block">
          <img
            src={Brush}
            alt=""
            aria-hidden="true"
            className="block w-[440px] md:w-[540px] lg:w-[570px]"
          />

          <span className="--text-secondary absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-wide italic md:text-6xl">
            Gói Tập Độc Quyền
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="--text-primary block text-xl italic md:text-2xl">
          EnerGym mang đến các gói tập được thiết kế linh hoạt, phù hợp với nhiều mục tiêu và trình
          độ khác nhau.
        </p>
      </div>
    </section>
  );
}
