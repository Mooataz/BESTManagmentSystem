import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

const API_BASE = 'http://localhost:3000';

test.describe('Dashboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    await page.route(`${API_BASE}/branches`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
    });
  });

  test('should display sidebar with admin menu items', async ({ page }) => {
    await expect(page.getByText('Administration')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gestion des stocks' })).toBeVisible();
    await expect(page.getByText('Reception')).toBeVisible();
    await expect(page.getByText('Coordination')).toBeVisible();
  });

  test('should navigate to Agencies page', async ({ page }) => {
    await page.getByText('Administration').click();
    await page.waitForTimeout(200);

    await page.getByRole('button', { name: 'Agence' }).click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/\/dashboard\/Agencies/);
  });

  test('should navigate to Employees page', async ({ page }) => {
    await page.getByText('Administration').click();
    await page.waitForTimeout(200);

    await page.route(`${API_BASE}/users`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], total: 0, page: 1, limit: 10 }),
      });
    });

    await page.getByText('Employees').click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/\/dashboard\/Employees/);
  });

  test('should navigate to Entreprise page', async ({ page }) => {
    await page.getByText('Administration').click();
    await page.waitForTimeout(200);

    await page.getByText('Entreprise').click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/\/dashboard\/Entreprise/);
  });
});
