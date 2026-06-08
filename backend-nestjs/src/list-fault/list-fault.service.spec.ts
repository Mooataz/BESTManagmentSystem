import { Test, TestingModule } from '@nestjs/testing';
import { ListFaultService } from './list-fault.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ListFault } from './entities/list-fault.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockListFault = { id: 1, name: 'Fault 1' };

describe('ListFaultService', () => {
  let service: ListFaultService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListFaultService,
        {
          provide: AppService,
          useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) },
        },
        {
          provide: getRepositoryToken(ListFault),
          useValue: {
            create: jest.fn().mockReturnValue(mockListFault),
            save: jest.fn().mockResolvedValue(mockListFault),
            findOne: jest.fn().mockResolvedValue(mockListFault),
            find: jest.fn().mockResolvedValue([mockListFault]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ListFaultService>(ListFaultService);
    repo = module.get(getRepositoryToken(ListFault));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a list fault', async () => {
      const result = await service.create({ name: 'Fault 1' } as any);
      expect(result).toEqual(mockListFault);
    });
  });

  describe('findAll', () => {
    it('should return all list faults', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockListFault]);
    });
  });

  describe('findOne', () => {
    it('should return a list fault', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockListFault);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a list fault', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockListFault);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockListFault);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a list fault', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockListFault);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
