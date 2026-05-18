import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Role-Based Access Control', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // TC_39
  test('should login successfully as Sales', async ({ page }) => {
    await loginPage.login('Sales10@gmail.com', 'Sales10@gmail.com');
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('.sidebar')).toContainText('Bán Hàng');
    await expect(page.locator('.sidebar')).toContainText('Leads');
  });

  // TC_40
  test('should login successfully as PT', async ({ page }) => {
    await loginPage.login('Pt10@gmail.com', 'Pt10@gmail.com');
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('.sidebar')).toContainText('Lịch Dạy');
    await expect(page.locator('.sidebar')).toContainText('Hội Viên');
  });
});
