import { Test, TestingModule } from '@nestjs/testing';
import { DistributeurService } from './distributeur.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Distributeur } from './entities/distributeur.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockDistributeur = { id: 1, name: 'Distrib A', phone: 123456, email: 'a@a.com', location: 'Tunis', taxRegisterNumber: 'TN123' };

describe('DistributeurService', () => {
  let service: DistributeurService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistributeurService,
        { provide: AppService, useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) } },
        {
          provide: getRepositoryToken(Distributeur),
          useValue: {
            create: jest.fn().mockReturnValue(mockDistributeur),
            save: jest.fn().mockResolvedValue(mockDistributeur),
            findOne: jest.fn().mockResolvedValue(mockDistributeur),
            find: jest.fn().mockResolvedValue([mockDistributeur]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<DistributeurService>(DistributeurService);
    repo = module.get(getRepositoryToken(Distributeur));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a distributeur', async () => {
      const result = await service.create({ name: 'Distrib A' } as any);
      expect(result).toEqual(mockDistributeur);
    });
  });

  describe('findAll', () => {
    it('should return all distributeurs', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockDistributeur]);
    });
  });

  describe('findOne', () => {
    it('should return a distributeur', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockDistributeur);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a distributeur', async () => {
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockDistributeur);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a distributeur', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockDistributeur);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
