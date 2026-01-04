import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout.jsx';
import HomePage from '../../features/landing/pages/HomePage.jsx';
import AboutPage from '../../features/landing/pages/AboutPage.jsx';
import BranchesPage from '../../features/landing/pages/BranchesPage.jsx';
import BranchDetailPage from '../../features/landing/pages/BranchDetailPage';
import BranchCityPage from '../../features/landing/pages/BranchCityPage.jsx';
import PtPage from '../../features/landing/pages/PtPage.jsx';
import PackagePage from '../../features/landing/pages/PackagePage.jsx';
import ContactPage from '../../features/landing/pages/ContactPage.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';
import FAQPage from '../../features/landing/pages/FAQPage.jsx';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Landing Page / Public Routes */}
        <Route element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="/branches/:city" element={<BranchCityPage />} />
          <Route path="branches/:city/:slug" element={<BranchDetailPage />} />
          <Route path="faqs" element={<FAQPage />} />
          <Route path="packages" element={<PackagePage />} />
          <Route path="pt" element={<PtPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
