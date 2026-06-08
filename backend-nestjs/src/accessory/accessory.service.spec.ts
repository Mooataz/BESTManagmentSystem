import { Test, TestingModule } from '@nestjs/testing';
import { AccessoryService } from './accessory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Accessory } from './entities/accessory.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockAccessory = { id: 1, name: 'Charger' };

describe('AccessoryService', () => {
  let service: AccessoryService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessoryService,
        AppService,
        {
          provide: getRepositoryToken(Accessory),
          useValue: {
            create: jest.fn().mockReturnValue(mockAccessory),
            save: jest.fn().mockResolvedValue(mockAccessory),
            findOne: jest.fn().mockResolvedValue(mockAccessory),
            find: jest.fn().mockResolvedValue([mockAccessory]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            findOneOrFail: jest.fn().mockResolvedValue(mockAccessory),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<AccessoryService>(AccessoryService);
    repo = module.get(getRepositoryToken(Accessory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an accessory', async () => {
      const result = await service.create({ name: 'Charger' } as any);
      expect(result).toEqual(mockAccessory);
    });
  });

  describe('findAll', () => {
    it('should return all accessories', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAccessory]);
    });
  });

  describe('findOne', () => {
    it('should return an accessory', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockAccessory);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an accessory', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockAccessory);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockAccessory);
    });

    it('should throw if not found on update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an accessory', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockAccessory);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
