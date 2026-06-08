import { Test, TestingModule } from '@nestjs/testing';
import { TracabilityService } from './tracability.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tracability } from './entities/tracability.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockTracability = { id: 1, user: { id: 1 }, historyRepair: { id: 1 }, historyStockPart: { id: 1 } };
const mockHistoryRepair = { id: 1 };
const mockHistoryStockPart = { id: 1 };
const mockUser = { id: 1 };

describe('TracabilityService', () => {
  let service: TracabilityService;
  let tracabilityRepo: any;
  let historyRepairRepo: any;
  let historyStockPartRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracabilityService,
        {
          provide: getRepositoryToken(Tracability),
          useValue: {
            create: jest.fn().mockReturnValue(mockTracability),
            save: jest.fn().mockResolvedValue(mockTracability),
            findOne: jest.fn().mockResolvedValue(mockTracability),
            find: jest.fn().mockResolvedValue([mockTracability]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(mockTracability),
            })),
          },
        },
        {
          provide: getRepositoryToken(HistoryRepair),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockHistoryRepair),
          },
        },
        {
          provide: getRepositoryToken(HistoryStockPart),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockHistoryStockPart),
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

    service = module.get<TracabilityService>(TracabilityService);
    tracabilityRepo = module.get(getRepositoryToken(Tracability));
    historyRepairRepo = module.get(getRepositoryToken(HistoryRepair));
    historyStockPartRepo = module.get(getRepositoryToken(HistoryStockPart));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tracability record', async () => {
      const dto = { user: 1, historyRepair: 1, historyStockPart: 1 };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockTracability);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ user: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if historyRepair not found', async () => {
      jest.spyOn(historyRepairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ user: 1, historyRepair: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if historyStockPart not found', async () => {
      jest.spyOn(historyStockPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ user: 1, historyStockPart: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all tracability records', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTracability]);
    });
  });

  describe('findOne', () => {
    it('should return one tracability record', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTracability);
    });

    it('should throw if not found', async () => {
      jest.spyOn(tracabilityRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tracability record', async () => {
      jest.spyOn(tracabilityRepo, 'findOne').mockResolvedValue(mockTracability);
      const result = await service.update(1, { user: 1 } as any);
      expect(result).toEqual(mockTracability);
    });

    it('should throw if not found', async () => {
      jest.spyOn(tracabilityRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if historyRepair not found when updating', async () => {
      jest.spyOn(tracabilityRepo, 'findOne').mockResolvedValue(mockTracability);
      jest.spyOn(historyRepairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { historyRepair: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if historyStockPart not found when updating', async () => {
      jest.spyOn(tracabilityRepo, 'findOne').mockResolvedValue(mockTracability);
      jest.spyOn(historyStockPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { historyStockPart: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found when updating', async () => {
      jest.spyOn(tracabilityRepo, 'findOne').mockResolvedValue(mockTracability);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { user: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a tracability record', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockTracability);
    });

    it('should throw if not found', async () => {
      jest.spyOn(tracabilityRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByHistoryRepairId', () => {
    it('should return tracability by historyRepair id', async () => {
      const result = await service.findByHistoryRepairId(1);
      expect(result).toEqual(mockTracability);
    });

    it('should throw if id is NaN', async () => {
      await expect(service.findByHistoryRepairId(NaN)).rejects.toThrow(BadRequestException);
    });

    it('should throw if not found', async () => {
      tracabilityRepo.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findByHistoryRepairId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByHistoryStockPartId', () => {
    it('should return tracability by historyStockPart id', async () => {
      const result = await service.findByHistoryStockPartId(1);
      expect(result).toEqual(mockTracability);
    });

    it('should throw if id is NaN', async () => {
      await expect(service.findByHistoryStockPartId(NaN)).rejects.toThrow(BadRequestException);
    });

    it('should throw if not found', async () => {
      tracabilityRepo.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findByHistoryStockPartId(999)).rejects.toThrow(NotFoundException);
    });
  });
});
