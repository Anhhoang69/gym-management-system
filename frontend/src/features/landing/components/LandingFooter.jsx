export default function LandingFooter() {
  return (
    <footer className="mt-16 w-full bg-black py-10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-4">
        {/* Logo + mô tả */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <img src="/images/logo.png" className="h-10 w-10" />
            <span className="text-xl font-bold">EnerGym</span>
          </div>
          <p className="text-sm text-gray-400">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>

        {/* Cột 1 */}
        <div>
          <h3 className="mb-3 font-semibold">Get Started</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Service</li>
            <li>Contact Us</li>
            <li>Affiliate Program</li>
            <li>About Us</li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="mb-3 font-semibold">Get Started</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Fitness</li>
            <li>Platform</li>
            <li>Workout Library</li>
            <li>App Design</li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="mb-3 font-semibold">Get Started</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Service</li>
            <li>Contact Us</li>
            <li>Affiliate Program</li>
            <li>About Us</li>
          </ul>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">2025 EnerGym</p>
    </footer>
  );
}
