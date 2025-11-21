import { Outlet, Link } from 'react-router-dom';

export default function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full bg-gray-900 p-4 text-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            GymChain
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-yellow-400">
              Home
            </Link>
            <Link to="/about" className="hover:text-yellow-400">
              About
            </Link>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="w-full flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 p-4 text-center text-white">
        &copy; 2025 GymChain. All rights reserved.
      </footer>
    </div>
  );
}
