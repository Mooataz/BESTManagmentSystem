import { test, expect } from '@playwright/test';
import { loginAsAdmin, getApiBase, MOCK_BINS, MOCK_REFERENCES, MOCK_PARTS_PRICE } from './helpers';

const API = getApiBase();

test.describe('Stock management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Bins (Cases)', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/bin/find/1`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_BINS }) });
      });
    });

    test('should display bins list', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('case').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('List des cases')).toBeVisible();
      await expect(page.getByText('Case A1')).toBeVisible();
      await expect(page.getByText('Case B2')).toBeVisible();
    });

    test('should open add bin dialog', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('case').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('List des cases')).toBeVisible();
      await page.getByRole('button', { name: /AJOUTER CASE/i }).click();
      await page.waitForTimeout(500);
      await expect(page.getByText('Ajouter une case')).toBeVisible();
    });
  });

  test.describe('References', () => {
    test('should display references page heading', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.getByText('Reférences').click();
      await page.waitForTimeout(800);
      await expect(page.getByText('List des references')).toBeVisible();
    });

    test('should open add reference dialog', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.getByText('Reférences').click();
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: /Ajouter Reference/i }).click();
      await page.waitForTimeout(500);
      await expect(page.getByText('Ajouter une Reference')).toBeVisible();
    });
  });

  test.describe('Parts & Prices', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/parts-price`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_PARTS_PRICE }) });
      });
    });

    test('should display parts prices list', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.getByText('Ajuster Prix des piéces').click();
      await page.waitForTimeout(1000);
      await expect(page.getByText('List des prix')).toBeVisible();
    });

    test('should open add part price dialog', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.getByText('Ajuster Prix des piéces').click();
      await page.waitForTimeout(800);
      await page.getByRole('button', { name: /Ajouter un prix/i }).click();
      await page.waitForTimeout(500);
      await expect(page.getByText('Ajouter un nouvelle Prix')).toBeVisible();
    });
  });
});
