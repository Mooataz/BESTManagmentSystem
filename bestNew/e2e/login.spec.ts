import { test, expect } from '@playwright/test';
import { setupAuthMocks, MOCK_ADMIN_USER, MOCK_COMPANY } from './helpers';

const API_BASE = 'http://localhost:3000';

test.describe('Login page', () => {
  test('should display the login form correctly', async ({ page }) => {
    await page.route(`${API_BASE}/company`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [MOCK_COMPANY] }),
      });
    });

    await page.goto('/');

    await expect(page.getByText('Se connecter')).toBeVisible();
    await expect(page.getByPlaceholder('Utilisateur')).toBeVisible();
    await expect(page.getByPlaceholder('••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Connecte' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.route(`${API_BASE}/company`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [MOCK_COMPANY] }),
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Connecte' }).click();

    await expect(page.getByText('Login requis')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.route(`${API_BASE}/company`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [MOCK_COMPANY] }),
      });
    });

    await page.route(`${API_BASE}/auth/signIn`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Identifiants invalides' }),
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Utilisateur').fill('wrong');
    await page.getByPlaceholder('••••••').fill('wrong');
    await page.getByRole('button', { name: 'Connecte' }).click();

    await expect(page.getByText('Identifiants invalides')).toBeVisible();
  });

  test('should redirect to dashboard on successful login', async ({ page }) => {
    const mockUser = { ...MOCK_ADMIN_USER, token: 'mock-jwt-token' };

    await page.route(`${API_BASE}/company`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [MOCK_COMPANY] }),
      });
    });

    await page.route(`${API_BASE}/auth/signIn`, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        headers: {
          'Set-Cookie': 'access_token=mock-jwt-token; Path=/; HttpOnly; SameSite=Lax',
        },
        body: JSON.stringify({ user: mockUser, token: 'mock-jwt-token' }),
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Utilisateur').fill('admin');
    await page.getByPlaceholder('••••••').fill('password');
    await page.getByRole('button', { name: 'Connecte' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
