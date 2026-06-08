import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Company } from 'src/company/entities/company.entity';
import { NotFoundException } from '@nestjs/common';

const mockInvoice = { id: 1, reference: 'FACT-001', total: 100, repair: { id: 1 }, user: { id: 1 } };

function mockRepo() {
  return {
    find: jest.fn().mockResolvedValue([mockInvoice]),
    findOne: jest.fn().mockResolvedValue(mockInvoice),
    findAndCount: jest.fn().mockResolvedValue([[mockInvoice], 1]),
    create: jest.fn().mockReturnValue(mockInvoice),
    save: jest.fn().mockResolvedValue(mockInvoice),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };
}

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: getRepositoryToken(Invoice), useValue: mockRepo() },
        { provide: getRepositoryToken(Repair), useValue: mockRepo() },
        { provide: getRepositoryToken(User), useValue: mockRepo() },
        { provide: getRepositoryToken(OtherCost), useValue: mockRepo() },
        { provide: getRepositoryToken(PartsPrice), useValue: mockRepo() },
        { provide: getRepositoryToken(LevelRepair), useValue: mockRepo() },
        { provide: getRepositoryToken(AllPart), useValue: mockRepo() },
        { provide: getRepositoryToken(Company), useValue: mockRepo() },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepo = module.get(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
    });

    it('should throw if empty', async () => {
      jest.spyOn(invoiceRepo, 'find').mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return one invoice', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockInvoice);
    });

    it('should throw if not found', async () => {
      jest.spyOn(invoiceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an invoice', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockInvoice);
    });

    it('should throw if not found', async () => {
      jest.spyOn(invoiceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
