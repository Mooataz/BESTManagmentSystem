import { test, expect } from '@playwright/test';
import { loginAsAdmin, getApiBase } from './helpers';

const API = getApiBase();

const MOCK_REPAIRS = [
  {
    id: 1,
    customer: { id: 1, name: 'Jean Dupont', phone: 55123456 },
    device: { id: 10, serialenumber: 'IMEI001', model: { id: 1, name: 'Galaxy S21', brand: { id: 1, name: 'Samsung' } } },
    deviceStateReceive: 'Bon état',
    historyRepair: [{ id: 1, date: '2025-01-10T10:00:00Z', step: 'Création' }],
  },
  {
    id: 2,
    customer: { id: 2, name: 'Marie Leclerc', phone: 55876543 },
    device: { id: 11, serialenumber: 'IMEI002', model: { id: 2, name: 'iPhone 13', brand: { id: 2, name: 'Apple' } } },
    deviceStateReceive: 'Cassé écran',
    historyRepair: [{ id: 2, date: '2025-01-11T14:00:00Z', step: 'Création' }],
  },
];

const MOCK_OUTPUTS = [
  {
    id: 1,
    customer: { id: 1, name: 'Jean Dupont', phone: 55123456 },
    remark: 'Récupéré',
    date: '2025-02-01T09:00:00Z',
    user: { id: 1, name: 'Admin BEST' },
  },
  {
    id: 2,
    customer: { id: 3, name: 'Paul Martin', phone: 55654321 },
    remark: 'Sous garantie',
    date: '2025-02-02T11:00:00Z',
    user: { id: 1, name: 'Admin BEST' },
  },
];

const MOCK_SALES = [
  {
    id: 1, date: '2025-03-01T10:00:00Z', state: 'En attente',
    user: { id: 1, name: 'Admin BEST' },
    details: { items: [{ allPartId: 1, allPartName: 'Écran LCD', quantity: 1, unitPrice: 150 }] },
  },
  {
    id: 2, date: '2025-03-02T15:00:00Z', state: 'Validé',
    user: { id: 1, name: 'Admin BEST' },
    validatedBy: { id: 1, name: 'Admin BEST' }, validatedAt: '2025-03-03T10:00:00Z',
    details: { items: [{ allPartId: 2, allPartName: 'Batterie', quantity: 2, unitPrice: 80 }] },
  },
];

const MOCK_DEVICES_HISTORY = [
  {
    id: 10, serialenumber: 'IMEI001', purchaseDate: '2024-06-01',
    model: { id: 1, name: 'Galaxy S21', brand: { name: 'Samsung' }, typeModel: { name: 'Smartphone' } },
    repair: [
      {
        id: 1, warrenty: false, deviceStateReceive: 'Bon état',
        customer: { id: 1, name: 'Jean Dupont', phone: 55123456 },
        historyRepair: [{ id: 1, date: '2025-01-10T10:00:00Z', step: 'Création', tracability: [{ id: 1, user: { id: 1, name: 'Admin BEST', branch: { id: 1, name: 'Agence Centrale' } } }] }],
      },
    ],
  },
];

async function mockRepairByBranch(page: any) {
  await page.route(`${API}/repair/findByActuellyBranch/*`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_REPAIRS }) });
  });
}

async function mockByBranchStep(page: any, step: string) {
  await page.route(`${API}/repair/byBranchAndStep?branchId=*&step=${encodeURIComponent(step)}`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_REPAIRS }) });
  });
}

async function mockGenericRepairRoute(page: any) {
  await page.route(`${API}/repair/byBranchAndStep*`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_REPAIRS }) });
  });
  await page.route(`${API}/repair/findByActuellyBranch/*`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_REPAIRS }) });
  });
}

async function mockCustomers(page: any) {
  await page.route(`${API}/customers`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
  });
}

async function mockDistributers(page: any) {
  await page.route(`${API}/distributeur`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
  });
}

test.describe('Reception Workflow Pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Etatproduit (ListRepair) - "List des réparations"', () => {
    test.beforeEach(async ({ page }) => {
      await mockRepairByBranch(page);
    });

    test('should display heading and repair rows', async ({ page }) => {
      await page.goto('/dashboard/ListRepair');
      await page.waitForTimeout(1500);
      await expect(page.getByText('List des réparations')).toBeVisible();
      await expect(page.getByText('Galaxy S21')).toBeVisible();
      await expect(page.getByText('iPhone 13')).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.getByText('Reception').click();
      await page.waitForTimeout(300);
      await page.getByText('Etat des produit').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('List des réparations')).toBeVisible();
    });
  });

  test.describe('Envoyeraffectation (SendToAssign) - "Envoyé à Affectation"', () => {
    test.beforeEach(async ({ page }) => {
      await mockByBranchStep(page, 'Création');
    });

    test('should display heading and repair rows', async ({ page }) => {
      await page.goto('/dashboard/EnvoyeAffectation');
      await page.waitForTimeout(1500);
      await expect(page.getByText('Envoyé à Affectation')).toBeVisible();
      await expect(page.getByText('Jean Dupont')).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.getByText('Reception').click();
      await page.waitForTimeout(300);
      await page.getByText('Envoyer vers affectation').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Envoyé à Affectation')).toBeVisible();
    });
  });

  test.describe('ReciveQC (ReceiveCQ) - "Accepter produit controler"', () => {
    test.beforeEach(async ({ page }) => {
      await mockByBranchStep(page, 'à rècuperer');
    });

    test('should display heading and repair rows', async ({ page }) => {
      await page.goto('/dashboard/RecevoireQC');
      await page.waitForTimeout(1500);
      await expect(page.getByText('Accepter produit controler')).toBeVisible();
      await expect(page.getByText('Accepter').first()).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.getByText('Reception').click();
      await page.waitForTimeout(300);
      await page.getByText('Reçoit CQ').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Accepter produit controler')).toBeVisible();
    });
  });

  test.describe('Récupererproduit (Recuperation) - "Rècuperation"', () => {
    test.beforeEach(async ({ page }) => {
      await mockByBranchStep(page, 'Prêt à récupérer');
      await mockCustomers(page);
      await mockDistributers(page);
    });

    test('should display heading and repair rows', async ({ page }) => {
      await page.goto('/dashboard/Récupererproduit');
      await page.waitForTimeout(1500);
      await expect(page.getByText('Rècuperation')).toBeVisible();
      await expect(page.getByText('Rècuperer')).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.getByText('Reception').click();
      await page.waitForTimeout(300);
      await page.getByText('Récuperer produit').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Rècuperation')).toBeVisible();
    });
  });

  test.describe('Etatrécuperation (ListOutPut) - "List des rècuperation"', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/output-list/findByBranch/*`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_OUTPUTS }) });
      });
    });

    test('should display heading and output rows', async ({ page }) => {
      await page.goto('/dashboard/ListOutPut');
      await page.waitForTimeout(1500);
      await expect(page.getByText('List des rècuperation')).toBeVisible();
      await expect(page.getByText('Jean Dupont')).toBeVisible();
      await expect(page.getByText('Paul Martin')).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.getByText('Reception').click();
      await page.waitForTimeout(300);
      await page.getByText('Etat de récuperation').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('List des rècuperation')).toBeVisible();
    });
  });

  test.describe('Vente (Sales) - "Ventes"', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/sales/findByBranch/*`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_SALES }) });
      });
      await page.route(`${API}/company`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ tva: 19, timbreFiscale: 1 }] }) });
      });
    });

    test('should display heading and sales table', async ({ page }) => {
      await page.goto('/dashboard/Sales');
      await page.waitForTimeout(1500);
      await expect(page.getByText('Ventes')).toBeVisible();
      await expect(page.getByText('Nouvelle vente')).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.getByText('Vente').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Ventes')).toBeVisible();
    });
  });

  test.describe('Consulterappareille (ShowProductState) - "Historique des réparations"', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${API}/devices/history`, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: MOCK_DEVICES_HISTORY }) });
      });
    });

    test('should display heading and device accordion', async ({ page }) => {
      await page.goto('/dashboard/ConsulterAppareille');
      await page.waitForTimeout(1500);
      await expect(page.getByText('Historique des réparations')).toBeVisible();
      await expect(page.getByText('Samsung Galaxy S21')).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.getByText('Consulter appareille').click();
      await page.waitForTimeout(1500);
      await expect(page.getByText('Historique des réparations')).toBeVisible();
    });
  });
});
