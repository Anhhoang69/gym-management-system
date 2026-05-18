import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  get emailInput() { return this.page.getByTestId('login-email-input'); }
  get passwordInput() { return this.page.getByTestId('login-password-input'); }
  get submitButton() { return this.page.getByTestId('login-submit-button'); }
  get errorMessage() { return this.page.locator('text=Sai tài khoản hoặc mật khẩu'); }

  async goto() {
    await this.page.goto('/login');
  }

  async login(emailOrPhone: string, pass: string) {
    await this.emailInput.fill(emailOrPhone);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
