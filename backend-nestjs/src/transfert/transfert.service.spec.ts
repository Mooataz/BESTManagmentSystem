import { Test, TestingModule } from '@nestjs/testing';
import { TransfertService } from './transfert.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transfert } from './entities/transfert.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('pdfkit', () => {
  const mockDoc: any = {
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((event: string, cb: Function) => { if (event === 'finish') setTimeout(cb, 0); return mockDoc; }),
    fontSize: jest.fn().mockReturnThis(),
    font: jest.fn().mockReturnThis(),
    fillColor: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    moveTo: jest.fn().mockReturnThis(),
    lineTo: jest.fn().mockReturnThis(),
    strokeColor: jest.fn().mockReturnThis(),
    stroke: jest.fn().mockReturnThis(),
    rect: jest.fn().mockReturnThis(),
    fill: jest.fn().mockReturnThis(),
    image: jest.fn().mockReturnThis(),
    end: jest.fn(),
    page: { width: 595, height: 842 },
    lineCap: jest.fn().mockReturnThis(),
    roundedRect: jest.fn().mockReturnThis(),
    lineWidth: jest.fn().mockReturnThis(),
    bufferedPageRange: jest.fn().mockReturnValue({ count: 1 }),
    switchToPage: jest.fn(),
  };
  return jest.fn(() => mockDoc);
});

const mockTransfert = {
  id: 1, state: 'Envoyé', type: 'Repair', frombranch: 1, tobranch: 2,
  sendUser: 1, receiveUser: null, sendingDate: new Date(), receivedDate: null,
  delivredBy: 'Deliverer', remark: 'Remark', previousStep: 'On affectation',
  stockPart: [], repair: [],
};
const mockStockPart = {
  id: 1, serialNumber: 'SN001', remark: 'OK', bin: { id: 1, name: 'Bin 1' },
  reference: { id: 1, materialCode: 'MC001', allpart: { id: 1, description: 'Test' }, model: { name: 'Model' } },
};
const mockRepair = {
  id: 1, actuellybranch: 1, historyRepair: [{ id: 1, step: 'On affectation', date: new Date() }],
  customer: { id: 1, name: 'Client', phone: 123 },
  device: { id: 1, serialenumber: 'SN', model: { id: 1, name: 'Model', brand: { id: 1, name: 'Brand' } } },
};
const mockUser = { id: 1, name: 'User' };
const mockBranch = {
  id: 1, name: 'Branch', location: 'Loc', phone: '123', email: 'a@b.com',
  company: { id: 1, name: 'BEST', headquarterslocation: 'Tunis', taxRegisterNumber: '123', rib: '123', bank: 'BT', logo: null },
};

function createMockQb() {
  return {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockTransfert]),
    getOne: jest.fn().mockResolvedValue(mockTransfert),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
  };
}

function createMockRepos() {
  const tQb = createMockQb();
  const sQb = createMockQb();
  const rQb = createMockQb();
  return {
    transfert: {
      create: jest.fn().mockReturnValue(mockTransfert),
      save: jest.fn().mockResolvedValue(mockTransfert),
      find: jest.fn().mockResolvedValue([mockTransfert]),
      findOne: jest.fn().mockResolvedValue(mockTransfert),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn().mockReturnValue(tQb),
    },
    stockPart: {
      find: jest.fn().mockResolvedValue([mockStockPart]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn().mockReturnValue(sQb),
    },
    repair: {
      find: jest.fn().mockResolvedValue([mockRepair]),
      findOne: jest.fn().mockResolvedValue(mockRepair),
      save: jest.fn().mockResolvedValue(mockRepair),
      createQueryBuilder: jest.fn().mockReturnValue(rQb),
    },
    user: {
      findOne: jest.fn().mockResolvedValue(mockUser),
    },
    branch: {
      findOne: jest.fn().mockResolvedValue(mockBranch),
    },
    historyRepair: {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockResolvedValue({}),
    },
    tracability: {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockResolvedValue({}),
    },
  };
}

describe('TransfertService', () => {
  let service: TransfertService;
  let repos: ReturnType<typeof createMockRepos>;

  beforeEach(async () => {
    repos = createMockRepos();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfertService,
        { provide: getRepositoryToken(Transfert), useValue: repos.transfert },
        { provide: getRepositoryToken(StockPart), useValue: repos.stockPart },
        { provide: getRepositoryToken(Repair), useValue: repos.repair },
        { provide: getRepositoryToken(User), useValue: repos.user },
        { provide: getRepositoryToken(Branch), useValue: repos.branch },
        { provide: getRepositoryToken(HistoryRepair), useValue: repos.historyRepair },
        { provide: getRepositoryToken(Tracability), useValue: repos.tracability },
      ],
    }).compile();
    service = module.get<TransfertService>(TransfertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transfert with repairs when valid step', async () => {
      const dto = { repairIds: [1], sendUser: 1, frombranch: 1, tobranch: 2 } as any;
      const result = await service.create(dto);
      expect(result).toEqual(mockTransfert);
      expect(repos.repair.find).toHaveBeenCalled();
      expect(repos.repair.createQueryBuilder).toHaveBeenCalled();
      expect(repos.historyRepair.create).toHaveBeenCalled();
      expect(repos.tracability.create).toHaveBeenCalled();
    });

    it('should throw if repair step is invalid', async () => {
      const badRepair = { ...mockRepair, historyRepair: [{ id: 2, step: 'Terminé', date: new Date() }] };
      jest.spyOn(repos.repair, 'find').mockResolvedValue([badRepair]);
      const dto = { repairIds: [1], sendUser: 1 } as any;
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should create a transfert with stockParts when no repairs', async () => {
      jest.spyOn(repos.repair, 'find').mockResolvedValue([]);
      const dto = { stockPartIds: [1], sendUser: 1, frombranch: 1, tobranch: 2 } as any;
      const result = await service.create(dto);
      expect(result).toEqual(mockTransfert);
      expect(repos.stockPart.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw if no data found for transfert', async () => {
      jest.spyOn(repos.stockPart, 'find').mockResolvedValue([]);
      jest.spyOn(repos.repair, 'find').mockResolvedValue([]);
      const dto = { stockPartIds: [99], repairIds: [99] } as any;
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all transferts', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTransfert]);
    });
  });

  describe('findOne', () => {
    it('should return a transfert', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTransfert);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a transfert with repairs', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue({ ...mockTransfert, repair: [mockRepair], stockPart: [] } as any);
      const dto = { repairIds: [1], actuellybranch: 2 } as any;
      const result = await service.update(1, dto);
      expect(result).toEqual(mockTransfert);
      expect(repos.transfert.save).toHaveBeenCalled();
    });

    it('should update a transfert with stockParts', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue({ ...mockTransfert, repair: [], stockPart: [mockStockPart] } as any);
      const dto = { stockPartIds: [1], bin: '1' } as any;
      const result = await service.update(1, dto);
      expect(result).toEqual(mockTransfert);
    });

    it('should throw if no data found for update', async () => {
      jest.spyOn(repos.stockPart, 'find').mockResolvedValue([]);
      jest.spyOn(repos.repair, 'find').mockResolvedValue([]);
      await expect(service.update(1, { stockPartIds: [99] } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw if transfert not found', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { stockPartIds: [1] } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a transfert', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockTransfert);
      expect(repos.transfert.delete).toHaveBeenCalled();
    });

    it('should throw if not found', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findRepairTransfersByBranch', () => {
    it('should return repair transfers by branch', async () => {
      const result = await service.findRepairTransfersByBranch(1);
      expect(result).toEqual([mockTransfert]);
      expect(repos.transfert.find).toHaveBeenCalled();
    });
  });

  describe('acceptRepairTransfer', () => {
    it('should accept a repair transfer', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue({ ...mockTransfert, repair: [mockRepair] } as any);
      repos.transfert.save.mockImplementation((x: any) => Promise.resolve({ ...x, state: 'Reçu', receiveUser: 2 }));
      const result = await service.acceptRepairTransfer(1, 2);
      expect(result.state).toBe('Reçu');
      expect(result.receiveUser).toBe(2);
      expect(repos.repair.save).toHaveBeenCalled();
      expect(repos.historyRepair.create).toHaveBeenCalled();
    });

    it('should throw if transfert not found', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue(null);
      await expect(service.acceptRepairTransfer(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if no tobranch', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue({ ...mockTransfert, tobranch: undefined } as any);
      await expect(service.acceptRepairTransfer(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refuseRepairTransfer', () => {
    it('should refuse a repair transfer', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue({ ...mockTransfert, repair: [mockRepair] } as any);
      repos.transfert.save.mockImplementation((x: any) => Promise.resolve({ ...x, state: 'Refusé' }));
      const result = await service.refuseRepairTransfer(1, 2);
      expect(result.state).toBe('Refusé');
      expect(repos.repair.save).toHaveBeenCalled();
    });

    it('should throw if transfert not found', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue(null);
      await expect(service.refuseRepairTransfer(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelRepairTransfer', () => {
    it('should cancel a repair transfer', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue({ ...mockTransfert, repair: [mockRepair] } as any);
      repos.transfert.save.mockImplementation((x: any) => Promise.resolve({ ...x, state: 'Annulé' }));
      const result = await service.cancelRepairTransfer(1, 2);
      expect(result.state).toBe('Annulé');
      expect(repos.repair.save).toHaveBeenCalled();
    });

    it('should throw if transfert not found', async () => {
      jest.spyOn(repos.transfert, 'findOne').mockResolvedValue(null);
      await expect(service.cancelRepairTransfer(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByState', () => {
    it('should return transferts by state', async () => {
      const result = await service.findByState('Envoyé');
      expect(result).toEqual([mockTransfert]);
    });

    it('should throw if none found', async () => {
      const qb = repos.transfert.createQueryBuilder();
      jest.spyOn(qb, 'getMany').mockResolvedValue([]);
      await expect(service.findByState('Inconnu')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFromBranch', () => {
    it('should return transferts from branch with enriched data', async () => {
      const result = await service.getFromBranch(1, 'Stock');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('sendUserName');
      expect(result[0]).toHaveProperty('fromBranchName');
      expect(repos.user.findOne).toHaveBeenCalled();
      expect(repos.branch.findOne).toHaveBeenCalled();
    });

    it('should throw if no data', async () => {
      const qb = repos.transfert.createQueryBuilder();
      jest.spyOn(qb, 'getMany').mockResolvedValue([]);
      await expect(service.getFromBranch(1, 'Stock')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getToBranch', () => {
    it('should return transferts to branch with enriched data', async () => {
      const result = await service.getToBranch(2, 'Stock', 'Envoyé');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('sendUserName');
      expect(repos.user.findOne).toHaveBeenCalled();
    });

    it('should throw if no data', async () => {
      const qb = repos.transfert.createQueryBuilder();
      jest.spyOn(qb, 'getMany').mockResolvedValue([]);
      await expect(service.getToBranch(2, 'Stock', 'Envoyé')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOneWithDetails', () => {
    it('should return transfert with full details', async () => {
      jest.spyOn(repos.transfert, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          ...mockTransfert,
          stockPart: [mockStockPart],
          repair: [mockRepair],
        }),
      } as any);
      const result = await service.getOneWithDetails(1);
      expect(result).toHaveProperty('transfertId', 1);
      expect(result).toHaveProperty('sendUserName');
      expect(result).toHaveProperty('fromBranchName');
      expect(result).toHaveProperty('stockPart');
      expect(result).toHaveProperty('repair');
    });

    it('should throw if not found', async () => {
      jest.spyOn(repos.transfert, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.getOneWithDetails(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generatePdf', () => {
    it('should generate PDF for a transfert', async () => {
      jest.spyOn(service, 'getOneWithDetails').mockResolvedValue({
        transfertId: 1, state: 'Envoyé', type: 'Repair',
        sendUserName: 'User', fromBranchName: 'Branch', toBranchName: 'Branch2',
        repair: [{ id: 1, customerName: 'Client', customerPhone: 123, brand: 'Brand', model: 'Model', serial: 'SN' }],
        stockPart: [],
        companyName: 'BEST',
      });
      const res = { setHeader: jest.fn(), pipe: jest.fn(), on: jest.fn() };
      await expect(service.generatePdf(1, res)).resolves.toBeUndefined();
    });

    it('should reject if getOneWithDetails throws', async () => {
      jest.spyOn(service, 'getOneWithDetails').mockRejectedValue(new NotFoundException('Not found'));
      const res = { setHeader: jest.fn(), pipe: jest.fn(), on: jest.fn() };
      await expect(service.generatePdf(999, res)).rejects.toThrow(NotFoundException);
    });
  });
});
