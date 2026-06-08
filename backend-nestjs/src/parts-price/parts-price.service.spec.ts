import { Test, TestingModule } from '@nestjs/testing';
import { PartsPriceService } from './parts-price.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PartsPrice } from './entities/parts-price.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Model } from 'src/models/entities/model.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';
import { Company } from 'src/company/entities/company.entity';
import { NotFoundException } from '@nestjs/common';

const mockPartsPrice = {
  id: 1, price: 100,
  model: { id: 1, name: 'Model A', brand: { id: 1, name: 'Brand A' } },
  allPart: { id: 1, description: 'Part A' },
  levelRepair: { id: 1, name: 'Level 1' },
};
const mockModel = { id: 1, name: 'Model A', brand: { id: 1, name: 'Brand A' } };
const mockAllPart = { id: 1, description: 'Part A' };
const mockLevelRepair = { id: 1, name: 'Level 1', price: 50 };
const mockCompany = { id: 1, tva: 19, timbreFiscale: 1 };

const createMockQueryBuilder = () => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  getRawMany: jest.fn(),
  from: jest.fn().mockReturnThis(),
});

describe('PartsPriceService', () => {
  let service: PartsPriceService;
  let partsPriceRepo: any;
  let modelRepo: any;
  let allPartRepo: any;
  let levelRepairRepo: any;
  let companyRepo: any;
  let qb: ReturnType<typeof createMockQueryBuilder>;

  beforeEach(async () => {
    qb = createMockQueryBuilder();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartsPriceService,
        {
          provide: getRepositoryToken(PartsPrice),
          useValue: {
            create: jest.fn().mockReturnValue(mockPartsPrice),
            save: jest.fn().mockResolvedValue(mockPartsPrice),
            find: jest.fn().mockResolvedValue([mockPartsPrice]),
            findOne: jest.fn().mockResolvedValue(mockPartsPrice),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            manager: {
              query: jest.fn().mockResolvedValue([{ name: 'Brand A' }]),
            },
            createQueryBuilder: jest.fn().mockReturnValue(qb),
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
            find: jest.fn().mockResolvedValue([mockAllPart]),
            findOne: jest.fn().mockResolvedValue(mockAllPart),
          },
        },
        {
          provide: getRepositoryToken(LevelRepair),
          useValue: {
            find: jest.fn().mockResolvedValue([mockLevelRepair]),
            findOne: jest.fn().mockResolvedValue(mockLevelRepair),
          },
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            find: jest.fn().mockResolvedValue([mockCompany]),
          },
        },
      ],
    }).compile();

    service = module.get<PartsPriceService>(PartsPriceService);
    partsPriceRepo = module.get(getRepositoryToken(PartsPrice));
    modelRepo = module.get(getRepositoryToken(Model));
    allPartRepo = module.get(getRepositoryToken(AllPart));
    levelRepairRepo = module.get(getRepositoryToken(LevelRepair));
    companyRepo = module.get(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReferences', () => {
    it('should return references from all related tables', async () => {
      const result = await service.getReferences();
      expect(result).toHaveProperty('brands');
      expect(result).toHaveProperty('models');
      expect(result).toHaveProperty('allParts');
      expect(result).toHaveProperty('levelRepairs');
      expect(partsPriceRepo.manager.query).toHaveBeenCalled();
      expect(modelRepo.find).toHaveBeenCalled();
      expect(allPartRepo.find).toHaveBeenCalled();
      expect(levelRepairRepo.find).toHaveBeenCalled();
    });
  });

  describe('generateTemplate', () => {
    it('should generate an Excel workbook buffer', async () => {
      const result = await service.generateTemplate();
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('create', () => {
    const dto = { price: 100, modelId: 1, allPartId: 1, laborCharge: 1 };

    it('should create a parts price with all relations', async () => {
      const result = await service.create(dto as any);
      expect(modelRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(allPartRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(levelRepairRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(partsPriceRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockPartsPrice);
    });

    it('should throw if model not found', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if allPart not found', async () => {
      jest.spyOn(allPartRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if levelRepair not found', async () => {
      jest.spyOn(levelRepairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.create({ ...dto, laborCharge: 999 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should create without optional modelId and allPartId', async () => {
      const result = await service.create({ price: 100, laborCharge: 1 } as any);
      expect(result).toEqual(mockPartsPrice);
    });
  });

  describe('findAll', () => {
    it('should return all parts prices with relations', async () => {
      const result = await service.findAll();
      expect(partsPriceRepo.find).toHaveBeenCalledWith({
        relations: ['model', 'model.brand', 'allPart', 'levelRepair'],
      });
      expect(result).toEqual([mockPartsPrice]);
    });

    it('should throw if no data found', async () => {
      jest.spyOn(partsPriceRepo, 'find').mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a parts price by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockPartsPrice);
    });

    it('should throw if not found', async () => {
      jest.spyOn(partsPriceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a parts price', async () => {
      const dto = { price: 200 } as any;
      const result = await service.update(1, dto);
      expect(partsPriceRepo.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockPartsPrice);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(partsPriceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { price: 200 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a parts price', async () => {
      const result = await service.remove(1);
      expect(partsPriceRepo.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockPartsPrice);
    });

    it('should throw if not found', async () => {
      jest.spyOn(partsPriceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('importExcel', () => {
    it('should import valid rows successfully', async () => {
      const rows = [
        { brandName: 'Brand A', modelName: 'Model A', allPartDescription: 'Part A', price: 100, levelRepairName: 'Level 1' },
      ];
      const result = await service.importExcel(rows);
      expect(result.imported).toBe(1);
      expect(result.errors).toEqual([]);
    });

    it('should report incomplete rows', async () => {
      const rows = [{ brandName: '', modelName: '', allPartDescription: '', price: null as any }];
      const result = await service.importExcel(rows);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should report unknown model', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(null);
      const rows = [
        { brandName: 'Unknown', modelName: 'Unknown', allPartDescription: 'Part A', price: 100 },
      ];
      const result = await service.importExcel(rows);
      expect(result.imported).toBe(0);
      expect(result.errors.some((e: string) => e.includes('introuvable'))).toBe(true);
    });

    it('should report unknown allPart', async () => {
      jest.spyOn(modelRepo, 'findOne').mockResolvedValue(mockModel as any);
      jest.spyOn(allPartRepo, 'findOne').mockResolvedValue(null);
      const rows = [
        { brandName: 'Brand A', modelName: 'Model A', allPartDescription: 'Unknown', price: 100 },
      ];
      const result = await service.importExcel(rows);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should report unknown levelRepair', async () => {
      jest.spyOn(levelRepairRepo, 'findOne').mockResolvedValue(null);
      const rows = [
        { brandName: 'Brand A', modelName: 'Model A', allPartDescription: 'Part A', price: 100, levelRepairName: 'Unknown' },
      ];
      const result = await service.importExcel(rows);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should update existing parts price on re-import', async () => {
      jest.spyOn(partsPriceRepo, 'findOne').mockResolvedValueOnce(mockPartsPrice);
      const rows = [
        { brandName: 'Brand A', modelName: 'Model A', allPartDescription: 'Part A', price: 200 },
      ];
      const result = await service.importExcel(rows);
      expect(result.imported).toBe(1);
    });
  });

  describe('getViewData', () => {
    it('should return view data with calculated prices', async () => {
      const dbRows = [
        { brandName: 'Brand A', modelName: 'Model A', typeModelName: null, allPartDescription: 'Part A', allPartId: 1, modelId: 1, partsPriceId: 1, basePrice: 100, levelRepairPrice: 50, levelRepairName: 'Level 1', stockCount: 5 },
      ];
      jest.spyOn(partsPriceRepo.manager, 'query').mockResolvedValue(dbRows);

      const result = await service.getViewData(1);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('calculatedPrice');
      expect(result[0].basePrice).toBe(100);
      expect(result[0].stockCount).toBe(5);
    });
  });

  describe('getAvailability', () => {
    it('should return availability data from raw query', async () => {
      const dbRows = [
        { id: 1, price: 100, modelId: 1, modelName: 'Model A', brandId: 1, brandName: 'Brand A', allPartId: 1, allPartDescription: 'Part A', levelRepairId: 1, levelRepairName: 'Level 1', levelRepairPrice: 50, stockCount: 5 },
      ];
      jest.spyOn(partsPriceRepo.manager, 'query').mockResolvedValue(dbRows);

      const result = await service.getAvailability();
      expect(result.length).toBe(1);
      expect(result[0].brandName).toBe('Brand A');
    });
  });

  describe('findByModelallPArt', () => {
    it('should find by model and allPart ids', async () => {
      const result = await service.findByModelallPArt(1, 1);
      expect(partsPriceRepo.findOne).toHaveBeenCalledWith({
        where: { model: { id: 1 }, allPart: { id: 1 } },
        relations: ['model', 'allPart', 'levelRepair'],
      });
      expect(result).toEqual(mockPartsPrice);
    });

    it('should throw if not found', async () => {
      jest.spyOn(partsPriceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findByModelallPArt(999, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByModelAndPartIds', () => {
    it('should find parts prices by model and multiple part ids', async () => {
      const result = await service.findByModelAndPartIds(1, [1, 2]);
      expect(partsPriceRepo.find).toHaveBeenCalledWith({
        where: [
          { model: { id: 1 }, allPart: { id: 1 } },
          { model: { id: 1 }, allPart: { id: 2 } },
        ],
        relations: ['allPart', 'levelRepair'],
      });
      expect(result).toEqual([mockPartsPrice]);
    });
  });

  describe('getCompanyTvaTimbre', () => {
    it('should return tva and timbre from first company', async () => {
      const result = await service.getCompanyTvaTimbre();
      expect(companyRepo.find).toHaveBeenCalledWith({ take: 1 });
      expect(result).toEqual({ tva: 19, timbreFiscale: 1 });
    });

    it('should return zeros if no company found', async () => {
      jest.spyOn(companyRepo, 'find').mockResolvedValue([]);
      const result = await service.getCompanyTvaTimbre();
      expect(result).toEqual({ tva: 0, timbreFiscale: 0 });
    });
  });
});
