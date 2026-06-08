import { Test, TestingModule } from '@nestjs/testing';
import { TypeModelService } from './type-model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeModel } from './entities/type-model.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockTypeModel = { id: 1, description: 'Test Type' };

describe('TypeModelService', () => {
  let service: TypeModelService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeModelService,
        {
          provide: AppService,
          useValue: {
            cleanSpaces: jest.fn().mockImplementation((x) => x),
          },
        },
        {
          provide: getRepositoryToken(TypeModel),
          useValue: {
            create: jest.fn().mockReturnValue(mockTypeModel),
            save: jest.fn().mockResolvedValue(mockTypeModel),
            find: jest.fn().mockResolvedValue([mockTypeModel]),
            findOne: jest.fn().mockResolvedValue(mockTypeModel),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<TypeModelService>(TypeModelService);
    repo = module.get(getRepositoryToken(TypeModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a type model', async () => {
      const result = await service.create({ description: 'Test Type' } as any);
      expect(result).toEqual(mockTypeModel);
    });
  });

  describe('findAll', () => {
    it('should return all type models', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTypeModel]);
    });
  });

  describe('findOne', () => {
    it('should return one type model', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTypeModel);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a type model', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockTypeModel);
      const result = await service.update(1, { description: 'Updated' } as any);
      expect(result).toEqual(mockTypeModel);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a type model', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockTypeModel);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
