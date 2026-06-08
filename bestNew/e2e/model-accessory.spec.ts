import { test, expect } from '@playwright/test';
import { loginAsAdmin, getApiBase } from './helpers';

const API = getApiBase();

test.describe('Model & Accessory Pages', () => {
  test.describe('Accessoires', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.route(`${API}/accessory`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 1, name: 'Chargeur', code: 'ACC001' }, { id: 2, name: 'Coque', code: 'ACC002' }] }) });
      });
      await page.getByText('Modéles et Accessoire').click();
      await page.getByText('Accessoires').click();
    });

    test('should show heading', async ({ page }) => {
      await expect(page.getByText('Liste des accessoires')).toBeVisible();
    });
  });

  test.describe('TypeModel', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.route(`${API}/type-model`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 1, name: 'Smartphone', code: 'T001' }, { id: 2, name: 'Tablette', code: 'T002' }] }) });
      });
      await page.getByText('Modéles et Accessoire').click();
      await page.getByText('Type Modéle').click();
    });

    test('should show heading', async ({ page }) => {
      await expect(page.getByText('Liste des type modèle')).toBeVisible();
    });
  });

  test.describe('Modéles (ListModel)', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.route(`${API}/model`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 1, name: 'Galaxy S21', brand: { name: 'Samsung' } }, { id: 2, name: 'iPhone 13', brand: { name: 'Apple' } }] }) });
      });
      await page.getByText('Modéles et Accessoire').click();
      await page.getByRole('button', { name: 'Modéles', exact: true }).click();
    });

    test('should show heading', async ({ page }) => {
      await expect(page.getByText('List des modèles')).toBeVisible();
    });
  });
});
