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
    await loginPage.login('sales.q1@gymfit.vn', '123456Aa@');
    await expect(page).toHaveURL(/\/staff/);
    await expect(page.locator('.sidebar')).toContainText('Thanh Toán');
    await expect(page.locator('.sidebar')).toContainText('Leads');
  });

  // TC_40
  test('should login successfully as PT', async ({ page }) => {
    await loginPage.login('pt.nguyen@gymfit.vn', '123456Aa@');
    await expect(page).toHaveURL(/\/pt/);
    await expect(page.locator('.sidebar')).toContainText('Lớp Của Tôi');
    await expect(page.locator('.sidebar')).toContainText('Khách Hàng Tiềm Năng');
  });
});
