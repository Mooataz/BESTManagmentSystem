import { Test, TestingModule } from '@nestjs/testing';
import { OutputListService } from './output-list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OutputList } from './entities/output-list.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockOutputList = { id: 1, date: new Date(), remark: 'test', repair: [], customer: { id: 1 }, user: { id: 1 } };
const mockRepair = { id: 1 };
const mockCustomer = { id: 1, name: 'Test Customer' };
const mockUser = { id: 1, branch: { id: 1 } };

describe('OutputListService', () => {
  let service: OutputListService;
  let outputListRepo: any;
  let repairRepo: any;
  let customerRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutputListService,
        {
          provide: getRepositoryToken(OutputList),
          useValue: {
            create: jest.fn().mockReturnValue(mockOutputList),
            save: jest.fn().mockResolvedValue(mockOutputList),
            findOne: jest.fn().mockResolvedValue(mockOutputList),
            find: jest.fn().mockResolvedValue([mockOutputList]),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockOutputList]),
            })),
          },
        },
        {
          provide: getRepositoryToken(Repair),
          useValue: {
            find: jest.fn().mockResolvedValue([mockRepair]),
          },
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<OutputListService>(OutputListService);
    outputListRepo = module.get(getRepositoryToken(OutputList));
    repairRepo = module.get(getRepositoryToken(Repair));
    customerRepo = module.get(getRepositoryToken(Customer));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an output list', async () => {
      const dto = { repairIds: [1], customer: 1, user: 1, date: new Date(), remark: 'test' };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockOutputList);
    });

    it('should throw if no repairIds provided', async () => {
      const dto = { repairIds: [], customer: 1, user: 1 };
      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if repair not found', async () => {
      jest.spyOn(repairRepo, 'find').mockResolvedValue([]);
      const dto = { repairIds: [999], customer: 1, user: 1 };
      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if customer not found', async () => {
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(null);
      const dto = { repairIds: [1], customer: 999, user: 1 };
      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      const dto = { repairIds: [1], customer: 1, user: 999 };
      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all output lists', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockOutputList]);
    });
  });

  describe('findOne', () => {
    it('should return one output list', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockOutputList);
    });

    it('should throw if not found', async () => {
      jest.spyOn(outputListRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBranchId', () => {
    it('should return output lists by branch', async () => {
      const result = await service.findByBranchId(1);
      expect(result).toEqual([mockOutputList]);
    });

    it('should return empty array if none found', async () => {
      outputListRepo.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      const result = await service.findByBranchId(999);
      expect(result).toEqual([]);
    });
  });

  describe('findByUserId', () => {
    it('should return output lists by user', async () => {
      const result = await service.findByUserId(1);
      expect(result).toEqual([mockOutputList]);
    });

    it('should throw if none found', async () => {
      outputListRepo.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      await expect(service.findByUserId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCustomerId', () => {
    it('should return output lists by customer', async () => {
      const result = await service.findByCustomerId(1);
      expect(result).toEqual([mockOutputList]);
    });

    it('should throw if none found', async () => {
      outputListRepo.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      await expect(service.findByCustomerId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an output list', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockOutputList);
    });

    it('should throw if not found', async () => {
      jest.spyOn(outputListRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
