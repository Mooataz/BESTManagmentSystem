import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockCompany = { id: 1, name: 'BEST', bank: 'BIAT', headquarterslocation: 'Tunis', taxRegisterNumber: '123456' };

describe('CompanyService', () => {
  let service: CompanyService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: AppService, useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) } },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            create: jest.fn().mockReturnValue(mockCompany),
            save: jest.fn().mockResolvedValue(mockCompany),
            findOne: jest.fn().mockResolvedValue(mockCompany),
            find: jest.fn().mockResolvedValue([mockCompany]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repo = module.get(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const result = await service.create({ name: 'BEST', bank: 'BIAT' } as any);
      expect(result).toEqual(mockCompany);
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCompany]);
    });
  });

  describe('findOne', () => {
    it('should return a company', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockCompany);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockCompany);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a company', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockCompany);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
