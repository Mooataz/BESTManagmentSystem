import { Test, TestingModule } from '@nestjs/testing';
import { LevelRepairService } from './level-repair.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LevelRepair } from './entities/level-repair.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockLevelRepair = { id: 1, name: 'Level 1', price: 100 };

describe('LevelRepairService', () => {
  let service: LevelRepairService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelRepairService,
        {
          provide: AppService,
          useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) },
        },
        {
          provide: getRepositoryToken(LevelRepair),
          useValue: {
            create: jest.fn().mockReturnValue(mockLevelRepair),
            save: jest.fn().mockResolvedValue(mockLevelRepair),
            findOne: jest.fn().mockResolvedValue(mockLevelRepair),
            find: jest.fn().mockResolvedValue([mockLevelRepair]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<LevelRepairService>(LevelRepairService);
    repo = module.get(getRepositoryToken(LevelRepair));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a level repair', async () => {
      const result = await service.create({ name: 'Level 1', price: 100 } as any);
      expect(result).toEqual(mockLevelRepair);
    });
  });

  describe('findAll', () => {
    it('should return all level repairs with brand and partsPrice relations', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockLevelRepair]);
    });
  });

  describe('findOne', () => {
    it('should return a level repair', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockLevelRepair);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a level repair', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockLevelRepair);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockLevelRepair);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a level repair', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockLevelRepair);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
