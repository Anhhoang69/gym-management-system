import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import StaffLayout from '../layouts/StaffLayout.jsx';
import PtLayout from '../layouts/PtLayout.jsx';
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
import AIChatPage from '../../features/landing/pages/AIChatPage.jsx';
import MemberProfilePage from '../../features/landing/pages/MemberProfilePage.jsx';
import ClassSchedulePage from '../../features/landing/pages/ClassSchedulePage.jsx';
import MyBookingsPage from '../../features/landing/pages/MyBookingsPage.jsx';

import LoginPage from "../../features/auth/pages/LoginPage"

import DashboardPage from '../../features/super-admin/pages/DashboardPage.jsx';
import UserManagementPage from '../../features/super-admin/pages/UserManagementPage.jsx';
import PromotionManagementPage from '../../features/super-admin/pages/PromotionManagementPage.jsx';
import BranchManagementPage from "../../features/super-admin/pages/BranchManagementPage"
import RoomManagementPage from "../../features/super-admin/pages/RoomManagementPage.jsx"
import PackageManagementPage from "../../features/super-admin/pages/PackageManagementPage.jsx"
import ClassManagementPage from "../../features/super-admin/pages/ClassManagementPage.jsx"
import LeadManagementPage from "../../features/super-admin/pages/LeadManagementPage.jsx"
import AttendancePage from "../../features/super-admin/pages/AttendancePage.jsx"
import RevenueSalesPage from "../../features/super-admin/pages/RevenueSalesPage"
import ContractsPage from "../../features/super-admin/pages/ContractPage.jsx"
import FinancialReportsPage from "../../features/super-admin/pages/FinancialReportsPage.jsx"
import ProfilePage from "../../features/super-admin/pages/ProfilePage.jsx"

import StaffDashboardPage from '../../features/staff/pages/StaffDashboardPage.jsx';
import PtDashboardPage from '../../features/pt/pages/PtDashboardPage.jsx';
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Landing Page / Public Routes */}
        <Route element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<MemberProfilePage />} />
          <Route path="classes" element={<ClassSchedulePage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/:city" element={<BranchCityPage />} />
          <Route path="branches/:city/:slug" element={<BranchDetailPage />} />
          <Route path="ai" element={<AIChatPage />} />
          <Route path="faqs" element={<FAQPage />} />
          <Route path="packages" element={<PackagePage />} />
          <Route path="pt" element={<PtPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Staff Dashboard */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashboardPage />} />
        </Route>

        {/* PT Dashboard */}
        <Route path="/pt" element={<PtLayout />}>
          <Route index element={<PtDashboardPage />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="promo" element={<PromotionManagementPage />} />
          <Route path="branches" element={<BranchManagementPage />} />
          <Route path="rooms" element={<RoomManagementPage />} />
          <Route path="packages" element={<PackageManagementPage />} />
          <Route path="classes" element={<ClassManagementPage />} />
          <Route path="leads" element={<LeadManagementPage />} />
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