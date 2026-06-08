import { test, expect } from '@playwright/test';
import { loginAs, MOCK_ADMIN_USER, MOCK_RECEPTION_USER, MOCK_TECHNICIEN_USER, MOCK_COORDINATEUR_USER, MOCK_STOCK_MANAGER_USER, getApiBase } from './helpers';

const API = getApiBase();

test.describe('Role-based sidebar menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API}/branches`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
      } else {
        await route.fallback();
      }
    });
  });

  test('Administrateur sees all menu sections', async ({ page }) => {
    await loginAs(page, MOCK_ADMIN_USER);
    await expect(page.getByText('Administration')).toBeVisible();
    await expect(page.getByText('Gestion des stocks')).toBeVisible();
    await expect(page.getByText('Reception')).toBeVisible();
    await expect(page.getByText('Coordination')).toBeVisible();
    await expect(page.getByText('Réparation')).toBeVisible();
    await expect(page.getByText('Statistiques')).toBeVisible();
  });

  test('Reception sees Reception + ModelsAccessory + ViewParts + Consulter appareille + Vente', async ({ page }) => {
    await loginAs(page, MOCK_RECEPTION_USER);
    await expect(page.getByText('Reception')).toBeVisible();
    await expect(page.getByText('Consulter appareille')).toBeVisible();
    await expect(page.getByText('Vente')).toBeVisible();

    await expect(page.getByText('Administration')).not.toBeVisible();
    await expect(page.getByText('Réparation')).not.toBeVisible();
    await expect(page.getByText('Coordination')).not.toBeVisible();
  });

  test('Technicien sees Réparation + Consulter appareille', async ({ page }) => {
    await loginAs(page, MOCK_TECHNICIEN_USER);
    await expect(page.getByText('Réparation')).toBeVisible();
    await expect(page.getByText('Consulter appareille')).toBeVisible();
    await expect(page.getByText('Pièces: Disponibilité / Prix')).toBeVisible();

    await expect(page.getByText('Administration')).not.toBeVisible();
    await expect(page.getByText('Reception')).not.toBeVisible();
    await expect(page.getByText('Coordination')).not.toBeVisible();
    await expect(page.getByText('Vente')).not.toBeVisible();
  });

  test('Coordinateur sees Coordination + Consulter appareille', async ({ page }) => {
    await loginAs(page, MOCK_COORDINATEUR_USER);
    await expect(page.getByText('Coordination')).toBeVisible();
    await expect(page.getByText('Consulter appareille')).toBeVisible();
    await expect(page.getByText('Pièces: Disponibilité / Prix')).toBeVisible();

    await expect(page.getByText('Administration')).not.toBeVisible();
    await expect(page.getByText('Reception')).not.toBeVisible();
    await expect(page.getByText('Réparation')).not.toBeVisible();
    await expect(page.getByText('Gestion des stocks')).not.toBeVisible();
    await expect(page.getByText('Vente')).not.toBeVisible();
  });

  test('Gestionnaire de stocks sees Gestion des stocks + Consulter appareille + Vente', async ({ page }) => {
    await loginAs(page, MOCK_STOCK_MANAGER_USER);
    await expect(page.getByText('Gestion des stocks')).toBeVisible();
    await expect(page.getByText('Consulter appareille')).toBeVisible();
    await expect(page.getByText('Vente')).toBeVisible();

    await expect(page.getByText('Administration')).not.toBeVisible();
    await expect(page.getByText('Reception')).not.toBeVisible();
    await expect(page.getByText('Réparation')).not.toBeVisible();
    await expect(page.getByText('Coordination')).not.toBeVisible();
  });
});
