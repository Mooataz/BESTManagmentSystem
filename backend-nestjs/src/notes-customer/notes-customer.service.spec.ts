import { Test, TestingModule } from '@nestjs/testing';
import { NotesCustomerService } from './notes-customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotesCustomer } from './entities/notes-customer.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockNotesCustomer = { id: 1, name: 'Note 1' };

describe('NotesCustomerService', () => {
  let service: NotesCustomerService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesCustomerService,
        {
          provide: AppService,
          useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) },
        },
        {
          provide: getRepositoryToken(NotesCustomer),
          useValue: {
            create: jest.fn().mockReturnValue(mockNotesCustomer),
            save: jest.fn().mockResolvedValue(mockNotesCustomer),
            findOne: jest.fn().mockResolvedValue(mockNotesCustomer),
            find: jest.fn().mockResolvedValue([mockNotesCustomer]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<NotesCustomerService>(NotesCustomerService);
    repo = module.get(getRepositoryToken(NotesCustomer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notes customer', async () => {
      const result = await service.create({ name: 'Note 1' } as any);
      expect(result).toEqual(mockNotesCustomer);
    });
  });

  describe('findAll', () => {
    it('should return all notes customers', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockNotesCustomer]);
    });
  });

  describe('findOne', () => {
    it('should return a notes customer', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockNotesCustomer);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a notes customer', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockNotesCustomer);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockNotesCustomer);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a notes customer', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockNotesCustomer);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
