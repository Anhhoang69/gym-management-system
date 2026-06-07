import { Outlet } from 'react-router-dom';
import LandingHeader from '../../features/landing/components/LandingHeader';
import LandingFooter from '../../features/landing/components/LandingFooter';

export default function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      {/* Header */}
      <LandingHeader />

      {/* Nội dung trang */}
      <main className="flex-1 pt-[70px] overflow-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
