import { Test, TestingModule } from '@nestjs/testing';
import { AllPartsService } from './all-parts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AllPart } from './entities/all-part.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockAllPart = { id: 1, description: 'Screen' };

describe('AllPartsService', () => {
  let service: AllPartsService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllPartsService,
        AppService,
        {
          provide: getRepositoryToken(AllPart),
          useValue: {
            create: jest.fn().mockReturnValue(mockAllPart),
            save: jest.fn().mockResolvedValue(mockAllPart),
            findOne: jest.fn().mockResolvedValue(mockAllPart),
            find: jest.fn().mockResolvedValue([mockAllPart]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            findOneOrFail: jest.fn().mockResolvedValue(mockAllPart),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<AllPartsService>(AllPartsService);
    repo = module.get(getRepositoryToken(AllPart));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an all-part', async () => {
      const result = await service.create({ description: 'Screen' } as any);
      expect(result).toEqual(mockAllPart);
    });
  });

  describe('findAll', () => {
    it('should return all parts', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAllPart]);
    });
  });

  describe('findOne', () => {
    it('should return an all-part', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockAllPart);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an all-part', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockAllPart);
      const result = await service.update(1, { description: 'Updated' } as any);
      expect(result).toEqual(mockAllPart);
    });

    it('should throw if not found on update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { description: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an all-part', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockAllPart);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
