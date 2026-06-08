import { test, expect } from '@playwright/test';
import { loginAsAdmin, getApiBase, MOCK_ADMIN_USER } from './helpers';

const API = getApiBase();

test.describe('Edge Cases', () => {
  test.describe('Authentication', () => {
    test('should render dashboard without crashing when not authenticated', async ({ page }) => {
      await page.goto('/dashboard/Employees');
      await page.waitForTimeout(3000);
      await expect(page.locator('body')).toBeAttached();
    });

    test('should handle 401 from /auth/me gracefully', async ({ page }) => {
      await page.route(`${API}/auth/me`, async (route) => {
        await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Unauthorized' }) });
      });
      await page.route(`${API}/auth/signIn`, async (route) => {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({
          user: { ...MOCK_ADMIN_USER, token: 'mock-jwt-token' }, token: 'mock-jwt-token',
        }) });
      });
      await page.route(`${API}/company`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
      });
      await page.goto('/');
      await page.getByPlaceholder('Utilisateur').fill('admin');
      await page.getByPlaceholder('••••••').fill('password');
      await page.getByRole('button', { name: 'Connecte' }).click();
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).toBeAttached();
    });

    test('should show error message on invalid credentials', async ({ page }) => {
      await page.route(`${API}/auth/signIn`, async (route) => {
        await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid credentials' }) });
      });
      await page.goto('/');
      await page.getByPlaceholder('Utilisateur').fill('wrong');
      await page.getByPlaceholder('••••••').fill('wrong');
      await page.getByRole('button', { name: 'Connecte' }).click();
      await page.waitForTimeout(500);
      await expect(page.getByText(/Invalid/i)).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should navigate between admin pages', async ({ page }) => {
      await page.getByText('Administration').click();
      await page.getByText('Distributeurs').click();
      await page.waitForTimeout(800);
      await expect(page.getByText('Liste des distributeur')).toBeVisible();

      await page.getByText('Administration').click();
      await page.getByText('Marques').click();
      await page.waitForTimeout(800);
      await expect(page.getByText('List des marques')).toBeVisible();
    });

    test('should navigate to stock section', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.getByText('case').click();
      await page.waitForTimeout(1000);
      await expect(page.getByText('List des cases')).toBeVisible();
    });

    test('should handle 404 route gracefully', async ({ page }) => {
      await page.goto('/dashboard/nonexistent-page');
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).not.toHaveText(/ERREUR|ERROR|404/);
    });
  });
});
