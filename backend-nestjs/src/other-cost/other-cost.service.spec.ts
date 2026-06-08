import { Test, TestingModule } from '@nestjs/testing';
import { OtherCostService } from './other-cost.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OtherCost } from './entities/other-cost.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockOtherCost = { id: 1, name: 'Test Cost', price: 100, status: 'Active' };

describe('OtherCostService', () => {
  let service: OtherCostService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtherCostService,
        {
          provide: AppService,
          useValue: {
            cleanSpaces: jest.fn().mockImplementation((x) => x),
          },
        },
        {
          provide: getRepositoryToken(OtherCost),
          useValue: {
            create: jest.fn().mockReturnValue(mockOtherCost),
            save: jest.fn().mockResolvedValue(mockOtherCost),
            find: jest.fn().mockResolvedValue([mockOtherCost]),
            findOne: jest.fn().mockResolvedValue(mockOtherCost),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<OtherCostService>(OtherCostService);
    repo = module.get(getRepositoryToken(OtherCost));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an other cost', async () => {
      const result = await service.create({ name: 'Test Cost', price: 100 } as any);
      expect(result).toEqual(mockOtherCost);
    });
  });

  describe('findAll', () => {
    it('should return all other costs', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockOtherCost]);
    });
  });

  describe('findOne', () => {
    it('should return one other cost', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockOtherCost);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an other cost', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockOtherCost);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockOtherCost);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an other cost', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockOtherCost);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
