import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { User } from 'src/users/entities/user.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Company } from 'src/company/entities/company.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('pdfkit', () => {
  const mockDoc: any = {
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((event: string, cb: Function) => { if (event === 'finish') setTimeout(cb, 0); return mockDoc; }),
    fontSize: jest.fn().mockReturnThis(),
    font: jest.fn().mockReturnThis(),
    fillColor: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    moveTo: jest.fn().mockReturnThis(),
    lineTo: jest.fn().mockReturnThis(),
    strokeColor: jest.fn().mockReturnThis(),
    stroke: jest.fn().mockReturnThis(),
    rect: jest.fn().mockReturnThis(),
    fill: jest.fn().mockReturnThis(),
    image: jest.fn().mockReturnThis(),
    end: jest.fn(),
    page: { width: 595, height: 842 },
    lineCap: jest.fn().mockReturnThis(),
  };
  return jest.fn(() => mockDoc);
});

const mockSale = {
  id: 1, state: 'En attente', totalPrice: 100, date: new Date(),
  details: { items: [{ allPartId: 1, allPartName: 'Test', quantity: 1, unitPrice: 100 }] },
  allPart: [{ id: 1, description: 'Test' }], user: { id: 1, name: 'User', branch: { id: 1, name: 'Branch', location: 'Loc', phone: '123', email: 'a@b.com' } },
  customer: null, validatedBy: null, confirmedBy: null, confirmedAt: null, validatedAt: null,
};
const mockParts = [
  { id: 1, description: 'Chargeur' },
  { id: 2, description: 'Câble USB' },
];
const mockPrices = [{ id: 1, price: 100, allPart: { id: 1 } }];
const mockAdmin = { id: 1, name: 'Admin', role: 'Administrateur' };
const mockNonAdmin = { id: 2, name: 'User', role: 'Technicien' };
const mockBin = { id: 1, name: 'Bin 1' };
const mockCustomer = { id: 1, name: 'Client', phone: 12345678 };
const mockCompany = { id: 1, name: 'BEST', tva: 19, timbreFiscale: 1, logo: null, headquarterslocation: 'Tunis', taxRegisterNumber: '123', rib: '123', bank: 'BT' };
const mockStockPart = {
  id: 1, serialNumber: 'SN001',
  reference: { id: 1, materialCode: 'MC001', description: 'Ref', allpart: { id: 1, description: 'Test' } },
  bin: { id: 1, name: 'Bin 1' },
};

function createMockQb(overrides?: Partial<{ getMany: any[]; getOne: any }>) {
  return {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(overrides?.getMany ?? [mockSale]),
    getOne: jest.fn().mockResolvedValue(overrides?.getOne ?? mockSale),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
  };
}

function createMockRepos() {
  const saleQb = createMockQb();
  const stockQb = createMockQb();
  return {
    sale: {
      create: jest.fn().mockReturnValue(mockSale),
      save: jest.fn().mockResolvedValue(mockSale),
      find: jest.fn().mockResolvedValue([mockSale]),
      findOne: jest.fn().mockResolvedValue(mockSale),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn().mockReturnValue(saleQb),
    },
    allPart: {
      find: jest.fn().mockResolvedValue(mockParts),
    },
    approveStock: {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockResolvedValue([{}]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    },
    user: {
      findOne: jest.fn().mockResolvedValue(mockAdmin),
    },
    stockPart: {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn().mockReturnValue(stockQb),
    },
    partsPrice: {
      find: jest.fn().mockResolvedValue(mockPrices),
    },
    bin: {
      findOne: jest.fn().mockResolvedValue(mockBin),
    },
    customer: {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue(mockCustomer),
      save: jest.fn().mockResolvedValue(mockCustomer),
    },
    company: {
      find: jest.fn().mockResolvedValue([mockCompany]),
    },
  };
}

describe('SalesService', () => {
  let service: SalesService;
  let repos: ReturnType<typeof createMockRepos>;

  beforeEach(async () => {
    repos = createMockRepos();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        { provide: getRepositoryToken(Sale), useValue: repos.sale },
        { provide: getRepositoryToken(AllPart), useValue: repos.allPart },
        { provide: getRepositoryToken(ApproveStock), useValue: repos.approveStock },
        { provide: getRepositoryToken(User), useValue: repos.user },
        { provide: getRepositoryToken(StockPart), useValue: repos.stockPart },
        { provide: getRepositoryToken(PartsPrice), useValue: repos.partsPrice },
        { provide: getRepositoryToken(Bin), useValue: repos.bin },
        { provide: getRepositoryToken(Customer), useValue: repos.customer },
        { provide: getRepositoryToken(Company), useValue: repos.company },
      ],
    }).compile();
    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a sale with allParts and create approve stock entries', async () => {
      const dto = { allPartIds: [1, 2], quantities: [2, 1], user: 1, state: 'En attente' } as any;
      const result = await service.create(dto);
      expect(result).toEqual(mockSale);
      expect(repos.allPart.find).toHaveBeenCalled();
      expect(repos.partsPrice.find).toHaveBeenCalled();
      expect(repos.approveStock.create).toHaveBeenCalledTimes(2);
      expect(repos.approveStock.save).toHaveBeenCalled();
      expect(repos.sale.create).toHaveBeenCalled();
      expect(repos.sale.save).toHaveBeenCalled();
    });

    it('should create a sale without allParts', async () => {
      const dto = { user: 1, state: 'En attente' } as any;
      jest.spyOn(repos.allPart, 'find').mockResolvedValue([]);
      jest.spyOn(repos.partsPrice, 'find').mockResolvedValue([]);
      const result = await service.create(dto);
      expect(result).toEqual(mockSale);
      expect(repos.approveStock.create).not.toHaveBeenCalled();
    });

    it('should upsert existing customer', async () => {
      jest.spyOn(repos.customer, 'findOne').mockResolvedValue(mockCustomer);
      const dto = { customerName: 'Client', customerPhone: 12345678, allPartIds: [] } as any;
      const result = await service.create(dto);
      expect(result).toEqual(mockSale);
      expect(repos.customer.save).not.toHaveBeenCalled();
    });

    it('should create a new customer if not found', async () => {
      const dto = { customerName: 'New', customerPhone: 87654321, allPartIds: [] } as any;
      const result = await service.create(dto);
      expect(result).toEqual(mockSale);
      expect(repos.customer.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all sales with relations', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockSale]);
      expect(repos.sale.find).toHaveBeenCalledWith({
        relations: ['allPart', 'user', 'approveStock', 'validatedBy', 'confirmedBy', 'customer'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a sale', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockSale);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBranchId', () => {
    it('should return sales by branch', async () => {
      const result = await service.findByBranchId(1);
      expect(result).toEqual([mockSale]);
      expect(repos.sale.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return sales by user', async () => {
      const result = await service.findByUserId(1);
      expect(result).toEqual([mockSale]);
      expect(repos.sale.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findByState', () => {
    it('should return sales by state', async () => {
      const result = await service.findByState('En attente');
      expect(result).toEqual([mockSale]);
      expect(repos.sale.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a sale', async () => {
      const result = await service.update(1, { state: 'Confirmé' } as any);
      expect(result).toEqual(mockSale);
      expect(repos.sale.findOne).toHaveBeenCalled();
      expect(repos.sale.save).toHaveBeenCalled();
    });

    it('should throw if sale not found', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { state: 'Test' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should update allPartIds when provided', async () => {
      const result = await service.update(1, { allPartIds: [1, 2], quantities: [1, 1] } as any);
      expect(result).toEqual(mockSale);
      expect(repos.allPart.find).toHaveBeenCalled();
      expect(repos.partsPrice.find).toHaveBeenCalled();
    });

    it('should update customer when customerName provided', async () => {
      const result = await service.update(1, { customerName: 'Updated' } as any);
      expect(result).toEqual(mockSale);
      expect(repos.customer.findOne).toHaveBeenCalled();
    });
  });

  describe('findForSale', () => {
    it('should return stock parts for sale', async () => {
      const result = await service.findForSale(1, 1);
      expect(Array.isArray(result)).toBe(true);
      expect(repos.sale.findOne).toHaveBeenCalled();
      expect(repos.stockPart.createQueryBuilder).toHaveBeenCalled();
      expect(repos.partsPrice.find).toHaveBeenCalled();
    });

    it('should throw if sale not found', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue(null);
      await expect(service.findForSale(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should return empty array if no items in details', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue({ ...mockSale, details: { items: [] } } as any);
      const result = await service.findForSale(1, 1);
      expect(result).toEqual([]);
    });
  });

  describe('batchChangeBin', () => {
    it('should batch change bin and confirm sale', async () => {
      const result = await service.batchChangeBin([1, 2], 1, 1, 1);
      expect(result).toEqual({ updated: 2 });
      expect(repos.stockPart.update).toHaveBeenCalledTimes(2);
      expect(repos.approveStock.update).toHaveBeenCalled();
      expect(repos.sale.update).toHaveBeenCalled();
    });

    it('should throw if sale not found', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue(null);
      await expect(service.batchChangeBin([1], 1, 1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw if sale already confirmed', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue({ ...mockSale, confirmedAt: new Date() } as any);
      await expect(service.batchChangeBin([1], 1, 1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw if bin not found', async () => {
      jest.spyOn(repos.bin, 'findOne').mockResolvedValue(null);
      await expect(service.batchChangeBin([1], 999, 1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(repos.user, 'findOne').mockResolvedValue(null);
      await expect(service.batchChangeBin([1], 1, 999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validate', () => {
    it('should validate a confirmed sale', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue({ ...mockSale, state: 'Confirmé' } as any);
      jest.spyOn(repos.sale, 'save').mockResolvedValue({ ...mockSale, state: 'Validé' } as any);
      const result = await service.validate(1, 1);
      expect(result.state).toBe('Validé');
    });

    it('should throw if admin not found', async () => {
      jest.spyOn(repos.user, 'findOne').mockResolvedValue(null);
      await expect(service.validate(1, 999)).rejects.toThrow(BadRequestException);
    });

    it('should throw if admin role missing', async () => {
      jest.spyOn(repos.user, 'findOne').mockResolvedValue(mockNonAdmin);
      await expect(service.validate(1, 2)).rejects.toThrow(BadRequestException);
    });

    it('should throw if sale not found', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue(null);
      await expect(service.validate(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if already validated', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue({ ...mockSale, state: 'Validé' } as any);
      await expect(service.validate(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw if not confirmed yet', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue({ ...mockSale, state: 'En attente' } as any);
      await expect(service.validate(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAccessories', () => {
    it('should return accessory parts', async () => {
      const result = await service.getAccessories();
      expect(result).toEqual(mockParts);
      expect(repos.allPart.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a sale', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockSale);
      expect(repos.sale.delete).toHaveBeenCalled();
    });

    it('should throw if not found', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generatePdf', () => {
    it('should generate PDF for a confirmed sale', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue({ ...mockSale, state: 'Confirmé', confirmedAt: new Date() } as any);
      const res = { setHeader: jest.fn() };
      await expect(service.generatePdf(1, res)).resolves.toBeUndefined();
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    });

    it('should throw if sale not found', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue(null);
      const res = { setHeader: jest.fn() };
      await expect(service.generatePdf(999, res)).rejects.toThrow(NotFoundException);
    });

    it('should throw if sale not confirmed or validated', async () => {
      jest.spyOn(repos.sale, 'findOne').mockResolvedValue({ ...mockSale, state: 'En attente' } as any);
      const res = { setHeader: jest.fn() };
      await expect(service.generatePdf(1, res)).rejects.toThrow(BadRequestException);
    });
  });
});
