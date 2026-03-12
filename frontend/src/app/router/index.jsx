import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
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

import LoginPage from "../../features/auth/pages/LoginPage"

import DashboardPage from '../../features/super-admin/pages/DashboardPage.jsx';
import UserManagementPage from '../../features/super-admin/pages/UserManagementPage.jsx';
import PromotionManagementPage from '../../features/super-admin/pages/PromotionManagementPage.jsx';
import BranchManagementPage from "../../features/super-admin/pages/BranchManagementPage"
import PackageManagementPage from "../../features/super-admin/pages/PackageManagementPage.jsx"
import TrainerManagementPage from "../../features/super-admin/pages/TrainerManagementPage.jsx"
import AttendancePage from "../../features/super-admin/pages/AttendancePage.jsx"
import RevenueSalesPage from "../../features/super-admin/pages/RevenueSalesPage"
import ContractsPage from "../../features/super-admin/pages/ContractPage.jsx"
import FinancialReportsPage from "../../features/super-admin/pages/FinancialReportsPage.jsx"

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Landing Page / Public Routes */}
        <Route element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/:city" element={<BranchCityPage />} />
          <Route path="branches/:city/:slug" element={<BranchDetailPage />} />
          <Route path="faqs" element={<FAQPage />} />
          <Route path="packages" element={<PackagePage />} />
          <Route path="pt" element={<PtPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="promo" element={<PromotionManagementPage />} />
          <Route path="branches" element={<BranchManagementPage />} />
          <Route path="packages" element={<PackageManagementPage />} />
          <Route path="trainers" element={<TrainerManagementPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="sales" element={<RevenueSalesPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="reports" element={<FinancialReportsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}