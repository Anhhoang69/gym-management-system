import Brush from '../../../../assets/brush.svg';
export default function FAQHero() {
  return (
    <div className="relative overflow-hidden px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="relative mx-auto inline-block">
          <img
            src={Brush}
            alt=""
            aria-hidden="true"
            className="block w-[440px] md:w-[540px] lg:w-[570px]"
          />

          <span className="--text-secondary absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-wide italic md:text-6xl">
            Câu hỏi thường gặp
          </span>
        </div>
        <p className="--text-primary block text-xl italic md:text-2xl">
          Tìm câu trả lời cho mọi thắc mắc về EnerGym. Nếu không tìm thấy câu hỏi của bạn, hãy liên
          hệ với chúng tôi!
        </p>
      </div>
    </div>
  );
}
