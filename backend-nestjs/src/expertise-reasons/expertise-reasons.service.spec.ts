import { Test, TestingModule } from '@nestjs/testing';
import { ExpertiseReasonsService } from './expertise-reasons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpertiseReason } from './entities/expertise-reason.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockExpertiseReason = { id: 1, name: 'Reason 1' };

describe('ExpertiseReasonsService', () => {
  let service: ExpertiseReasonsService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpertiseReasonsService,
        {
          provide: AppService,
          useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) },
        },
        {
          provide: getRepositoryToken(ExpertiseReason),
          useValue: {
            create: jest.fn().mockReturnValue(mockExpertiseReason),
            save: jest.fn().mockResolvedValue(mockExpertiseReason),
            findOne: jest.fn().mockResolvedValue(mockExpertiseReason),
            find: jest.fn().mockResolvedValue([mockExpertiseReason]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ExpertiseReasonsService>(ExpertiseReasonsService);
    repo = module.get(getRepositoryToken(ExpertiseReason));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an expertise reason', async () => {
      const result = await service.create({ name: 'Reason 1' } as any);
      expect(result).toEqual(mockExpertiseReason);
    });
  });

  describe('findAll', () => {
    it('should return all expertise reasons', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockExpertiseReason]);
    });
  });

  describe('findOne', () => {
    it('should return an expertise reason', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockExpertiseReason);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an expertise reason', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockExpertiseReason);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockExpertiseReason);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an expertise reason', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockExpertiseReason);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
