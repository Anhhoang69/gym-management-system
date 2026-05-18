import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication Module', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // TC_01
  test('should login successfully as Super Admin and redirect to /admin', async ({ page }) => {
    // Note: Use a valid mock or test account in the real environment
    await loginPage.login('superadmin@gym.com', 'Admin@123');
    await expect(page).toHaveURL(/\/admin/);
  });

  // TC_02
  test('should login successfully as Member and redirect to home /', async ({ page }) => {
    await loginPage.login('member05@gym.com', 'Member05@');
    await expect(page).toHaveURL(/\/$/);
  });

  // TC_03
  test('should show error message when login with invalid password', async () => {
    await loginPage.login('superadmin@gym.com', 'WrongPassword123');
    await loginPage.verifyLoginError();
  });

  // TC_04
  test('should show error message when login with unregistered email', async () => {
    await loginPage.login('notfound@energym.com', 'Password123');
    await loginPage.verifyLoginError();
  });

  // TC_05
  test('should keep user logged in after page reload if "Remember me" is checked', async ({ page }) => {
    // In a real scenario, we might intercept the login request or use a real login
    await loginPage.login('superadmin@gym.com', 'Admin@123');
    await expect(page).toHaveURL(/\/admin/);

    await page.reload();
    await expect(page).toHaveURL(/\/admin/); // Vẫn ở admin không bị đá về login
  });
});
