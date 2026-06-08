import type { Page } from '@playwright/test';

const API_BASE = 'http://localhost:3000';

const MOCK_BRANCH = { id: 1, name: 'Agence Centrale', phone: 12345678, email: 'central@best.tn', location: 'Tunis' };

export const MOCK_ADMIN_USER = {
  id: 1, login: 'admin', name: 'Admin BEST', role: ['Administrateur'], status: 'active', branch: MOCK_BRANCH,
};

export const MOCK_RECEPTION_USER = {
  id: 2, login: 'reception', name: 'Alice Reception', role: ['Reception'], status: 'active', branch: MOCK_BRANCH,
};

export const MOCK_TECHNICIEN_USER = {
  id: 3, login: 'technicien', name: 'Bob Technicien', role: ['Technicien'], status: 'active', branch: MOCK_BRANCH,
};

export const MOCK_COORDINATEUR_USER = {
  id: 4, login: 'coordinateur', name: 'Carol Coord', role: ['Coordinateur'], status: 'active', branch: MOCK_BRANCH,
};

export const MOCK_STOCK_MANAGER_USER = {
  id: 5, login: 'stockmgr', name: 'Dave Stock', role: ['Gestionnaire_de_stocks'], status: 'active', branch: MOCK_BRANCH,
};

export const MOCK_COMPANY = {
  id: 1, name: 'BEST Corp', logo: null, headquarterslocation: 'Tunis',
  taxRegisterNumber: 'T123', rib: 12345, bank: 'Banque BEST',
  quantityAlertStock: 10, tva: 19, timbreFiscale: 1,
};

export const MOCK_BRANCHES = [
  { id: 1, name: 'Agence Centrale', phone: 12345678, email: 'central@best.tn', location: 'Tunis' },
  { id: 2, name: 'Agence Nord', phone: 87654321, email: 'nord@best.tn', location: 'Bizerte' },
  { id: 3, name: 'Agence Sud', phone: 55555555, email: 'sud@best.tn', location: 'Sfax' },
];

export const MOCK_EMPLOYEES = [
  { id: 1, login: 'jdupont', name: 'Jean Dupont', role: ['Coordinateur'], status: 'active', phone: 11111111, createdDate: '2024-01-15' },
  { id: 2, login: 'mleblanc', name: 'Marie Leblanc', role: ['Reception'], status: 'active', phone: 22222222, createdDate: '2024-02-20' },
  { id: 3, login: 'pmoreau', name: 'Pierre Moreau', role: ['Technicien'], status: 'inactive', phone: 33333333, createdDate: '2024-03-10' },
];

export const MOCK_BINS = [
  { id: 1, name: 'Case A1', type: 'Bon', branch: { id: 1, name: 'Agence Centrale' } },
  { id: 2, name: 'Case B2', type: 'Défectueux', branch: { id: 1, name: 'Agence Centrale' } },
];

export const MOCK_REFERENCES = [
  { id: 1, materialCode: 'REF001', description: 'Écran LCD 6.5"', allpart: { id: 1, name: 'Écran' }, model: [{ id: 1, name: 'Galaxy S21' }] },
  { id: 2, materialCode: 'REF002', description: 'Batterie 4000mAh', allpart: { id: 2, name: 'Batterie' }, model: [{ id: 2, name: 'iPhone 13' }] },
];

export const MOCK_PARTS_PRICE = [
  { id: 1, price: 150, allPart: { id: 1, name: 'Écran' }, model: { id: 1, name: 'Galaxy S21' } },
  { id: 2, price: 80, allPart: { id: 2, name: 'Batterie' }, model: { id: 2, name: 'iPhone 13' } },
];

export async function setupAuthMocks(page: Page, user = MOCK_ADMIN_USER) {
  await page.route(`${API_BASE}/auth/me`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) });
  });
  await page.route(`${API_BASE}/company`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [MOCK_COMPANY] }) });
  });
}

export async function setupFrenchLocale(page: Page) {
  await page.addInitScript(() => { localStorage.setItem('i18nextLng', 'fr'); });
}

export async function loginAs(page: Page, user = MOCK_ADMIN_USER) {
  await setupAuthMocks(page, user);
  await setupFrenchLocale(page);
  await page.route(`${API_BASE}/auth/signIn`, async (route) => {
    await route.fulfill({
      status: 201, contentType: 'application/json',
      body: JSON.stringify({ user: { ...user, token: 'mock-jwt-token' }, token: 'mock-jwt-token' }),
    });
  });
  await page.goto('/');
  await page.waitForTimeout(300);
  await page.getByPlaceholder('Utilisateur').fill(user.login);
  await page.getByPlaceholder('••••••').fill('password');
  await page.getByRole('button', { name: 'Connecte' }).click();
  await page.waitForURL(/\/dashboard/);
}

export async function loginAsAdmin(page: Page) {
  return loginAs(page, MOCK_ADMIN_USER);
}

export async function removeMocks(page: Page) {
  await page.unroute(`${API_BASE}/auth/me`);
  await page.unroute(`${API_BASE}/company`);
}

export function getApiBase() { return API_BASE; }
