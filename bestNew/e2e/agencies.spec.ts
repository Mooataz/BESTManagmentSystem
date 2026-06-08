import { test, expect } from '@playwright/test';
import { loginAsAdmin, getApiBase, MOCK_BRANCHES } from './helpers';

const API = getApiBase();

test.describe('Agencies CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.route(`${API}/branches`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_BRANCHES }) });
      } else { await route.fallback(); }
    });
  });

  test('should display agencies list', async ({ page }) => {
    await page.getByText('Administration').click();
    await page.getByRole('button', { name: 'Agence' }).click();
    await page.waitForTimeout(800);
    await expect(page.getByText('Agence Centrale')).toBeVisible();
    await expect(page.getByText('Agence Nord')).toBeVisible();
    await expect(page.getByText('Agence Sud')).toBeVisible();
  });

  test('should display add agency button', async ({ page }) => {
    await page.getByText('Administration').click();
    await page.getByRole('button', { name: 'Agence' }).click();
    await page.waitForTimeout(800);
    await expect(page.getByRole('button', { name: /Nouvelle agence/i })).toBeVisible();
  });

  test('should create a new agency', async ({ page }) => {
    await page.route(`${API}/branches/`, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ message: 'Created Successfuly !', status: 201, data: { id: 4, name: 'Agence Test', phone: 99123456, email: 'test@best.tn', location: 'Sousse' } }) });
      } else { await route.fallback(); }
    });

    await page.getByText('Administration').click();
    await page.getByRole('button', { name: 'Agence' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Nouvelle agence/i }).click();
    await page.waitForTimeout(500);

    const inputs = page.getByRole('dialog').locator('input');
    await inputs.nth(0).fill('Agence Test');
    await inputs.nth(1).fill('99123456');
    await inputs.nth(2).fill('test@best.tn');
    await inputs.nth(3).fill('Sousse');

    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Agence Ajouter avec succès !')).toBeVisible();
  });

  test('should edit an existing agency', async ({ page }) => {
    await page.route(`${API}/branches/1`, async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Updated Successfuly !', status: 200, data: { id: 1, name: 'Agence Centrale Updated', phone: 12345678, email: 'central@best.tn', location: 'Tunis' } }) });
      } else { await route.fallback(); }
    });

    await page.getByText('Administration').click();
    await page.getByRole('button', { name: 'Agence' }).click();
    await page.waitForTimeout(800);

    await page.locator('.MuiCard-root').filter({ hasText: 'Agence Centrale' }).locator('.MuiButton-outlined').click();
    await page.waitForTimeout(500);

    const inputs = page.getByRole('dialog').locator('input');
    await inputs.nth(0).fill('Agence Centrale Updated');

    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Mise à jour avec succès !')).toBeVisible();
  });
});
