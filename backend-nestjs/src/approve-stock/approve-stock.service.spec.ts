import { Test, TestingModule } from '@nestjs/testing';
import { ApproveStockService } from './approve-stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApproveStock } from './entities/approve-stock.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Reference } from 'src/references/entities/reference.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { Company } from 'src/company/entities/company.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockApproveStock = { id: 1, type: 'Repair', date: new Date(), state: 'Pending', idPartRepair: 1, stockPart: null };
const mockStockPart = { id: 1, bin: { id: 1, type: 'Bon', branch: { id: 1 } } };
const mockBin = { id: 2, type: 'Défectueux' };
const mockReference = { id: 1 };

const createMockQueryBuilder = () => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  execute: jest.fn(),
});

describe('ApproveStockService', () => {
  let service: ApproveStockService;
  let approveStockRepo: any;
  let stockPartRepo: any;
  let binRepo: any;
  let referenceRepo: any;
  let historyRepo: any;
  let tracabilityRepo: any;
  let qb: ReturnType<typeof createMockQueryBuilder>;

  beforeEach(async () => {
    qb = createMockQueryBuilder();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApproveStockService,
        {
          provide: getRepositoryToken(ApproveStock),
          useValue: {
            create: jest.fn().mockReturnValue(mockApproveStock),
            save: jest.fn().mockResolvedValue(mockApproveStock),
            find: jest.fn().mockResolvedValue([mockApproveStock]),
            findOne: jest.fn().mockResolvedValue(mockApproveStock),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn().mockReturnValue(qb),
          },
        },
        {
          provide: getRepositoryToken(StockPart),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockStockPart),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn().mockReturnValue(qb),
          },
        },
        {
          provide: getRepositoryToken(Bin),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockBin),
          },
        },
        {
          provide: getRepositoryToken(Reference),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(qb),
          },
        },
        {
          provide: getRepositoryToken(HistoryStockPart),
          useValue: {
            create: jest.fn().mockReturnValue({ id: 1 }),
            save: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Tracability),
          useValue: {
            create: jest.fn().mockReturnValue({ id: 1 }),
            save: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ApproveStockService>(ApproveStockService);
    approveStockRepo = module.get(getRepositoryToken(ApproveStock));
    stockPartRepo = module.get(getRepositoryToken(StockPart));
    binRepo = module.get(getRepositoryToken(Bin));
    referenceRepo = module.get(getRepositoryToken(Reference));
    historyRepo = module.get(getRepositoryToken(HistoryStockPart));
    tracabilityRepo = module.get(getRepositoryToken(Tracability));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an approve stock', async () => {
      const dto = { type: 'Repair', date: new Date(), state: 'Pending' } as any;
      const result = await service.create(dto);
      expect(approveStockRepo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockApproveStock);
    });
  });

  describe('findByRepairId', () => {
    it('should return approve stocks by repair id', async () => {
      qb.getMany.mockResolvedValue([mockApproveStock]);
      const result = await service.findByRepairId(1);
      expect(result).toEqual([mockApproveStock]);
    });

    it('should throw if none found', async () => {
      qb.getMany.mockResolvedValue([]);
      await expect(service.findByRepairId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySaleId', () => {
    it('should return approve stocks by sale id', async () => {
      qb.getMany.mockResolvedValue([mockApproveStock]);
      const result = await service.findBySaleId(1);
      expect(result).toEqual([mockApproveStock]);
    });

    it('should throw if none found', async () => {
      qb.getMany.mockResolvedValue([]);
      await expect(service.findBySaleId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBranchId', () => {
    it('should return approve stocks by branch id', async () => {
      qb.getMany.mockResolvedValue([mockApproveStock]);
      const result = await service.findByBranchId(1);
      expect(result).toEqual([mockApproveStock]);
    });

    it('should throw if none found', async () => {
      qb.getMany.mockResolvedValue([]);
      await expect(service.findByBranchId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBranchIdForSale', () => {
    it('should return sale approve stocks by branch id', async () => {
      qb.getMany.mockResolvedValue([mockApproveStock]);
      const result = await service.findByBranchIdForSale(1);
      expect(result).toEqual([mockApproveStock]);
    });

    it('should throw if none found', async () => {
      qb.getMany.mockResolvedValue([]);
      await expect(service.findByBranchIdForSale(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByType', () => {
    it('should return approve stocks by type', async () => {
      qb.getMany.mockResolvedValue([mockApproveStock]);
      const result = await service.findByType('Repair');
      expect(result).toEqual([mockApproveStock]);
    });

    it('should throw if none found', async () => {
      qb.getMany.mockResolvedValue([]);
      await expect(service.findByType('Unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByState', () => {
    it('should return approve stocks by state', async () => {
      qb.getMany.mockResolvedValue([mockApproveStock]);
      const result = await service.findByState('Pending');
      expect(result).toEqual([mockApproveStock]);
    });

    it('should throw if none found', async () => {
      qb.getMany.mockResolvedValue([]);
      await expect(service.findByState('Unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all approve stocks', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockApproveStock]);
    });
  });

  describe('findOne', () => {
    it('should return one approve stock', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockApproveStock);
    });

    it('should throw if not found', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an approve stock', async () => {
      const dto = { state: 'Approved' } as any;
      const result = await service.update(1, dto);
      expect(approveStockRepo.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockApproveStock);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { state: 'Approved' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an approve stock', async () => {
      const result = await service.remove(1);
      expect(approveStockRepo.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockApproveStock);
    });

    it('should throw if not found', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAvailableParts', () => {
    const approveStockWithRelations = {
      ...mockApproveStock,
      idPartRepair: 1,
      repair: { id: 1, device: { model: { id: 1 } } },
    };

    it('should return available stock parts', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(approveStockWithRelations);
      qb.getMany.mockResolvedValueOnce([mockReference]);
      qb.getMany.mockResolvedValueOnce([mockStockPart]);

      const result = await service.findAvailableParts(1, 1);
      expect(result).toEqual([mockStockPart]);
    });

    it('should throw if approve stock not found', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findAvailableParts(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if no part associated', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue({ ...mockApproveStock, idPartRepair: null });
      await expect(service.findAvailableParts(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw if no model associated', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue({
        ...mockApproveStock,
        idPartRepair: 1,
        repair: { id: 1, device: null },
      });
      await expect(service.findAvailableParts(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should return empty array if no references found', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(approveStockWithRelations);
      qb.getMany.mockResolvedValue([]);

      const result = await service.findAvailableParts(1, 1);
      expect(result).toEqual([]);
    });
  });

  describe('confirmPart', () => {
    it('should confirm a part successfully', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce(mockApproveStock);
      jest.spyOn(stockPartRepo, 'findOne').mockResolvedValue(mockStockPart);
      jest.spyOn(binRepo, 'findOne').mockResolvedValue(mockBin);
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce({ ...mockApproveStock, stockPart: mockStockPart, state: 'Confirmer' });

      const result = await service.confirmPart(1, 1, 2, 1);

      expect(stockPartRepo.update).toHaveBeenCalledWith(1, { bin: { id: 2 } });
      expect(historyRepo.create).toHaveBeenCalled();
      expect(historyRepo.save).toHaveBeenCalled();
      expect(tracabilityRepo.create).toHaveBeenCalled();
      expect(tracabilityRepo.save).toHaveBeenCalled();
      expect(approveStockRepo.update).toHaveBeenCalledWith(1, { stockPart: { id: 1 }, state: 'Confirmer' });
      expect(result.state).toBe('Confirmer');
    });

    it('should throw if approve stock not found', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(null);
      await expect(service.confirmPart(999, 1, 2, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if stock part not found', async () => {
      jest.spyOn(stockPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.confirmPart(1, 999, 2, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if bin is not Bon', async () => {
      jest.spyOn(stockPartRepo, 'findOne').mockResolvedValue({ id: 1, bin: { id: 1, type: 'Mauvais' } });
      await expect(service.confirmPart(1, 1, 2, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw if defect bin not found', async () => {
      jest.spyOn(binRepo, 'findOne').mockResolvedValue(null);
      await expect(service.confirmPart(1, 1, 999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateState', () => {
    it('should update state and move stockPart bin if Approved', async () => {
      const approveStockWithPart = { ...mockApproveStock, stockPart: { id: 1 } };
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce(approveStockWithPart);
      qb.execute.mockResolvedValue({ affected: 1 });
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce({ ...approveStockWithPart, state: 'Approved' });

      const result = await service.updateState(1, 2, { state: 'Approved' } as any);

      expect(approveStockRepo.createQueryBuilder).toHaveBeenCalled();
      expect(stockPartRepo.createQueryBuilder).toHaveBeenCalled();
      expect(result.state).toBe('Approved');
    });

    it('should update state without bin change if not Approved', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce(mockApproveStock);
      qb.execute.mockResolvedValue({ affected: 1 });
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce({ ...mockApproveStock, state: 'Rejected' });

      const result = await service.updateState(1, 2, { state: 'Rejected' } as any);

      expect(result.state).toBe('Rejected');
    });

    it('should throw if approve stock not found', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValue(null);
      await expect(service.updateState(999, 2, { state: 'Approved' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if updated approve stock not found', async () => {
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce(mockApproveStock);
      qb.execute.mockResolvedValue({ affected: 1 });
      jest.spyOn(approveStockRepo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateState(1, 2, { state: 'Approved' } as any)).rejects.toThrow(NotFoundException);
    });
  });
});
