import { Test, TestingModule } from '@nestjs/testing';
import { ModelsService } from './models.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { TypeModel } from 'src/type-model/entities/type-model.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockModel = { id: 1, name: 'Model 1', picture: 'pic.jpg', brand: { id: 1, name: 'Brand 1', status: 'Autoriser' }, typeModel: { id: 1, name: 'Type 1' }, allpart: [{ id: 1, description: 'Part 1' }] };
const mockBrand = { id: 1, name: 'Brand 1', status: 'Autoriser' };
const mockTypeModel = { id: 1, name: 'Type 1' };
const mockAllPart = { id: 1, description: 'Part 1' };

describe('ModelsService', () => {
  let service: ModelsService;
  let modelRepo: any;
  let allPartRepo: any;
  let brandRepo: any;
  let typeModelRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelsService,
        AppService,
        {
          provide: getRepositoryToken(Model),
          useValue: {
            create: jest.fn().mockReturnValue(mockModel),
            save: jest.fn().mockResolvedValue(mockModel),
            find: jest.fn().mockResolvedValue([mockModel]),
            findOne: jest.fn().mockResolvedValue(mockModel),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AllPart),
          useValue: {
            find: jest.fn().mockResolvedValue([mockAllPart]),
          },
        },
        {
          provide: getRepositoryToken(Brand),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockBrand),
          },
        },
        {
          provide: getRepositoryToken(TypeModel),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockTypeModel),
          },
        },
      ],
    }).compile();

    service = module.get<ModelsService>(ModelsService);
    modelRepo = module.get(getRepositoryToken(Model));
    allPartRepo = module.get(getRepositoryToken(AllPart));
    brandRepo = module.get(getRepositoryToken(Brand));
    typeModelRepo = module.get(getRepositoryToken(TypeModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a model', async () => {
      const result = await service.create({ name: 'Model 1', brand: 1, typeModel: 1, allpartIds: [1] } as any);
      expect(result).toEqual(mockModel);
    });

    it('should throw if brand not found', async () => {
      jest.spyOn(brandRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ name: 'Test', brand: 999, typeModel: 1 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if typeModel not found', async () => {
      jest.spyOn(typeModelRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ name: 'Test', brand: 1, typeModel: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all models', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockModel]);
    });

    it('should throw if empty', async () => {
      jest.spyOn(modelRepo, 'find').mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a model', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockModel);
    });

    it('should throw if not found', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a model', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(mockModel);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockModel);
    });

    it('should throw if model not found', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if brand update fails validation', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(mockModel);
      jest.spyOn(brandRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { brand: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if typeModel update fails validation', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(mockModel);
      jest.spyOn(typeModelRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(1, { typeModel: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a model', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockModel);
    });

    it('should throw if not found', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBrandId', () => {
    it('should return models by brand', async () => {
      const qb = { leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([mockModel]) };
      jest.spyOn(modelRepo, 'createQueryBuilder').mockReturnValue(qb);
      const result = await service.findByBrandId(1);
      expect(result).toEqual([mockModel]);
    });

    it('should throw if empty', async () => {
      const qb = { leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) };
      jest.spyOn(modelRepo, 'createQueryBuilder').mockReturnValue(qb);
      await expect(service.findByBrandId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByTypeModelId', () => {
    it('should return models by typeModel', async () => {
      const qb = { leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([mockModel]) };
      jest.spyOn(modelRepo, 'createQueryBuilder').mockReturnValue(qb);
      const result = await service.findByTypeModelId(1);
      expect(result).toEqual([mockModel]);
    });

    it('should throw if empty', async () => {
      const qb = { leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) };
      jest.spyOn(modelRepo, 'createQueryBuilder').mockReturnValue(qb);
      await expect(service.findByTypeModelId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBrandAuthorised', () => {
    it('should return models with authorised brand', async () => {
      jest.spyOn(modelRepo, 'find').mockResolvedValue([mockModel]);
      const result = await service.findByBrandAuthorised();
      expect(result).toEqual([mockModel]);
    });

    it('should filter out non-authorised brands', async () => {
      const unauthModel = { ...mockModel, brand: { ...mockBrand, status: 'Non autoriser' } };
      jest.spyOn(modelRepo, 'find').mockResolvedValue([unauthModel]);
      const result = await service.findByBrandAuthorised();
      expect(result).toEqual([]);
    });
  });
});
