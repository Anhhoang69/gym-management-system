import { Page, expect } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation Links
  get navHome() { return this.page.locator('nav').getByText('Trang chủ', { exact: true }); }
  get navBranches() { return this.page.locator('nav').getByText('Chi nhánh', { exact: true }); }
  get navPT() { return this.page.locator('nav').getByText('Huấn luyện viên', { exact: true }); }
  get navPackages() { return this.page.locator('nav').getByText('Gói tập', { exact: true }); }
  get navClasses() { return this.page.locator('nav').getByText('Lịch tập', { exact: true }); }
  get navAI() { return this.page.locator('nav').getByText('Trợ lý AI', { exact: true }); }
  get navFAQ() { return this.page.locator('nav').getByText('FAQ', { exact: true }); }
  get navContact() { return this.page.locator('nav').getByText('Liên hệ', { exact: true }); }
  get loginButton() { return this.page.locator('nav').getByText('Đăng nhập'); }
  get mobileMenuButton() { return this.page.locator('nav button').last(); }
  async goto() {
    await this.page.goto('/');
  }

  async navigateTo(menu: 'Home' | 'Branches' | 'Packages' | 'PT' | 'Classes' | 'AI' | 'FAQ' | 'Contact') {
    switch (menu) {
      case 'Home': await this.navHome.click(); break;
      case 'Branches': await this.navBranches.click(); break;
      case 'Packages': await this.navPackages.click(); break;
      case 'PT': await this.navPT.click(); break;
      case 'Classes': await this.navClasses.click(); break;
      case 'AI': await this.navAI.click(); break;
      case 'FAQ': await this.navFAQ.click(); break;
      case 'Contact': await this.navContact.click(); break;
    }
  }


  async verifyHeading(headingText: string) {
    await expect(this.page.locator(`h1:has-text("${headingText}"), h2:has-text("${headingText}")`).first()).toBeVisible();
  }
}
