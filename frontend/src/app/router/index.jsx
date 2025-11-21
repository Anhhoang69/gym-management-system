import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout.jsx';
import HomePage from '../../features/landing/pages/HomePage.jsx';
import AboutPage from '../../features/landing/pages/AboutPage.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Landing Page / Public Routes */}
        <Route element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
