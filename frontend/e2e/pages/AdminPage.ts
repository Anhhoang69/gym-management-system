import { Page, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Sidebar navigation
  get menuDashboard() { return this.page.locator('.sidebar, nav').getByText('Tổng Quan', { exact: true }); }
  get menuPackages() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Gói Tập', { exact: false }); }
  get menuUsers() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Người Dùng', { exact: false }); }
  get menuPromotions() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Khuyến Mãi', { exact: false }); }
  get menuBranches() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Chi Nhánh', { exact: false }); }
  get menuRooms() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Phòng', { exact: false }); }
  get menuClasses() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Lớp Học', { exact: false }); }
  get menuLeads() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Leads', { exact: false }); }
  get menuSales() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Bán Hàng', { exact: false }); }
  get menuContracts() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Hợp Đồng', { exact: false }); }
  get menuAttendance() { return this.page.locator('.sidebar, nav').getByText('Quản Lý Điểm Danh', { exact: false }); }
  get menuReports() { return this.page.locator('.sidebar, nav').getByText('Báo Cáo', { exact: false }); }
  // Packages management elements
  get createPackageBtn() { return this.page.locator('button:has-text("Tạo Gói Mới"), button:has-text("Thêm mới")'); }
  get packageGrid() { return this.page.locator('.grid, table'); }
  get firstPackageEditBtn() { return this.page.locator('button[title="Chỉnh sửa"]').first(); }
  get firstPackageDeleteBtn() { return this.page.locator('button[title="Xóa"]').first(); }
  get confirmDeleteBtn() { return this.page.locator('button:has-text("Xác Nhận"), button:has-text("Đồng ý")'); }
  get createBtn() { return this.page.getByRole('button', { name: /\+ (Tạo|Thêm)/i }); }

  // Form elements
  get formSaveBtn() { return this.page.locator('button[type="submit"], button:has-text("Lưu")'); }

  async goto() {
    await this.page.goto('/admin');
  }

  async navigateTo(menu: 'Dashboard' | 'Packages' | 'Users' | 'Promotions' | 'Branches' | 'Rooms' | 'Classes' | 'Leads' | 'Sales' | 'Contracts' | 'Attendance' | 'Reports') {
    switch (menu) {
      case 'Dashboard': await this.menuDashboard.click(); break;
      case 'Packages': await this.menuPackages.click(); break;
      case 'Users': await this.menuUsers.click(); break;
      case 'Promotions': await this.menuPromotions.click(); break;
      case 'Branches': await this.menuBranches.click(); break;
      case 'Rooms': await this.menuRooms.click(); break;
      case 'Classes': await this.menuClasses.click(); break;
      case 'Leads': await this.menuLeads.click(); break;
      case 'Sales': await this.menuSales.click(); break;
      case 'Contracts': await this.menuContracts.click(); break;
      case 'Attendance': await this.menuAttendance.click(); break;
      case 'Reports': await this.menuReports.click(); break;
    }
  }

  async openCreatePackageForm() {
    await this.createPackageBtn.click();
    await this.page.waitForSelector('.modal-content', { state: 'visible' });
  }

  async confirmDelete() {
    await this.confirmDeleteBtn.click();
  }

  async openCreateForm() {
    await this.createBtn.first().click();
  }
}
