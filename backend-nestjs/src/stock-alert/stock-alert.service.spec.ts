import { Test, TestingModule } from '@nestjs/testing';
import { StockAlertService } from './stock-alert.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockAlert } from './entities/stock-alert.entity';
import { Company } from 'src/company/entities/company.entity';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Reference } from 'src/references/entities/reference.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';
import { Repair } from 'src/repair/entities/repair.entity';

const mockAlert = {
  id: 1, branchId: 1, type: 'stock', report: [], readBy: [], createdAt: new Date(),
  branch: { id: 1, name: 'Branch 1' },
};
const mockAdmin = { id: 1, role: ['Administrateur'], branch: { id: 1 } };
const mockStockManager = { id: 2, role: ['Gestionnaire_de_stocks'], branch: { id: 1 } };
const mockOtherBranchUser = { id: 3, role: ['Gestionnaire_de_stocks'], branch: { id: 2 } };
const mockBranch = { id: 1, name: 'Branch 1' };
const mockCompany = { id: 1, quantityAlertStock: 5 };

describe('StockAlertService', () => {
  let service: StockAlertService;
  let stockAlertRepo: any;
  let userRepo: any;
  let branchRepo: any;
  let companyRepo: any;
  let modelRepo: any;
  let allPartRepo: any;
  let referenceRepo: any;
  let stockPartRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockAlertService,
        { provide: getRepositoryToken(StockAlert), useValue: { find: jest.fn(), findOneBy: jest.fn(), create: jest.fn(), save: jest.fn() } },
        { provide: getRepositoryToken(Company), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(Model), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(AllPart), useValue: {} },
        { provide: getRepositoryToken(Reference), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(StockPart), useValue: { count: jest.fn() } },
        { provide: getRepositoryToken(Bin), useValue: {} },
        { provide: getRepositoryToken(Branch), useValue: { find: jest.fn(), findOneBy: jest.fn() } },
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn(), find: jest.fn() } },
        { provide: getRepositoryToken(Repair), useValue: { createQueryBuilder: jest.fn() } },
      ],
    }).compile();

    service = module.get<StockAlertService>(StockAlertService);
    stockAlertRepo = module.get(getRepositoryToken(StockAlert));
    userRepo = module.get(getRepositoryToken(User));
    branchRepo = module.get(getRepositoryToken(Branch));
    companyRepo = module.get(getRepositoryToken(Company));
    modelRepo = module.get(getRepositoryToken(Model));
    allPartRepo = module.get(getRepositoryToken(AllPart));
    referenceRepo = module.get(getRepositoryToken(Reference));
    stockPartRepo = module.get(getRepositoryToken(StockPart));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAlerts', () => {
    it('should return alerts for admin', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockAdmin);
      jest.spyOn(stockAlertRepo, 'find').mockResolvedValue([mockAlert]);
      const result = await service.getAlerts(1, 1);
      expect(result).toHaveLength(1);
      expect(result[0].branchName).toBe('Branch 1');
    });

    it('should return empty array if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      const result = await service.getAlerts(1, 999);
      expect(result).toEqual([]);
    });

    it('should return empty array if user lacks required role', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockOtherBranchUser);
      jest.spyOn(stockAlertRepo, 'find').mockResolvedValue([mockAlert]);
      const result = await service.getAlerts(1, 3);
      expect(result).toEqual([]);
    });

    it('should filter by branchId for non-admin', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockStockManager);
      jest.spyOn(stockAlertRepo, 'find').mockResolvedValue([mockAlert]);
      const result = await service.getAlerts(1, 2);
      expect(result).toHaveLength(1);
    });

    it('should filter by type when provided', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockAdmin);
      jest.spyOn(stockAlertRepo, 'find').mockResolvedValue([mockAlert]);
      const result = await service.getAlerts(1, 1, 'stock');
      expect(result).toHaveLength(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark alert as read', async () => {
      const alert = { id: 1, readBy: [] };
      jest.spyOn(stockAlertRepo, 'findOneBy').mockResolvedValue(alert);
      jest.spyOn(stockAlertRepo, 'save').mockResolvedValue({ ...alert, readBy: ['1'] });
      const result = await service.markAsRead(1, 1);
      expect(result).toBeDefined();
      expect(result!.readBy).toContain('1');
    });

    it('should return null if alert not found', async () => {
      jest.spyOn(stockAlertRepo, 'findOneBy').mockResolvedValue(null);
      const result = await service.markAsRead(999, 1);
      expect(result).toBeNull();
    });
  });

  describe('findAlertById', () => {
    it('should return an alert by id', async () => {
      jest.spyOn(stockAlertRepo, 'findOneBy').mockResolvedValue(mockAlert);
      const result = await service.findAlertById(1);
      expect(result).toEqual(mockAlert);
    });
  });

  describe('getAlertUsers', () => {
    it('should return unique stock managers and admins', async () => {
      const stockManager = { id: 1, role: ['Gestionnaire_de_stocks'] };
      const admin = { id: 2, role: ['Administrateur'] };
      jest.spyOn(userRepo, 'find').mockResolvedValueOnce([stockManager]).mockResolvedValueOnce([admin]);
      const result = await service.getAlertUsers(1);
      expect(result).toHaveLength(2);
    });

    it('should deduplicate users appearing in both queries', async () => {
      const user = { id: 1, role: ['Gestionnaire_de_stocks', 'Administrateur'] };
      jest.spyOn(userRepo, 'find').mockResolvedValueOnce([user]).mockResolvedValueOnce([user]);
      const result = await service.getAlertUsers(1);
      expect(result).toHaveLength(1);
    });
  });
});
