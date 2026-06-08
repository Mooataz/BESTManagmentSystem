import { test, expect } from '@playwright/test';
import { loginAsAdmin, getApiBase, MOCK_BINS, MOCK_REFERENCES } from './helpers';

const API = getApiBase();

const MOCK_APPROVE_STOCK = [
  {
    id: 1,
    piece: { id: 1, name: 'Écran' },
    model: { id: 1, name: 'Galaxy S21' },
    quantity: 5,
    state: 'En attente',
    createdDate: '2025-06-01',
  },
  {
    id: 2,
    piece: { id: 2, name: 'Batterie' },
    model: { id: 2, name: 'iPhone 13' },
    quantity: 3,
    state: 'Approuvé',
    createdDate: '2025-05-28',
  },
  {
    id: 3,
    piece: { id: 3, name: 'Vibreur' },
    model: { id: 3, name: 'Galaxy A54' },
    quantity: 2,
    state: 'Rejeté',
    createdDate: '2025-05-20',
  },
];

const MOCK_STOCK_PARTS = [
  {
    id: 1,
    materialCode: 'SP001',
    piece: { id: 1, name: 'Écran' },
    model: { id: 1, name: 'Galaxy S21' },
    imei: '123456789012345',
    bin: { id: 1, name: 'Case A1' },
    typeCase: 'Bon',
    remarque: 'Neuf',
  },
  {
    id: 2,
    materialCode: 'SP002',
    piece: { id: 2, name: 'Batterie' },
    model: { id: 2, name: 'iPhone 13' },
    imei: '987654321098765',
    bin: { id: 2, name: 'Case B2' },
    typeCase: 'Défectueux',
    remarque: 'Usagé',
  },
  {
    id: 3,
    materialCode: 'SP003',
    piece: { id: 3, name: 'Vibreur' },
    model: { id: 3, name: 'Galaxy A54' },
    imei: '555555555555555',
    bin: { id: 1, name: 'Case A1' },
    typeCase: 'Bon',
    remarque: 'Neuf sous blister',
  },
];

const MOCK_TRANSFERS = [
  {
    id: 1,
    reference: { id: 1, materialCode: 'REF001' },
    piece: { id: 1, name: 'Écran' },
    model: { id: 1, name: 'Galaxy S21' },
    quantity: 2,
    fromBranch: { id: 1, name: 'Agence Centrale' },
    toBranch: { id: 2, name: 'Agence Nord' },
    status: 'Envoyé',
    createdDate: '2025-06-05',
  },
  {
    id: 2,
    reference: { id: 2, materialCode: 'REF002' },
    piece: { id: 2, name: 'Batterie' },
    model: { id: 2, name: 'iPhone 13' },
    quantity: 1,
    fromBranch: { id: 1, name: 'Agence Centrale' },
    toBranch: { id: 3, name: 'Agence Sud' },
    status: 'En cours',
    createdDate: '2025-06-03',
  },
];

const MOCK_DEMANTELEMENT_PARTS = [
  { id: 1, piece: { id: 1, name: 'Écran' }, model: { id: 1, name: 'Galaxy S21' }, etat: 'Bon', imei: '111111111111111' },
  { id: 2, piece: { id: 4, name: 'Caméra' }, model: { id: 1, name: 'Galaxy S21' }, etat: 'Défectueux', imei: '111111111111111' },
  { id: 3, piece: { id: 5, name: 'Haut-parleur' }, model: { id: 2, name: 'iPhone 13' }, etat: 'Bon', imei: '222222222222222' },
];

test.describe('Complex Stock Pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Accord piéces (ApproveParts)', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/approve-stock**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_APPROVE_STOCK }),
        });
      });
    });

    test('should render heading and approval items', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Accord piéces').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Pièces en approbation')).toBeVisible();
    });

    test('should show state dropdown for approval items', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Accord piéces').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Pièces en approbation')).toBeVisible();
    });
  });

  test.describe('Etat du stock (EtatStock)', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/stock-parts**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_STOCK_PARTS }),
        });
      });
    });

    test('should render heading and stock parts list', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Etat du stock').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('État de stock')).toBeVisible();
    });

    test('should display stock part details', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Etat du stock').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('État de stock')).toBeVisible();
    });
  });

  test.describe('Remplissage de stock (RemplissageStock)', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/reference**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_REFERENCES }),
        });
      });
      await page.route(`${API}/bin**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_BINS }),
        });
      });
    });

    test('should render heading', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Remplissage de stock').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Remplir le stock')).toBeVisible();
    });
  });

  test.describe('Transfert piéces (TransfertPart)', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/transfer**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_TRANSFERS }),
        });
      });
    });

    test('should render heading and tabs', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Transfert piéces').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Envoyez un transfert.')).toBeVisible();
    });
  });

  test.describe('Reçoit piéces (ReceiveState)', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/transfer/receive**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_TRANSFERS }),
        });
      });
    });

    test('should render heading', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Reçoit piéces').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Accepte un transfert.')).toBeVisible();
    });
  });

  test.describe('Démantèlement (Demantelement)', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/demantelement**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_DEMANTELEMENT_PARTS }),
        });
      });
    });

    test('should render heading', async ({ page }) => {
      await page.getByText('Gestion des stocks').click();
      await page.waitForTimeout(300);
      await page.getByText('Démantèlement').click();
      await page.waitForTimeout(1500);
      await expect(page.getByRole('heading', { name: 'Démantèlement' })).toBeVisible();
    });
  });
});
