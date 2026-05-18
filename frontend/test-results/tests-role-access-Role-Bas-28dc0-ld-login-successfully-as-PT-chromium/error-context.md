# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\role-access.spec.ts >> Role-Based Access Control >> should login successfully as PT
- Location: e2e\tests\role-access.spec.ts:21:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin/
Received string:  "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://localhost:5173/login"

```

# Page snapshot

```yaml
- generic [ref=e8]:
  - generic [ref=e9]:
    - img "EnerGym" [ref=e11]
    - generic [ref=e12]:
      - paragraph [ref=e13]: Đăng nhập để tiếp tục hành trình thể dục của bạn.
      - generic [ref=e14]:
        - img [ref=e16]
        - generic [ref=e22]: Tập Thông Minh. Luôn Khỏe Mạnh.
      - generic [ref=e23]:
        - img [ref=e25]
        - generic [ref=e30]: Mọi vai trò, một nền tảng.
      - generic [ref=e31]:
        - img [ref=e33]
        - generic [ref=e35]: Quản lý phòng gym mọi lúc, mọi nơi.
  - generic [ref=e37]:
    - heading "Chào Mừng Trở Lại" [level=3] [ref=e38]
    - paragraph [ref=e39]: Đăng nhập để tiếp tục hành trình thể dục của bạn.
    - generic [ref=e40]:
      - generic [ref=e41]: Số điện thoại hoặc Email
      - img [ref=e42]
      - textbox "Nhập email hoặc số điện thoại" [ref=e45]: Pt10@gmail.com
    - generic [ref=e46]:
      - generic [ref=e47]: Mật khẩu
      - img [ref=e48]
      - img [ref=e52] [cursor=pointer]
      - textbox "Nhập mật khẩu" [ref=e55]: Pt10@gmail.com
    - paragraph [ref=e56]: Sai tài khoản hoặc mật khẩu
    - generic [ref=e57]:
      - generic [ref=e58]:
        - checkbox [ref=e59]
        - generic [ref=e60]: Ghi nhớ đăng nhập
      - link "Quên mật khẩu?" [ref=e61] [cursor=pointer]:
        - /url: "#"
    - button "Đăng nhập" [ref=e62] [cursor=pointer]
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
  15 |     await expect(page).toHaveURL(/\/admin/);
  16 |     await expect(page.locator('.sidebar')).toContainText('Bán Hàng');
  17 |     await expect(page.locator('.sidebar')).toContainText('Leads');
  18 |   });
  19 | 
  20 |   // TC_40
  21 |   test('should login successfully as PT', async ({ page }) => {
  22 |     await loginPage.login('Pt10@gmail.com', 'Pt10@gmail.com');
> 23 |     await expect(page).toHaveURL(/\/admin/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  24 |     await expect(page.locator('.sidebar')).toContainText('Lịch Dạy');
  25 |     await expect(page.locator('.sidebar')).toContainText('Hội Viên');
  26 |   });
  27 | });
  28 | 
```