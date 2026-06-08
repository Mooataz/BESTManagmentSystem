import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockCustomer = { id: 1, name: 'Client Test', phone: 90908080, email: 'client@test.tn' };

describe('CustomersService', () => {
  let service: CustomersService;
  let customerRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        AppService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            create: jest.fn().mockReturnValue(mockCustomer),
            save: jest.fn().mockResolvedValue(mockCustomer),
            findOne: jest.fn().mockResolvedValue(mockCustomer),
            find: jest.fn().mockResolvedValue([mockCustomer]),
            findAndCount: jest.fn().mockResolvedValue([[mockCustomer], 1]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockCustomer]),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    customerRepo = module.get(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const result = await service.create({ name: 'Client Test', phone: 90908080 } as any);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return customers', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCustomer]);
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw if not found', async () => {
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(mockCustomer);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockCustomer);
    });
  });
});
