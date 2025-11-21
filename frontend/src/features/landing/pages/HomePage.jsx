export default function HomePage() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to GymChain</h1>
      <p className="max-w-xl text-center text-gray-700">
        Your ultimate fitness chain management platform.
      </p>
      <button className="rounded-md bg-yellow-400 px-6 py-3 font-semibold text-black hover:bg-yellow-500">
        Get Started
      </button>
    </div>
  );
}
