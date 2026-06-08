import { Test, TestingModule } from '@nestjs/testing';
import { HistoryRepairService } from './history-repair.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HistoryRepair } from './entities/history-repair.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockHistoryRepair = { id: 1, date: new Date(), step: 'test', repair: { id: 1 } };
const mockRepair = { id: 1 };
const mockTracability = { id: 1 };
const mockUser = { id: 1 };

describe('HistoryRepairService', () => {
  let service: HistoryRepairService;
  let historyRepairRepo: any;
  let repairRepo: any;
  let tracabilityRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryRepairService,
        {
          provide: getRepositoryToken(HistoryRepair),
          useValue: {
            create: jest.fn().mockReturnValue(mockHistoryRepair),
            save: jest.fn().mockResolvedValue(mockHistoryRepair),
            findOne: jest.fn().mockResolvedValue(mockHistoryRepair),
            find: jest.fn().mockResolvedValue([mockHistoryRepair]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockHistoryRepair]),
            })),
          },
        },
        {
          provide: getRepositoryToken(Repair),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockRepair),
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

    service = module.get<HistoryRepairService>(HistoryRepairService);
    historyRepairRepo = module.get(getRepositoryToken(HistoryRepair));
    repairRepo = module.get(getRepositoryToken(Repair));
    tracabilityRepo = module.get(getRepositoryToken(Tracability));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a history repair and tracability record', async () => {
      const data = { step: 'test', date: new Date(), repair: 1, user: { id: 1 } };
      const result = await service.create(data);
      expect(result).toEqual(mockHistoryRepair);
    });

    it('should throw if repair not found', async () => {
      jest.spyOn(repairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ repair: 999, user: { id: 1 } })).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ repair: 1, user: { id: 999 } })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all history repairs', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockHistoryRepair]);
    });
  });

  describe('findOne', () => {
    it('should return one history repair', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockHistoryRepair);
    });

    it('should throw if not found', async () => {
      jest.spyOn(historyRepairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a history repair', async () => {
      jest.spyOn(historyRepairRepo, 'findOne').mockResolvedValue(mockHistoryRepair);
      const result = await service.update(1, { step: 'updated' } as any);
      expect(result).toEqual(mockHistoryRepair);
    });

    it('should throw if repair not found on update', async () => {
      jest.spyOn(repairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { repair: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(historyRepairRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repairRepo, 'findOne').mockResolvedValue(mockRepair);
      await expect(service.update(999, { repair: 1 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a history repair', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockHistoryRepair);
    });

    it('should throw if not found', async () => {
      jest.spyOn(historyRepairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByRepairId', () => {
    it('should return history repairs by repair id', async () => {
      const result = await service.findByRepairId(1);
      expect(result).toEqual([mockHistoryRepair]);
    });
  });
});
