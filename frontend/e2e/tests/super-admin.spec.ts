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
    await page.getByPlaceholder('Tìm theo tên, email...').fill('anh');
    await page.waitForTimeout(600);
    await expect(page.locator('table')).toContainText('Anh');
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
    await page.fill('input[name="password"]', '123456Aa@');
    const randomPhone = '0' + Math.floor(100000000 + Math.random() * 900000000).toString();
    await page.fill('input[name="phoneNumber"]', randomPhone);
    await page.selectOption('select[name="gender"]', 'Female');
    await page.fill('input[name="birthday"]', '2004-02-02');
    await page.fill('input[name="address"]', 'KTX Khu B ĐHQG HCM');
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
    await page.fill('input[name="password"]', '123456Aa@');
    const randomPhone = '0' + Math.floor(100000000 + Math.random() * 900000000).toString();
    await page.fill('input[name="phoneNumber"]', randomPhone);
    await page.selectOption('select[name="gender"]', 'Male');
    await page.fill('input[name="birthday"]', '1995-05-15');
    await page.fill('input[name="address"]', 'Hồ Chí Minh');
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
    await page.fill('input[name="password"]', '123456Aa@');
    const randomPhone = '0' + Math.floor(100000000 + Math.random() * 900000000).toString();
    await page.fill('input[name="phoneNumber"]', randomPhone);
    await page.selectOption('select[name="gender"]', 'Male');
    await page.fill('input[name="birthday"]', '1993-08-20');
    await page.fill('input[name="address"]', 'Hà Nội');
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
    await page.fill('input[name="password"]', '123456Aa@');
    const randomPhone = '0' + Math.floor(100000000 + Math.random() * 900000000).toString();
    await page.fill('input[name="phoneNumber"]', randomPhone);
    await page.selectOption('select[name="gender"]', 'Female');
    await page.fill('input[name="birthday"]', '1998-12-10');
    await page.fill('input[name="address"]', 'Đà Nẵng');
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
    // Chọn chi nhánh Quận 1 để đảm bảo có phòng và HLV
    await page.locator('label:has-text("Chi nhánh") + select').selectOption({ label: 'GymFit Quận 1' });

    // Đợi cho đến khi dropdown Phòng tập load xong options
    await page.locator('select[name="roomId"] option').nth(1).waitFor({ state: 'attached' });

    await page.selectOption('select[name="trainerStaffId"]', { index: 1 });
    await page.selectOption('select[name="roomId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tạo Lớp', exact: true }).click();
    await expect(page.locator('.modal-content')).toBeHidden();
  });

  // TC_37
  test('should create a new Room', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Rooms');
    await adminPage.openCreateForm();
    await page.selectOption('select[name="branchId"]', { label: 'GymFit Quận 1' });
    await page.fill('input[name="name"]', 'Phòng Yoga Pro');
    await page.fill('input[name="roomNumber"]', `YOGA_${Date.now().toString().slice(-4)}`);
    await page.fill('input[name="capacity"]', '25');
    await page.getByRole('button', { name: 'Lưu', exact: true }).click();
    await expect(page.locator('table')).toContainText('Phòng Yoga Pro');
  });

  // TC_38
  test('should navigate to admin profile from header', async ({ adminPage, page }) => {
    // Mở dropdown avatar
    await page.getByText('Quản Trị Viên').click();
    await page.getByText('Hồ sơ cá nhân').click();
    await expect(page).toHaveURL(/\/admin\/profile/);
  });
});
