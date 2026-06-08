import { Test, TestingModule } from '@nestjs/testing';
import { BinService } from './bin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockBin = { id: 1, name: 'Bin A', type: 'Storage', branch: { id: 1, name: 'Branch 1' } };
const mockBranch = { id: 1, name: 'Branch 1' };

describe('BinService', () => {
  let service: BinService;
  let binRepo: any;
  let branchRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BinService,
        AppService,
        {
          provide: getRepositoryToken(Bin),
          useValue: {
            create: jest.fn().mockReturnValue(mockBin),
            save: jest.fn().mockResolvedValue(mockBin),
            findOne: jest.fn().mockResolvedValue(mockBin),
            find: jest.fn().mockResolvedValue([mockBin]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            findOneOrFail: jest.fn().mockResolvedValue(mockBin),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockBranch),
          },
        },
      ],
    }).compile();

    service = module.get<BinService>(BinService);
    binRepo = module.get(getRepositoryToken(Bin));
    branchRepo = module.get(getRepositoryToken(Branch));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bin', async () => {
      const result = await service.create({ name: 'Bin A', type: 'Storage', branch: 1 } as any);
      expect(result).toEqual(mockBin);
    });

    it('should throw if branch not found', async () => {
      jest.spyOn(branchRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ name: 'X', type: 'S', branch: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all bins', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBin]);
    });
  });

  describe('findOne', () => {
    it('should return a bin', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockBin);
    });

    it('should throw if not found', async () => {
      jest.spyOn(binRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a bin', async () => {
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockBin);
    });

    it('should throw if bin not found on update', async () => {
      jest.spyOn(binRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if branch not found on update', async () => {
      jest.spyOn(branchRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { branch: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a bin', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockBin);
    });

    it('should throw if not found', async () => {
      jest.spyOn(binRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBranchId', () => {
    it('should return bins for a branch', async () => {
      const result = await service.findByBranchId(1);
      expect(result).toEqual([mockBin]);
    });
  });

  describe('findByBranchIdAndType', () => {
    it('should return filtered bins', async () => {
      jest.spyOn(binRepo, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockBin]),
      });
      const result = await service.findByBranchIdAndType(1, 'Storage');
      expect(result).toEqual([mockBin]);
    });
  });

  describe('findByName', () => {
    it('should return a bin by name', async () => {
      const result = await service.findByName('Bin A');
      expect(result).toEqual(mockBin);
    });

    it('should throw if not found by name', async () => {
      jest.spyOn(binRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findByName('Unknown')).rejects.toThrow(Error);
    });
  });
});
