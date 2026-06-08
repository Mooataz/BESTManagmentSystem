import { test, expect, Page } from '@playwright/test';
import { loginAsAdmin, getApiBase } from './helpers';

const MOCK_REPAIRS = [
  {
    id: 1,
    reparationNumber: 'R001',
    customer: { name: 'Client A' },
    phone: '99123456',
    imei: '123456789012345',
    brand: { name: 'Samsung' },
    model: { name: 'Galaxy S21' },
    stateDevice: 'Bon',
    lastStep: 'Affecter',
  },
  {
    id: 2,
    reparationNumber: 'R002',
    customer: { name: 'Client B' },
    phone: '99876543',
    imei: '987654321098765',
    brand: { name: 'Apple' },
    model: { name: 'iPhone 13' },
    stateDevice: 'Mauvais',
    lastStep: 'Affecter',
  },
];

const API_BASE = getApiBase();

async function mockRepairsApi(page: Page, endpoint: string, data: unknown[] = MOCK_REPAIRS) {
  await page.route(`${API_BASE}${endpoint}`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: data }) });
  });
}

async function navigateInSidebar(page: Page, section: string, child: string) {
  await page.getByText(section).click();
  await page.getByRole('button', { name: child, exact: true }).click();
}

test.describe('Coordination & Reparation Pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Reparation', () => {
    test('Reçoit depuis Affectation - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/reparation/repairs?step=Affecter');
      await mockRepairsApi(page, '/api/reparation/repairs?step=Affecter&page=1&limit=10');
      await navigateInSidebar(page, 'Réparation', 'Reçoit depuis Affectation');
      await expect(page.getByText('Accepter les affectations')).toBeVisible();
    });

    test('Liste Réparation - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/reparation/repairs?step=On%20r%C3%A9paration');
      await mockRepairsApi(page, '/api/reparation/repairs?step=On%20r%C3%A9paration&page=1&limit=10');
      await navigateInSidebar(page, 'Réparation', 'Liste Réparation');
      await expect(page.getByText('List des rèparations en cours')).toBeVisible();
    });
  });

  test.describe('Coordination', () => {
    test('Reçoit depuis reception - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/reparation/repairs?step=Envoy%C3%A9%20%C3%A0%20affecter');
      await mockRepairsApi(page, '/api/reparation/repairs?step=Envoy%C3%A9%20%C3%A0%20affecter&page=1&limit=10');
      await navigateInSidebar(page, 'Coordination', 'Reçoit depuis reception');
      await expect(page.getByText('Reçoit les produit')).toBeVisible();
    });

    test('Affectation - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/reparation/repairs?step=On%20affectation');
      await mockRepairsApi(page, '/api/reparation/repairs?step=On%20affectation&page=1&limit=10');
      await navigateInSidebar(page, 'Coordination', 'Affectation');
      await expect(page.getByText('List affectation')).toBeVisible();
    });

    test('Réaffectation - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/reparation/repairs?step=R%C3%A9affectation');
      await mockRepairsApi(page, '/api/reparation/repairs?step=R%C3%A9affectation&page=1&limit=10');
      await navigateInSidebar(page, 'Coordination', 'Réaffectation');
      await expect(page.getByText('Réaffectation')).toBeVisible();
    });

    test('Accepter CQ - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/reparation/repairs?step=Envoy%C3%A9%20%C3%A0%20CQ');
      await mockRepairsApi(page, '/api/reparation/repairs?step=Envoy%C3%A9%20%C3%A0%20CQ&page=1&limit=10');
      await navigateInSidebar(page, 'Coordination', 'Accepter CQ');
      await expect(page.getByText('Accepter pour controler')).toBeVisible();
    });

    test('Validation CQ - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/reparation/repairs?step=CQ');
      await mockRepairsApi(page, '/api/reparation/repairs?step=CQ&page=1&limit=10');
      await navigateInSidebar(page, 'Coordination', 'Validation CQ');
      await expect(page.getByText('Controle qualité')).toBeVisible();
    });

    test('Transfert produit - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/transfer');
      await navigateInSidebar(page, 'Coordination', 'Transfert produit');
      await expect(page.getByText('Transfert produit')).toBeVisible();
    });
  });

  test.describe('View Parts', () => {
    test('Pièces: Disponibilité / Prix - loads and displays heading', async ({ page }) => {
      await mockRepairsApi(page, '/api/parts');
      await page.getByText('Pièces: Disponibilité / Prix').click();
      await expect(page.getByText('Pièces : Disponibilité / Prix')).toBeVisible();
    });
  });
});
