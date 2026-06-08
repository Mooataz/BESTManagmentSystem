import { Test, TestingModule } from '@nestjs/testing';
import { BranchesService } from './branches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Company } from 'src/company/entities/company.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockBranch = { id: 1, name: 'Branch 1', location: 'Tunis', company: { id: 1, name: 'BEST' } };
const mockCompany = { id: 1, name: 'BEST' };

describe('BranchesService', () => {
  let service: BranchesService;
  let branchRepo: any;
  let companyRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchesService,
        AppService,
        {
          provide: getRepositoryToken(Branch),
          useValue: {
            create: jest.fn().mockReturnValue(mockBranch),
            save: jest.fn().mockResolvedValue(mockBranch),
            findOne: jest.fn().mockResolvedValue(mockBranch),
            find: jest.fn().mockResolvedValue([mockBranch]),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    findOneOrFail: jest.fn().mockResolvedValue(mockBranch),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCompany),
          },
        },
      ],
    }).compile();

    service = module.get<BranchesService>(BranchesService);
    branchRepo = module.get(getRepositoryToken(Branch));
    companyRepo = module.get(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a branch', async () => {
      const result = await service.create({ name: 'Branch 1', location: 'Tunis', company: 1 } as any);
      expect(result).toEqual(mockBranch);
    });

    it('should throw if company not found', async () => {
      jest.spyOn(companyRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ name: 'Test', location: 'X', company: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all branches', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBranch]);
    });

    it('should throw if empty', async () => {
      jest.spyOn(branchRepo, 'find').mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a branch', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockBranch);
    });

    it('should throw if not found', async () => {
      jest.spyOn(branchRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a branch', async () => {
      jest.spyOn(branchRepo, 'findOne').mockResolvedValue(mockBranch);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockBranch);
    });
  });

  describe('remove', () => {
    it('should delete a branch', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockBranch);
    });

    it('should throw if not found', async () => {
      jest.spyOn(branchRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
