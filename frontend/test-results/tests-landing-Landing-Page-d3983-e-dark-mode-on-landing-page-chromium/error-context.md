# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\landing.spec.ts >> Landing Page Navigation (Member View) >> should toggle dark mode on landing page
- Location: e2e\tests\landing.spec.ts:121:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('nav .flex.items-center.gap-4 button').first()

```

# Test source

```ts
  24  |   // TC_08
  25  |   test('should navigate to Packages page', async ({ page }) => {
  26  |     await landingPage.navigateTo('Packages');
  27  |     await expect(page).toHaveURL(/\/packages/);
  28  |   });
  29  | 
  30  |   // TC_09
  31  |   test('should navigate to PT (Huấn luyện viên) page', async ({ page }) => {
  32  |     await landingPage.navigateTo('PT');
  33  |     await expect(page).toHaveURL(/\/pt/);
  34  |   });
  35  | 
  36  |   // TC_10
  37  |   test('should navigate to FAQ page', async ({ page }) => {
  38  |     await landingPage.navigateTo('FAQ');
  39  |     await expect(page).toHaveURL(/\/faqs/);
  40  |   });
  41  | 
  42  |   // TC_11
  43  |   test('should navigate to Contact page', async ({ page }) => {
  44  |     await landingPage.navigateTo('Contact');
  45  |     await expect(page).toHaveURL(/\/contact/);
  46  |   });
  47  | 
  48  |   // TC_12
  49  |   test('should hide member-only links (Classes, AI) when not logged in', async ({ page }) => {
  50  |     await expect(landingPage.navClasses).toBeHidden();
  51  |     await expect(landingPage.navAI).toBeHidden();
  52  |   });
  53  | 
  54  |   // TC_13
  55  |   test('should redirect to Login page when clicking Đăng nhập', async ({ page }) => {
  56  |     await landingPage.loginButton.click();
  57  |     await expect(page).toHaveURL(/\/login/);
  58  |   });
  59  | 
  60  |   // TC_14
  61  |   test('responsive mobile menu should open on small screens', async ({ page }) => {
  62  |     await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  63  |     await landingPage.mobileMenuButton.click();
  64  |     // Wait for the mobile menu container to slide in (translate-x-0)
  65  |     await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  66  |     await expect(page.locator('.fixed.inset-0.z-50').getByText('Gói tập')).toBeVisible();
  67  |   });
  68  | });
  69  | 
  70  | test.describe('Landing Page Navigation (Member View)', () => {
  71  |   // TC_15
  72  |   test('should display member-only links after login', async ({ page }) => {
  73  |     const loginPage = new LoginPage(page);
  74  |     await loginPage.goto();
  75  |     // Sử dụng account test mà bạn đã setup
  76  |     await loginPage.login('member05@gym.com', 'Member05@');
  77  |     
  78  |     // Đợi nhảy về trang chủ
  79  |     await page.waitForURL(/\/$/);
  80  | 
  81  |     const landingPage = new LandingPage(page);
  82  |     await expect(landingPage.navClasses).toBeVisible();
  83  |     await expect(landingPage.navAI).toBeVisible();
  84  | 
  85  |     // Verify navigate to Classes
  86  |     await landingPage.navigateTo('Classes');
  87  |     await expect(page).toHaveURL(/\/classes/);
  88  |     
  89  |     // Verify navigate to AI
  90  |     await landingPage.navigateTo('AI');
  91  |     await expect(page).toHaveURL(/\/ai/);
  92  |   });
  93  | 
  94  |   // TC_16
  95  |   test('should navigate to member profile', async ({ page }) => {
  96  |     const loginPage = new LoginPage(page);
  97  |     await loginPage.goto();
  98  |     await loginPage.login('member05@gym.com', 'Member05@');
  99  |     await page.waitForURL(/\/$/);
  100 | 
  101 |     // Click vào avatar để mở menu
  102 |     await page.locator('.user-menu').click();
  103 |     await page.getByText('Hồ sơ cá nhân').click();
  104 |     await expect(page).toHaveURL(/\/profile/);
  105 |   });
  106 | 
  107 |   // TC_17
  108 |   test('should navigate to member bookings (Lớp của tôi)', async ({ page }) => {
  109 |     const loginPage = new LoginPage(page);
  110 |     await loginPage.goto();
  111 |     await loginPage.login('member05@gym.com', 'Member05@');
  112 |     await page.waitForURL(/\/$/);
  113 | 
  114 |     // Click vào avatar để mở menu
  115 |     await page.locator('.user-menu').click();
  116 |     await page.getByText('Lớp của tôi').click();
  117 |     await expect(page).toHaveURL(/\/my-bookings/);
  118 |   });
  119 | 
  120 |   // TC_18
  121 |   test('should toggle dark mode on landing page', async ({ page }) => {
  122 |     // Click nút theme (nút đầu tiên trong phần menu bên phải)
  123 |     const themeBtn = page.locator('nav .flex.items-center.gap-4 button').first();
> 124 |     await themeBtn.click();
      |                    ^ Error: locator.click: Test timeout of 30000ms exceeded.
  125 |     await expect(page.locator('html')).toHaveClass(/dark/);
  126 |     
  127 |     await themeBtn.click();
  128 |     await expect(page.locator('html')).not.toHaveClass(/dark/);
  129 |   });
  130 | });
  131 | 
```