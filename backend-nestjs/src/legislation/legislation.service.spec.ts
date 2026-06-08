import { Test, TestingModule } from '@nestjs/testing';
import { LegislationService } from './legislation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Legislation } from './entities/legislation.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockLegislation = { id: 1, name: 'Law 1' };

describe('LegislationService', () => {
  let service: LegislationService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegislationService,
        { provide: AppService, useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) } },
        {
          provide: getRepositoryToken(Legislation),
          useValue: {
            save: jest.fn().mockResolvedValue(mockLegislation),
            findOne: jest.fn().mockResolvedValue(mockLegislation),
            find: jest.fn().mockResolvedValue([mockLegislation]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<LegislationService>(LegislationService);
    repo = module.get(getRepositoryToken(Legislation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a legislation', async () => {
      const result = await service.create({ name: 'Law 1' } as any);
      expect(result).toEqual(mockLegislation);
    });
  });

  describe('findAll', () => {
    it('should return all legislations', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockLegislation]);
    });
  });

  describe('findOne', () => {
    it('should return a legislation', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockLegislation);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a legislation', async () => {
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockLegislation);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a legislation', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockLegislation);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
