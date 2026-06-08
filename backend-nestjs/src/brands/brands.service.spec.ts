import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockBrand = { id: 1, name: 'Samsung', status: 'Autoriser', logo: 'logo.png' };

describe('BrandsService', () => {
  let service: BrandsService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        AppService,
        {
          provide: getRepositoryToken(Brand),
          useValue: {
            create: jest.fn().mockReturnValue(mockBrand),
            save: jest.fn().mockResolvedValue(mockBrand),
            findOne: jest.fn().mockResolvedValue(mockBrand),
            find: jest.fn().mockResolvedValue([mockBrand]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            findOneOrFail: jest.fn().mockResolvedValue(mockBrand),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    repo = module.get(getRepositoryToken(Brand));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a brand', async () => {
      const result = await service.create({ name: 'Samsung' } as any);
      expect(result).toEqual(mockBrand);
    });
  });

  describe('findAll', () => {
    it('should return all brands', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBrand]);
    });
  });

  describe('findOne', () => {
    it('should return a brand', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockBrand);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a brand', async () => {
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockBrand);
    });

    it('should throw if not found on update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a brand', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockBrand);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByStatus', () => {
    it('should return brands filtered by status', async () => {
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockBrand]),
      });
      const result = await service.findByStatus('Autoriser');
      expect(result).toEqual([mockBrand]);
    });

    it('should throw if no brands with given status', async () => {
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      await expect(service.findByStatus('NonAutoriser')).rejects.toThrow(NotFoundException);
    });
  });
});
