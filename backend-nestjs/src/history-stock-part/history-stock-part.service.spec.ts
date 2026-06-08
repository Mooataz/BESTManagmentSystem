import { Test, TestingModule } from '@nestjs/testing';
import { HistoryStockPartService } from './history-stock-part.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HistoryStockPart } from './entities/history-stock-part.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockHistoryStockPart = { id: 1, date: new Date(), step: 'test', stockPart: { id: 1 } };
const mockStockPart = { id: 1 };
const mockTracability = { id: 1 };
const mockUser = { id: 1 };

describe('HistoryStockPartService', () => {
  let service: HistoryStockPartService;
  let historyStockPartRepo: any;
  let stockPartRepo: any;
  let tracabilityRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryStockPartService,
        {
          provide: getRepositoryToken(HistoryStockPart),
          useValue: {
            create: jest.fn().mockReturnValue(mockHistoryStockPart),
            save: jest.fn().mockResolvedValue(mockHistoryStockPart),
            findOne: jest.fn().mockResolvedValue(mockHistoryStockPart),
            find: jest.fn().mockResolvedValue([mockHistoryStockPart]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockHistoryStockPart]),
            })),
          },
        },
        {
          provide: getRepositoryToken(StockPart),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockStockPart),
          },
        },
        {
          provide: getRepositoryToken(Tracability),
          useValue: {
            create: jest.fn().mockReturnValue(mockTracability),
            save: jest.fn().mockResolvedValue(mockTracability),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<HistoryStockPartService>(HistoryStockPartService);
    historyStockPartRepo = module.get(getRepositoryToken(HistoryStockPart));
    stockPartRepo = module.get(getRepositoryToken(StockPart));
    tracabilityRepo = module.get(getRepositoryToken(Tracability));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a history stock part and tracability record', async () => {
      const data = { step: 'test', date: new Date(), stockPart: 1, user: { id: 1 } };
      const result = await service.create(data);
      expect(result).toEqual(mockHistoryStockPart);
    });

    it('should throw if stockPart not found', async () => {
      jest.spyOn(stockPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ stockPart: 999, user: { id: 1 } })).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ stockPart: 1, user: { id: 999 } })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all history stock parts', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockHistoryStockPart]);
    });
  });

  describe('findOne', () => {
    it('should return one history stock part', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockHistoryStockPart);
    });

    it('should throw if not found', async () => {
      jest.spyOn(historyStockPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a history stock part', async () => {
      jest.spyOn(historyStockPartRepo, 'findOne').mockResolvedValue(mockHistoryStockPart);
      const result = await service.update(1, { step: 'updated' } as any);
      expect(result).toEqual(mockHistoryStockPart);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(historyStockPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a history stock part', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockHistoryStockPart);
    });

    it('should throw if not found', async () => {
      jest.spyOn(historyStockPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByStockPartId', () => {
    it('should return history stock parts by stock part id', async () => {
      const result = await service.findByStockPartId(1);
      expect(result).toEqual([mockHistoryStockPart]);
    });
  });
});
