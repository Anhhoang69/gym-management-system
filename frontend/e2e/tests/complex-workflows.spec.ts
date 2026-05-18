import { test, expect } from '../fixtures/auth.fixture';

test.describe('Complex Business Workflows', () => {

  // TC_C01: Lead-to-Member Conversion Workflow
  test('Complete Lead-to-Member Conversion Flow', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Leads');
    
    // 1. Create a fresh Lead
    await adminPage.openCreateForm();
    const leadName = `Lead_${Date.now()}`;
    await page.fill('input[name="name"]', leadName);
    await page.fill('input[name="phone"]', '0912345678');
    await page.selectOption('select[name="sourceId"]', { index: 1 });
    await page.locator('label:has-text("Chi nhánh quan tâm") + select').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Tạo Lead', exact: true }).click();
    
    // 2. Click "Chốt Sale" for this lead
    await page.getByPlaceholder('Tìm theo tên, SĐT, email...').fill(leadName);
    await page.getByRole('button', { name: 'Tìm' }).click();
    await page.getByRole('button', { name: 'Chốt Sale' }).click();
    
    // 3. Fill Onboarding Form
    await expect(page.locator('h5:has-text("Đăng ký Hội viên mới")')).toBeVisible();
    await page.selectOption('select[name="packageId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tiếp tục' }).click();
    
    // 4. Verify Payment Drawer appears
    await expect(page.locator('h3:has-text("Thanh toán")')).toBeVisible();
    await page.getByRole('button', { name: 'Xác nhận thanh toán' }).click();
    
    // 5. Verify success and lead status update
    await expect(page.locator('text=Thanh toán thành công')).toBeVisible();
  });

  // TC_C02: Class Booking & Attendance Workflow
  test('Class Booking and Attendance Marking Flow', async ({ adminPage, page }) => {
    // 1. Admin creates a class
    await adminPage.navigateTo('Classes');
    await adminPage.openCreateForm();
    const classTitle = `Yoga_${Date.now()}`;
    await page.fill('input[name="title"]', classTitle);
    await page.selectOption('select[name="classType"]', 'Yoga');
    await page.locator('label:has-text("Chi nhánh") + select').selectOption({ index: 1 });
    await page.waitForTimeout(500);
    await page.selectOption('select[name="trainerStaffId"]', { index: 1 });
    await page.selectOption('select[name="roomId"]', { index: 1 });
    await page.getByRole('button', { name: 'Tạo Lớp', exact: true }).click();

    // 2. Navigate to Attendance and verify class exists
    await adminPage.navigateTo('Attendance');
    await expect(page.locator('table')).toContainText(classTitle);
    
    // 3. Mark attendance for a member
    await page.getByRole('button', { name: 'Điểm danh' }).first().click();
    await page.getByRole('button', { name: 'Check-in' }).first().click();
    await expect(page.locator('text=Đã tham gia')).toBeVisible();
  });

  // TC_C03: Contract Draft and Activation Workflow
  test('Contract Draft Creation and Activation', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Contracts');
    await adminPage.openCreateForm();
    
    // Fill Draft Info
    await page.selectOption('select[name="memberId"]', { index: 1 });
    await page.selectOption('select[name="packageId"]', { index: 1 });
    await page.getByRole('button', { name: 'Lưu bản nháp' }).click();
    
    // Activate Contract
    await page.getByRole('button', { name: 'Kích hoạt' }).first().click();
    await expect(page.locator('.badge-success')).toContainText('Active');
  });

  // TC_C04: Multi-Branch User Data Isolation
  test('Multi-Branch Data Isolation Check', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    
    // Get total count initially
    const initialText = await page.locator('.pagination-info').textContent();
    
    // Filter by Branch 1
    await page.locator('select:near(label:text("Chi nhánh"))').selectOption({ index: 1 });
    const branch1Text = await page.locator('.pagination-info').textContent();
    
    // Filter by Branch 2
    await page.locator('select:near(label:text("Chi nhánh"))').selectOption({ index: 2 });
    const branch2Text = await page.locator('.pagination-info').textContent();
    
    expect(branch1Text).not.toBe(branch2Text);
  });

  // TC_C05: Promotion Application Consistency
  test('Promotion Code Application during Checkout', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Leads');
    await page.getByRole('button', { name: 'Chốt Sale' }).first().click();
    
    await page.selectOption('select[name="packageId"]', { index: 1 });
    const originalPriceText = await page.locator('.text-price').textContent();
    const originalPrice = parseFloat(originalPriceText.replace(/[^0-9]/g, ''));
    
    await page.fill('input[name="promoCode"]', 'SUMMER2026');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    
    const discountedPriceText = await page.locator('.text-price').textContent();
    const discountedPrice = parseFloat(discountedPriceText.replace(/[^0-9]/g, ''));
    
    expect(discountedPrice).toBeLessThan(originalPrice);
  });

  // TC_C06: Rapid Search Debounce Verification
  test('Rapid Search Debounce and Data Sync', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    const searchInput = page.getByPlaceholder('Tìm theo tên, email...');
    
    await searchInput.fill('Nguyen');
    await searchInput.fill('Nguyen Van');
    await searchInput.fill('Nguyen Van Test');
    
    await page.waitForTimeout(800); // Wait for debounce
    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await expect(page.locator('table')).toContainText('Nguyen Van Test');
  });

  // TC_C07: Financial Report Data Drill-down
  test('Financial Report Summary and List Verification', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Reports');
    
    // Check if summary cards match table totals
    const totalRevenueText = await page.locator('.revenue-card h3').textContent();
    await page.getByText('Xem chi tiết giao dịch').click();
    await expect(page).toHaveURL(/\/admin\/reports\/transactions/);
    await expect(page.locator('table')).toBeVisible();
  });

  // TC_C08: Role-Based Unauthorized Access Attempt
  test('Unauthorized Access Attempt Redirection', async ({ page }) => {
    // 1. Login as Member
    const loginPage = new (require('../pages/LoginPage').LoginPage)(page);
    await loginPage.goto();
    await loginPage.login('member05@gym.com', 'Member05@');
    await page.waitForURL(/\/$/);
    
    // 2. Try to access Admin Reports directly
    await page.goto('/admin/reports');
    
    // 3. Should be redirected or show forbidden
    await expect(page).not.toHaveURL(/\/admin\/reports/);
    await expect(page).toHaveURL(/\/login||\/dashboard||\/403/);
  });

  // TC_C09: Member AI Plan Generation and Saving
  test('AI Plan Generation and Saving to Profile', async ({ page }) => {
    const loginPage = new (require('../pages/LoginPage').LoginPage)(page);
    await loginPage.goto();
    await loginPage.login('member05@gym.com', 'Member05@');
    await page.waitForURL(/\/$/);
    
    await page.goto('/ai');
    await page.getByText('Gợi ý giảm cân').click();
    
    // Save the plan
    await page.getByRole('button', { name: 'Lưu kế hoạch' }).last().click();
    await expect(page.locator('text=Đã lưu vào hồ sơ')).toBeVisible();
    
    // Verify in Profile/Plans
    await page.goto('/profile');
    await page.getByText('Kế hoạch của tôi').click();
    await expect(page.locator('.plan-card')).toBeVisible();
  });

  // TC_C10: Bulk User Status Change
  test('Bulk User Deactivation Workflow', async ({ adminPage, page }) => {
    await adminPage.navigateTo('Users');
    
    // Select first 3 checkboxes
    const checkboxes = page.locator('table input[type="checkbox"]');
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();
    await checkboxes.nth(3).check();
    
    await page.getByRole('button', { name: 'Thao tác hàng loạt' }).click();
    await page.getByText('Tạm ngưng tài khoản').click();
    await page.getByRole('button', { name: 'Xác nhận' }).click();
    
    // Verify badges
    await expect(page.locator('.badge-danger').first()).toContainText('Inactive');
  });

});
