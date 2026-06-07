import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';

type AdminFixtures = {
  adminPage: AdminPage;
};

export const test = base.extend<AdminFixtures>({
  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('superadmin@gymfit.vn', '123456Aa@');
    await page.waitForURL(/\/admin/);

    const adminPage = new AdminPage(page);
    await use(adminPage);
  },
});
export { expect } from '@playwright/test';
