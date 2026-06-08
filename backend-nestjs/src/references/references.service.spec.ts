import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesService } from './references.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reference } from './entities/reference.entity';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockReference = { id: 1, materialCode: 'MC001', description: 'Test Ref' };
const mockModel = { id: 1, name: 'Model A' };
const mockAllPart = { id: 1, name: 'Part A' };

describe('ReferencesService', () => {
  let service: ReferencesService;
  let referenceRepo: any;
  let modelRepo: any;
  let allPartRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferencesService,
        {
          provide: AppService,
          useValue: {
            cleanSpaces: jest.fn().mockImplementation((x) => x),
          },
        },
        {
          provide: getRepositoryToken(Reference),
          useValue: {
            create: jest.fn().mockReturnValue(mockReference),
            save: jest.fn().mockResolvedValue(mockReference),
            find: jest.fn().mockResolvedValue([mockReference]),
            findOne: jest.fn().mockResolvedValue(mockReference),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockReference]),
            }),
          },
        },
        {
          provide: getRepositoryToken(Model),
          useValue: {
            find: jest.fn().mockResolvedValue([mockModel]),
            findOne: jest.fn().mockResolvedValue(mockModel),
          },
        },
        {
          provide: getRepositoryToken(AllPart),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockAllPart),
          },
        },
      ],
    }).compile();

    service = module.get<ReferencesService>(ReferencesService);
    referenceRepo = module.get(getRepositoryToken(Reference));
    modelRepo = module.get(getRepositoryToken(Model));
    allPartRepo = module.get(getRepositoryToken(AllPart));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reference', async () => {
      const result = await service.create({ materialCode: 'MC001', description: 'Test', modelIds: [1], allpart: 1 } as any);
      expect(result).toEqual(mockReference);
    });

    it('should throw if no model ids provided', async () => {
      await expect(service.create({ materialCode: 'MC001', description: 'Test', modelIds: [], allpart: 1 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if no model found', async () => {
      jest.spyOn(modelRepo, 'find').mockResolvedValue([]);
      await expect(service.create({ materialCode: 'MC001', description: 'Test', modelIds: [999], allpart: 1 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if no allpart found', async () => {
      jest.spyOn(allPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ materialCode: 'MC001', description: 'Test', modelIds: [1], allpart: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all references', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockReference]);
    });
  });

  describe('findOne', () => {
    it('should return one reference', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockReference);
    });

    it('should throw if not found', async () => {
      jest.spyOn(referenceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a reference without allpart', async () => {
      jest.spyOn(referenceRepo, 'findOne').mockResolvedValue(mockReference);
      const result = await service.update(1, { description: 'Updated' } as any);
      expect(result).toEqual(mockReference);
    });

    it('should throw if allpart not found', async () => {
      jest.spyOn(allPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { allpart: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if reference not found after update', async () => {
      jest.spyOn(referenceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a reference', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockReference);
    });

    it('should throw if not found', async () => {
      jest.spyOn(referenceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCompatibleReferences', () => {
    it('should return compatible references', async () => {
      const result = await service.findCompatibleReferences(1, 1);
      expect(result).toEqual([mockReference]);
    });

    it('should throw if none found', async () => {
      jest.spyOn(referenceRepo, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      await expect(service.findCompatibleReferences(999, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findReferenceByMaterialCode', () => {
    it('should return a reference by material code', async () => {
      const result = await service.findReferenceByMaterialCode('MC001');
      expect(result).toEqual(mockReference);
    });

    it('should throw if not found', async () => {
      jest.spyOn(referenceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findReferenceByMaterialCode('INVALID')).rejects.toThrow(NotFoundException);
    });
  });
});
