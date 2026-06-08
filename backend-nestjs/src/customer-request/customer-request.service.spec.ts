import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRequestService } from './customer-request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerRequest } from './entities/customer-request.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockCustomerRequest = { id: 1, name: 'Repair Request' };

describe('CustomerRequestService', () => {
  let service: CustomerRequestService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRequestService,
        { provide: AppService, useValue: { cleanSpaces: jest.fn().mockImplementation((x) => x) } },
        {
          provide: getRepositoryToken(CustomerRequest),
          useValue: {
            save: jest.fn().mockResolvedValue(mockCustomerRequest),
            findOne: jest.fn().mockResolvedValue(mockCustomerRequest),
            find: jest.fn().mockResolvedValue([mockCustomerRequest]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerRequestService>(CustomerRequestService);
    repo = module.get(getRepositoryToken(CustomerRequest));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer request', async () => {
      const result = await service.create({ name: 'Repair Request' } as any);
      expect(result).toEqual(mockCustomerRequest);
    });
  });

  describe('findAll', () => {
    it('should return all customer requests', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCustomerRequest]);
    });
  });

  describe('findOne', () => {
    it('should return a customer request', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockCustomerRequest);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer request', async () => {
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockCustomerRequest);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a customer request', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockCustomerRequest);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
