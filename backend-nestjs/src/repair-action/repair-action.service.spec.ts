import { Test, TestingModule } from '@nestjs/testing';
import { RepairActionService } from './repair-action.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepairAction } from './entities/repair-action.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepairAction = { id: 1, name: 'Test Action' };

describe('RepairActionService', () => {
  let service: RepairActionService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepairActionService,
        {
          provide: getRepositoryToken(RepairAction),
          useValue: {
            create: jest.fn().mockReturnValue(mockRepairAction),
            save: jest.fn().mockResolvedValue(mockRepairAction),
            find: jest.fn().mockResolvedValue([mockRepairAction]),
            findOne: jest.fn().mockResolvedValue(mockRepairAction),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<RepairActionService>(RepairActionService);
    repo = module.get(getRepositoryToken(RepairAction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a repair action', async () => {
      const result = await service.create({ name: 'Test Action' } as any);
      expect(result).toEqual(mockRepairAction);
    });
  });

  describe('findAll', () => {
    it('should return all repair actions', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockRepairAction]);
    });
  });

  describe('findOne', () => {
    it('should return one repair action', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockRepairAction);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a repair action', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockRepairAction);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockRepairAction);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a repair action', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockRepairAction);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
