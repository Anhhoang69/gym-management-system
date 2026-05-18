import { test, expect } from '../fixtures/auth.fixture';

test.describe('Super Admin Dashboard & CRUD', () => {

  // --- USER MANAGEMENT ---
  // TC_19
  test('should navigate to User Management and view list', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.locator('table')).toBeVisible();
  });

  // TC_20
  test('should filter users by Role', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');

    // Chọn vai trò Member từ dropdown (sử dụng label để an toàn hơn)
    await page.locator('select.form-select').first().selectOption({ label: 'Member' });

    // Sử dụng assertion có sẵn cơ chế auto-retry của Playwright (mặc định 5s)
    // Thay vì dùng count() và toBeGreaterThan(0) - vốn không tự động retry
    await expect(page.locator('table')).toContainText('Member');

    // Kiểm tra dòng đầu tiên xem có đúng là Member không
    const firstUserRole = page.locator('table tbody tr').first().locator('td').nth(2);
    await expect(firstUserRole).toContainText('Member');
  });

  // TC_21
  test('should search users by name or email', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    await page.getByPlaceholder('Tìm theo tên, email...').fill('Nguyen Van Test');
    await page.waitForTimeout(600);
    await expect(page.locator('table')).toContainText('Nguyen Van Test');
  });

  // --- PROMOTION MANAGEMENT ---
  // TC_22
  test('should navigate to Promotion Management and view list', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Promotions');
    await expect(page).toHaveURL(/\/admin\/promo/);
    await expect(page.locator('h3:has-text("Mã Giảm Giá")')).toBeVisible();
  });

  // --- BRANCH MANAGEMENT ---
  // TC_23
  test('should view list of branches', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Branches');
    await expect(page).toHaveURL(/\/admin\/branches/);
  });

  // --- ROOM MANAGEMENT ---
  // TC_24
  test('should navigate to Room Management', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Rooms');
    await expect(page).toHaveURL(/\/admin\/rooms/);
  });

  // --- CLASS MANAGEMENT ---
  // TC_25
  test('should navigate to Class Management', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Classes');
    await expect(page).toHaveURL(/\/admin\/classes/);
  });

  // --- LEADS MANAGEMENT ---
  // TC_26
  test('should navigate to Leads Management', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Leads');
    await expect(page).toHaveURL(/\/admin\/leads/);
  });

  // --- SALES MANAGEMENT ---
  // TC_27
  test('should navigate to Sales Management', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Sales');
    await expect(page).toHaveURL(/\/admin\/sales/);
  });

  // --- CONTRACTS MANAGEMENT ---
  // TC_28
  test('should navigate to Contracts Management', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Contracts');
    await expect(page).toHaveURL(/\/admin\/contracts/);
  });

  // --- ATTENDANCE MANAGEMENT ---
  // TC_29
  test('should navigate to Attendance Management', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Attendance');
    await expect(page).toHaveURL(/\/admin\/attendance/);
  });

  // --- FINANCIAL REPORTS ---
  // TC_30
  test('should navigate to Financial Reports', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Reports');
    await expect(page).toHaveURL(/\/admin\/reports/);
  });

  // TC_31
  test('should logout successfully from Admin dashboard', async ({ adminPage, page }) => {
    // Click vào khu vực Avatar/Tên người dùng để mở dropdown
    await page.getByText('Quản Trị Viên').click();
    // Click vào nút Đăng xuất trong menu
    await page.locator('.dropdown-item', { hasText: 'Đăng xuất' }).click();
    // Kiểm tra đã quay về trang login chưa
    await expect(page).toHaveURL(/\/login/);
  });

  // --- ADDITIONAL CREATION TESTS ---

  // TC_32
  test('should create a new Member user', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    await adminPage.openCreateForm();
    await page.fill('input[name="fullName"]', 'Nguyen Member Test');
    await page.fill('input[name="email"]', `member_${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'Member@123');
    await page.selectOption('select[name="role"]', 'Member');
    await page.selectOption('select[name="branchId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tạo', exact: true }).click();
    await expect(page.locator('table')).toContainText('Nguyen Member Test');
  });

  // TC_33
  test('should create a new Sales staff', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    await adminPage.openCreateForm();
    await page.fill('input[name="fullName"]', 'Nguyen Sales Test');
    await page.fill('input[name="email"]', `sales_${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'Sales@123');
    await page.selectOption('select[name="role"]', 'Staff');
    await page.selectOption('select[name="staffPosition"]', 'Sales');
    await page.selectOption('select[name="branchId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tạo', exact: true }).click();
    await expect(page.locator('table')).toContainText('Nguyen Sales Test');
  });

  // TC_34
  test('should create a new PT staff', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    await adminPage.openCreateForm();
    await page.fill('input[name="fullName"]', 'Nguyen PT Test');
    await page.fill('input[name="email"]', `pt_${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'PT@123');
    await page.selectOption('select[name="role"]', 'Staff');
    await page.selectOption('select[name="staffPosition"]', 'PT');
    await page.selectOption('select[name="branchId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tạo', exact: true }).click();
    await expect(page.locator('table')).toContainText('Nguyen PT Test');
  });

  // TC_35
  test('should create a new Receptionist staff', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    await adminPage.openCreateForm();
    await page.fill('input[name="fullName"]', 'Nguyen Recep Test');
    await page.fill('input[name="email"]', `recep_${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'Recep@123');
    await page.selectOption('select[name="role"]', 'Staff');
    await page.selectOption('select[name="staffPosition"]', 'Receptionist');
    await page.selectOption('select[name="branchId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tạo', exact: true }).click();
    await expect(page.locator('table')).toContainText('Nguyen Recep Test');
  });

  // TC_36
  test('should create a new Class', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Classes');
    await adminPage.openCreateForm();
    await page.fill('input[name="title"]', 'Lớp Yoga Buổi Sáng');
    await page.selectOption('select[name="classType"]', 'Yoga');
    // Chọn chi nhánh đầu tiên có sẵn
    await page.locator('label:has-text("Chi nhánh") + select').selectOption({ index: 1 });
    await page.waitForTimeout(500); // Đợi load HLV/Phòng
    await page.selectOption('select[name="trainerStaffId"]', { index: 1 });
    await page.selectOption('select[name="roomId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tạo Lớp', exact: true }).click();
    await expect(page.locator('.modal-content')).toBeHidden();
  });

  // TC_37
  test('should create a new Lead', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Leads');
    await adminPage.openCreateForm();
    await page.fill('input[name="name"]', 'Khách hàng tiềm năng');
    await page.fill('input[name="phone"]', '0987654321');
    await page.selectOption('select[name="sourceId"]', { index: 1 });
    await page.locator('label:has-text("Chi nhánh quan tâm") + select').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Tạo Lead', exact: true }).click();
    await expect(page.locator('table')).toContainText('Khách hàng tiềm năng');
  });

  // TC_38
  test('should navigate to admin profile from header', async ({ adminPage, page }) => {
    // Mở dropdown avatar
    await page.getByText('Quản Trị Viên').click();
    await page.getByText('Hồ sơ cá nhân').click();
    await expect(page).toHaveURL(/\/admin\/profile/);
  });
});
