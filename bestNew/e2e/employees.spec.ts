import { test, expect } from '@playwright/test';
import { loginAsAdmin, getApiBase, MOCK_EMPLOYEES } from './helpers';

const API = getApiBase();

test.describe('Employees page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API}/users`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_EMPLOYEES, total: MOCK_EMPLOYEES.length, page: 1, limit: 10 }) });
      } else { await route.fallback(); }
    });
    await loginAsAdmin(page);
  });

  test('should display employees list', async ({ page }) => {
    await page.getByText('Administration').click();
    await page.getByText('Employees').click();
    await page.waitForTimeout(800);
    await expect(page.getByText('Jean Dupont')).toBeVisible();
    await expect(page.getByText('Marie Leblanc')).toBeVisible();
    await expect(page.getByText('Pierre Moreau')).toBeVisible();
  });

  test('should open add employee dialog', async ({ page }) => {
    await page.getByText('Administration').click();
    await page.getByText('Employees').click();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /Ajouter un employèe/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Ajouter un nouvelle employèe')).toBeVisible();
  });

  test('should create a new employee', async ({ page }) => {
    await page.route(`${API}/users`, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ message: 'User created Successfuly', status: 201, data: { id: 4, name: 'Nouvel Employé', login: 'nemp', role: ['Technicien'], status: 'active' } }) });
      } else { await route.fallback(); }
    });

    await page.getByText('Administration').click();
    await page.getByText('Employees').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Ajouter un employèe/i }).click();
    await page.waitForTimeout(500);

    const inputs = page.getByRole('dialog').locator('input');
    await inputs.nth(0).fill('Nouvel Employé');
    await inputs.nth(1).fill('99123456');
    await inputs.nth(2).fill('nemp');
    await inputs.nth(3).fill('password123');

    await page.getByRole('button', { name: 'Confirmer' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Ajouter avec succès !')).toBeVisible();
  });

  test('should edit an employee', async ({ page }) => {
    await page.route(`${API}/users/1`, async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'User updates successfuly !', status: 200, data: { id: 1, ...MOCK_EMPLOYEES[0], role: ['Technicien'] } }) });
      } else { await route.fallback(); }
    });

    await page.getByText('Administration').click();
    await page.getByText('Employees').click();
    await page.waitForTimeout(800);
    await page.locator('table span[style*="cursor: pointer"]').first().click();
    await page.waitForTimeout(500);
    await expect(page.getByText("Modifier l'employèe")).toBeVisible();
  });
});
