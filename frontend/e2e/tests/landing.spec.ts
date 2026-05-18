import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Landing Page Navigation & UI (Guest View)', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.goto();
  });

  // TC_06
  test('should display Home page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/EnerGym/i);
  });

  // TC_07
  test('should navigate to Branches page', async ({ page }) => {
    await landingPage.navigateTo('Branches');
    await expect(page).toHaveURL(/\/branches/);
  });

  // TC_08
  test('should navigate to Packages page', async ({ page }) => {
    await landingPage.navigateTo('Packages');
    await expect(page).toHaveURL(/\/packages/);
  });

  // TC_09
  test('should navigate to PT (Huấn luyện viên) page', async ({ page }) => {
    await landingPage.navigateTo('PT');
    await expect(page).toHaveURL(/\/pt/);
  });

  // TC_10
  test('should navigate to FAQ page', async ({ page }) => {
    await landingPage.navigateTo('FAQ');
    await expect(page).toHaveURL(/\/faqs/);
  });

  // TC_11
  test('should navigate to Contact page', async ({ page }) => {
    await landingPage.navigateTo('Contact');
    await expect(page).toHaveURL(/\/contact/);
  });

  // TC_12
  test('should hide member-only links (Classes, AI) when not logged in', async ({ page }) => {
    await expect(landingPage.navClasses).toBeHidden();
    await expect(landingPage.navAI).toBeHidden();
  });

  // TC_13
  test('should redirect to Login page when clicking Đăng nhập', async ({ page }) => {
    await landingPage.loginButton.click();
    await expect(page).toHaveURL(/\/login/);
  });

  // TC_14
  test('responsive mobile menu should open on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await landingPage.mobileMenuButton.click();
    // Wait for the mobile menu container to slide in (translate-x-0)
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    await expect(page.locator('.fixed.inset-0.z-50').getByText('Gói tập')).toBeVisible();
  });
});

test.describe('Landing Page Navigation (Member View)', () => {
  // TC_15
  test('should display member-only links after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // Sử dụng account test mà bạn đã setup
    await loginPage.login('member05@gym.com', 'Member05@');
    
    // Đợi nhảy về trang chủ
    await page.waitForURL(/\/$/);

    const landingPage = new LandingPage(page);
    await expect(landingPage.navClasses).toBeVisible();
    await expect(landingPage.navAI).toBeVisible();

    // Verify navigate to Classes
    await landingPage.navigateTo('Classes');
    await expect(page).toHaveURL(/\/classes/);
    
    // Verify navigate to AI
    await landingPage.navigateTo('AI');
    await expect(page).toHaveURL(/\/ai/);
  });

  // TC_16
  test('should navigate to member profile', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('member05@gym.com', 'Member05@');
    await page.waitForURL(/\/$/);

    // Click vào avatar để mở menu
    await page.locator('.user-menu').click();
    await page.getByText('Hồ sơ cá nhân').click();
    await expect(page).toHaveURL(/\/profile/);
  });

  // TC_17
  test('should navigate to member bookings (Lớp của tôi)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('member05@gym.com', 'Member05@');
    await page.waitForURL(/\/$/);

    // Click vào avatar để mở menu
    await page.locator('.user-menu').click();
    await page.getByText('Lớp của tôi').click();
    await expect(page).toHaveURL(/\/my-bookings/);
  });

  // TC_18
  test('should toggle dark mode on landing page', async ({ page }) => {
    // Click nút theme (nút đầu tiên trong phần menu bên phải)
    const themeBtn = page.locator('nav .flex.items-center.gap-4 button').first();
    await themeBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    await themeBtn.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
});
