import { Test, TestingModule } from '@nestjs/testing';
import { RepairService } from './repair.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repair } from './entities/repair.entity';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { ListFault } from 'src/list-fault/entities/list-fault.entity';
import { CustomerRequest } from 'src/customer-request/entities/customer-request.entity';
import { NotesCustomer } from 'src/notes-customer/entities/notes-customer.entity';
import { ExpertiseReason } from 'src/expertise-reasons/entities/expertise-reason.entity';
import { RepairAction } from 'src/repair-action/entities/repair-action.entity';
import { Device } from 'src/devices/entities/device.entity';
import { User } from 'src/users/entities/user.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { Company } from 'src/company/entities/company.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepair = { id: 1, description: 'Test', device: { id: 1 }, customer: { id: 1 } };

function mockRepo() {
  return {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(mockRepair),
    findAndCount: jest.fn().mockResolvedValue([[mockRepair], 1]),
    create: jest.fn().mockReturnValue(mockRepair),
    save: jest.fn().mockResolvedValue(mockRepair),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockRepair]),
      getOne: jest.fn().mockResolvedValue(mockRepair),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    })),
  };
}

describe('RepairService', () => {
  let service: RepairService;
  let repairRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepairService,
        { provide: getRepositoryToken(Repair), useValue: mockRepo() },
        { provide: getRepositoryToken(Accessory), useValue: mockRepo() },
        { provide: getRepositoryToken(ListFault), useValue: mockRepo() },
        { provide: getRepositoryToken(CustomerRequest), useValue: mockRepo() },
        { provide: getRepositoryToken(NotesCustomer), useValue: mockRepo() },
        { provide: getRepositoryToken(ExpertiseReason), useValue: mockRepo() },
        { provide: getRepositoryToken(RepairAction), useValue: mockRepo() },
        { provide: getRepositoryToken(Device), useValue: mockRepo() },
        { provide: getRepositoryToken(User), useValue: mockRepo() },
        { provide: getRepositoryToken(StockPart), useValue: mockRepo() },
        { provide: getRepositoryToken(ApproveStock), useValue: mockRepo() },
        { provide: getRepositoryToken(Customer), useValue: mockRepo() },
        { provide: getRepositoryToken(HistoryRepair), useValue: mockRepo() },
        { provide: getRepositoryToken(Tracability), useValue: mockRepo() },
        { provide: getRepositoryToken(PartsPrice), useValue: mockRepo() },
        { provide: getRepositoryToken(Company), useValue: mockRepo() },
      ],
    }).compile();

    service = module.get<RepairService>(RepairService);
    repairRepo = module.get(getRepositoryToken(Repair));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated repairs', async () => {
      const result = await service.findAll(1, 10);
      expect(result.data).toEqual([mockRepair]);
      expect(result.total).toBe(1);
    });

    it('should throw if empty', async () => {
      jest.spyOn(repairRepo, 'findAndCount').mockResolvedValue([[], 0]);
      await expect(service.findAll(1, 10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a repair', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockRepair);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a repair', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockRepair);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repairRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
