import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import VerifyOTPPage from "../../features/auth/pages/VerifyOTPPage"
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage"
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage"
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
import StaffProfilePage from '../../features/staff/pages/StaffProfilePage.jsx';
import StaffAttendancePage from '../../features/staff/pages/StaffAttendancePage.jsx';
import StaffPaymentPage from '../../features/staff/pages/StaffPaymentPage.jsx';
import StaffCommissionPage from '../../features/staff/pages/StaffCommissionPage.jsx';
import PtDashboardPage from '../../features/pt/pages/PtDashboardPage.jsx';
import PtProfilePage from '../../features/pt/pages/PtProfilePage.jsx';
import PtClassManagementPage from '../../features/pt/pages/PtClassManagementPage.jsx';
import PtCommissionPage from '../../features/pt/pages/PtCommissionPage.jsx';

import OwnerLayout from '../layouts/OwnerLayout.jsx';
import OwnerDashboardPage from '../../features/gym-owner/pages/OwnerDashboardPage.jsx';
import OwnerFinancialReportsPage from '../../features/gym-owner/pages/OwnerFinancialReportsPage.jsx';
import OwnerProfilePage from '../../features/gym-owner/pages/OwnerProfilePage.jsx';
import OwnerRequestPage from '../../features/gym-owner/pages/OwnerRequestPage.jsx';
import OwnerPayrollPage from '../../features/gym-owner/pages/OwnerPayrollPage.jsx';
import AdminPayrollPage from '../../features/super-admin/pages/AdminPayrollPage.jsx';
import PtPayrollPage from '../../features/pt/pages/PtPayrollPage.jsx';

import BranchAdminLayout from '../layouts/BranchAdminLayout.jsx';
import BranchAdminDashboardPage from '../../features/branch-admin/pages/DashboardPage.jsx';
import BranchAdminUserManagementPage from '../../features/branch-admin/pages/UserManagementPage.jsx';
import BranchAdminPromotionManagementPage from '../../features/branch-admin/pages/PromotionManagementPage.jsx';
import BranchAdminRoomManagementPage from '../../features/branch-admin/pages/RoomManagementPage.jsx';
import BranchAdminPackageManagementPage from '../../features/branch-admin/pages/PackageManagementPage.jsx';
import BranchAdminClassManagementPage from '../../features/branch-admin/pages/ClassManagementPage.jsx';
import BranchAdminLeadManagementPage from '../../features/branch-admin/pages/LeadManagementPage.jsx';
import BranchAdminAttendancePage from '../../features/branch-admin/pages/AttendancePage.jsx';
import BranchAdminRevenueSalesPage from '../../features/branch-admin/pages/RevenueSalesPage.jsx';
import BranchAdminContractsPage from '../../features/branch-admin/pages/ContractPage.jsx';
import BranchAdminFinancialReportsPage from '../../features/branch-admin/pages/FinancialReportsPage.jsx';
import BranchAdminPayrollPage from '../../features/branch-admin/pages/AdminPayrollPage.jsx';
import BranchAdminProfilePage from '../../features/branch-admin/pages/ProfilePage.jsx';
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
          <Route path="trainers" element={<PtPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Staff Dashboard */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashboardPage />} />
          <Route path="profile" element={<StaffProfilePage />} />
          <Route path="attendance" element={<StaffAttendancePage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="leads" element={<LeadManagementPage />} />
          <Route path="payments" element={<StaffPaymentPage />} />
          <Route path="commissions" element={<StaffCommissionPage />} />
        </Route>

        {/* PT Dashboard */}
        <Route path="/pt" element={<PtLayout />}>
          <Route index element={<Navigate to="classes" replace />} />
          <Route path="profile" element={<PtProfilePage />} />
          <Route path="payroll" element={<PtPayrollPage />} />
          <Route path="classes" element={<PtClassManagementPage />} />
          <Route path="leads" element={<LeadManagementPage />} />
          <Route path="commissions" element={<PtCommissionPage />} />
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
          <Route path="payroll" element={<AdminPayrollPage />} />
        </Route>

        {/* Branch Admin Dashboard */}
        <Route path="/branch-admin" element={<BranchAdminLayout />}>
          <Route index element={<BranchAdminDashboardPage />} />
          <Route path="profile" element={<BranchAdminProfilePage />} />
          <Route path="users" element={<BranchAdminUserManagementPage />} />
          <Route path="promo" element={<BranchAdminPromotionManagementPage />} />
          <Route path="rooms" element={<BranchAdminRoomManagementPage />} />
          <Route path="packages" element={<BranchAdminPackageManagementPage />} />
          <Route path="classes" element={<BranchAdminClassManagementPage />} />
          <Route path="leads" element={<BranchAdminLeadManagementPage />} />
          <Route path="attendance" element={<BranchAdminAttendancePage />} />
          <Route path="sales" element={<BranchAdminRevenueSalesPage />} />
          <Route path="contracts" element={<BranchAdminContractsPage />} />
          <Route path="reports" element={<BranchAdminFinancialReportsPage />} />
          <Route path="payroll" element={<BranchAdminPayrollPage />} />
        </Route>

        {/* GymOwner Dashboard */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboardPage />} />
          <Route path="profile" element={<OwnerProfilePage />} />
          <Route path="reports" element={<OwnerFinancialReportsPage />} />
          <Route path="requests" element={<OwnerRequestPage />} />
          <Route path="payroll" element={<OwnerPayrollPage />} />
          <Route path="contracts" element={<ContractsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}