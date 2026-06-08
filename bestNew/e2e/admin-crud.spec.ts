import { test, expect, Page } from '@playwright/test';
import { loginAsAdmin, getApiBase } from './helpers';

const DISTRIBUTEURS_MOCK = [
  { id: 1, name: 'Distributeur Alpha', code: 'DA001', description: 'Premier distributeur' },
  { id: 2, name: 'Distributeur Beta', code: 'DB002', description: 'Deuxième distributeur' },
];

const RAISONS_EXPERTISE_MOCK = [
  { id: 1, name: 'Raison Expertise 1', code: 'RE001', description: 'Description raison 1' },
  { id: 2, name: 'Raison Expertise 2', code: 'RE002', description: 'Description raison 2' },
];

const LIST_PROBLEMS_MOCK = [
  { id: 1, name: 'Problème A', code: 'PA001', description: 'Description problème A' },
  { id: 2, name: 'Problème B', code: 'PB002', description: 'Description problème B' },
];

const DEMANDE_CLIENT_MOCK = [
  { id: 1, name: 'Demande Client 1', code: 'DC001', description: 'Description demande 1' },
  { id: 2, name: 'Demande Client 2', code: 'DC002', description: 'Description demande 2' },
];

const NOTES_CLIENT_MOCK = [
  { id: 1, name: 'Note Client 1', code: 'NC001', description: 'Description note 1' },
  { id: 2, name: 'Note Client 2', code: 'NC002', description: 'Description note 2' },
];

const LIST_PIECES_MOCK = [
  { id: 1, name: 'Pièce 1', code: 'P001', description: 'Description pièce 1' },
  { id: 2, name: 'Pièce 2', code: 'P002', description: 'Description pièce 2' },
];

const LEGISLATIONS_MOCK = [
  { id: 1, name: 'Législation 1', code: 'L001', description: 'Description législation 1' },
  { id: 2, name: 'Législation 2', code: 'L002', description: 'Description législation 2' },
];

const LEVEL_REPAIR_MOCK = [
  { id: 1, name: 'Niveau 1', code: 'NR001', description: 'Premier niveau de réparation' },
  { id: 2, name: 'Niveau 2', code: 'NR002', description: 'Deuxième niveau de réparation' },
];

const FRAIS_MOCK = [
  { id: 1, name: 'Frais 1', code: 'F001', description: 'Description frais 1' },
  { id: 2, name: 'Frais 2', code: 'F002', description: 'Description frais 2' },
];

const REPAIR_ACTIONS_MOCK = [
  { id: 1, name: 'Action 1', code: 'RA001', description: 'Description action 1' },
  { id: 2, name: 'Action 2', code: 'RA002', description: 'Description action 2' },
];

function setupApiRoute(page: Page, url: string, mockData: object[]) {
  const apiBase = getApiBase();
  const fullUrl = `${apiBase}${url}`;
  return page.route(fullUrl, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: mockData }),
    });
  });
}

async function navigateToPage(page: Page, sidebarText: string) {
  await page.getByText('Administration').click();
  await page.getByText(sidebarText).click();
  await page.waitForTimeout(1000);
}

test.describe('Admin CRUD Pages', () => {

  test.describe('Distributeurs', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/distributeur', DISTRIBUTEURS_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Distributeurs');
      await expect(page.getByText('Liste des distributeur')).toBeVisible();
      for (const item of DISTRIBUTEURS_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Distributeurs');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('RaisonsExpertise', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/expertise-reasons', RAISONS_EXPERTISE_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, "Raisons d'expertise");
      await expect(page.getByText("List toutes les raisons d'expertise")).toBeVisible();
      for (const item of RAISONS_EXPERTISE_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, "Raisons d'expertise");
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('ListProblems', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/list-fault', LIST_PROBLEMS_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'List problèmes');
      await expect(page.getByText('List des problèmes')).toBeVisible();
      for (const item of LIST_PROBLEMS_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'List problèmes');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('ListDemandeClient', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/customer-request', DEMANDE_CLIENT_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Demande client');
      await expect(page.getByText('Liste de demandes client')).toBeVisible();
      for (const item of DEMANDE_CLIENT_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Demande client');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('NotesClient', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/notes-customer', NOTES_CLIENT_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Notes pour client');
      await expect(page.getByText('Liste des notes pour client')).toBeVisible();
      for (const item of NOTES_CLIENT_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Notes pour client');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('ListPieces', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/all-parts', LIST_PIECES_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Liste des piéce');
      await expect(page.getByText('Liste de toutes les pièces')).toBeVisible();
      for (const item of LIST_PIECES_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Liste des piéce');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('ListLegislations', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/legislation', LEGISLATIONS_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Législation');
      await expect(page.getByText('Liste des legislations')).toBeVisible();
      for (const item of LEGISLATIONS_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Législation');
      await expect(page.getByRole('button', { name: /Ajouter un legislation/i })).toBeVisible();
    });
  });

  test.describe('ListlevelRepair', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/level-repair', LEVEL_REPAIR_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Niveau de réparation');
      await expect(page.getByText('List des niveaux de rèparation')).toBeVisible();
      for (const item of LEVEL_REPAIR_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Niveau de réparation');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('ListFrais', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/other-cost', FRAIS_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Autres Frais');
      await expect(page.getByText('Liste des frais')).toBeVisible();
      for (const item of FRAIS_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Autres Frais');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

  test.describe('ListRepairActions', () => {
    test.beforeEach(async ({ page }) => {
      await setupApiRoute(page, '/repair-action', REPAIR_ACTIONS_MOCK);
      await loginAsAdmin(page);
    });

    test('should display list with heading', async ({ page }) => {
      await navigateToPage(page, 'Action de diagnostique');
      await expect(page.getByText('List des actions après diagnostique')).toBeVisible();
      for (const item of REPAIR_ACTIONS_MOCK) {
        await expect(page.getByText(item.name)).toBeVisible();
      }
    });

    test('should display add button', async ({ page }) => {
      await navigateToPage(page, 'Action de diagnostique');
      const addBtn = page.locator('button:has-text("Ajouter"), button:has-text("Add"), button:has-text("+"), [aria-label*="ajouter"], [aria-label*="add"]');
      await expect(addBtn.first()).toBeVisible();
    });
  });

});
