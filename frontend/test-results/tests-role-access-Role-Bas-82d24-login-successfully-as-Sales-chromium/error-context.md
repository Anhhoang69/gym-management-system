# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\role-access.spec.ts >> Role-Based Access Control >> should login successfully as Sales
- Location: e2e\tests\role-access.spec.ts:13:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin/
Received string:  "http://localhost:5173/staff"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    4 × unexpected value "http://localhost:5173/login"
    4 × unexpected value "http://localhost:5173/staff"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Staff Portal (Sales & Receptionist)" [level=2] [ref=e5]
  - generic [ref=e6]:
    - complementary [ref=e7]:
      - navigation [ref=e8]:
        - list [ref=e9]:
          - listitem [ref=e10]: Dashboard
    - main [ref=e11]:
      - generic [ref=e12]:
        - heading "Staff Dashboard" [level=1] [ref=e13]
        - paragraph [ref=e14]: Welcome to the Staff Portal. Here you can manage sales and front desk operations.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from '../pages/LoginPage';
  3  | 
  4  | test.describe('Role-Based Access Control', () => {
  5  |   let loginPage: LoginPage;
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     loginPage = new LoginPage(page);
  9  |     await loginPage.goto();
  10 |   });
  11 | 
  12 |   // TC_39
  13 |   test('should login successfully as Sales', async ({ page }) => {
  14 |     await loginPage.login('Sales10@gmail.com', 'Sales10@gmail.com');
> 15 |     await expect(page).toHaveURL(/\/admin/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  16 |     await expect(page.locator('.sidebar')).toContainText('Bán Hàng');
  17 |     await expect(page.locator('.sidebar')).toContainText('Leads');
  18 |   });
  19 | 
  20 |   // TC_40
  21 |   test('should login successfully as PT', async ({ page }) => {
  22 |     await loginPage.login('Pt10@gmail.com', 'Pt10@gmail.com');
  23 |     await expect(page).toHaveURL(/\/admin/);
  24 |     await expect(page.locator('.sidebar')).toContainText('Lịch Dạy');
  25 |     await expect(page.locator('.sidebar')).toContainText('Hội Viên');
  26 |   });
  27 | });
  28 | 
```