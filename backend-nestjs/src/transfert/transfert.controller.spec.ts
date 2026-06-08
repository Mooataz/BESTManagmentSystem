import { Test, TestingModule } from '@nestjs/testing';
import { TransfertController } from './transfert.controller';
import { TransfertService } from './transfert.service';
import { BadRequestException } from '@nestjs/common';

const mockTransfert = {
  id: 1, state: 'Envoyé', type: 'Repair', frombranch: 1, tobranch: 2,
  sendUser: 1, sendingDate: new Date(),
};
const mockTransferts = [mockTransfert];
const mockEnriched = [{ transfertId: 1, sendUserName: 'User', fromBranchName: 'Branch' }];

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.end = jest.fn();
  return res;
}

describe('TransfertController', () => {
  let controller: TransfertController;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockTransfert),
    findAll: jest.fn().mockResolvedValue(mockTransferts),
    findOne: jest.fn().mockResolvedValue(mockTransfert),
    update: jest.fn().mockResolvedValue(mockTransfert),
    remove: jest.fn().mockResolvedValue(mockTransfert),
    findByState: jest.fn().mockResolvedValue(mockTransferts),
    getFromBranch: jest.fn().mockResolvedValue(mockEnriched),
    getToBranch: jest.fn().mockResolvedValue(mockEnriched),
    findRepairTransfersByBranch: jest.fn().mockResolvedValue(mockTransferts),
    acceptRepairTransfer: jest.fn().mockResolvedValue({ ...mockTransfert, state: 'Reçu' }),
    refuseRepairTransfer: jest.fn().mockResolvedValue({ ...mockTransfert, state: 'Refusé' }),
    cancelRepairTransfer: jest.fn().mockResolvedValue({ ...mockTransfert, state: 'Annulé' }),
    getOneWithDetails: jest.fn().mockResolvedValue(mockEnriched[0]),
    generatePdf: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfertController],
      providers: [{ provide: TransfertService, useValue: mockService }],
    }).compile();
    controller = module.get<TransfertController>(TransfertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /transfert', () => {
    it('should create a transfert', async () => {
      const res = mockRes();
      await controller.create({ frombranch: 1, tobranch: 2 } as any, res);
      expect(mockService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Transfert created Successfuly !',
        status: 201,
        data: mockTransfert,
      });
    });

    it('should handle HttpException', async () => {
      mockService.create.mockRejectedValueOnce(new BadRequestException('Bad request'));
      const res = mockRes();
      await controller.create({} as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bad request', status: 400, data: null });
    });
  });

  describe('GET /transfert/findByState/:state', () => {
    it('should return transferts by state', async () => {
      const res = mockRes();
      await controller.getByState('Envoyé', res);
      expect(mockService.findByState).toHaveBeenCalledWith('Envoyé');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Founded Successfuly !', status: 200, data: mockTransferts });
    });
  });

  describe('GET /transfert/findFromBranchId/:branchId/:type', () => {
    it('should return transferts from branch', async () => {
      const res = mockRes();
      await controller.getFromBranchId(1, 'Stock', res);
      expect(mockService.getFromBranch).toHaveBeenCalledWith(1, 'Stock');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Founded Successfuly !', status: 200, data: mockEnriched });
    });
  });

  describe('GET /transfert/pdf/:id', () => {
    it('should generate PDF and set headers', async () => {
      const res = mockRes();
      await controller.getPdf(1, res);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="transfert_1.pdf"');
      expect(mockService.generatePdf).toHaveBeenCalledWith(1, res);
    });

    it('should handle error during PDF generation', async () => {
      mockService.generatePdf.mockRejectedValueOnce(new Error('Fail'));
      const res = mockRes();
      res.headersSent = false;
      await controller.getPdf(1, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('GET /transfert/findToBranchId/:branchId/:type/:state', () => {
    it('should return transferts to branch', async () => {
      const res = mockRes();
      await controller.getByBranchId(2, 'Stock', 'Envoyé', res);
      expect(mockService.getToBranch).toHaveBeenCalledWith(2, 'Stock', 'Envoyé');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /transfert/repair/branch/:branchId', () => {
    it('should return repair transfers by branch', async () => {
      const res = mockRes();
      await controller.findRepairTransfersByBranch(1, res);
      expect(mockService.findRepairTransfersByBranch).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Transferts trouvés', status: 200, data: mockTransferts });
    });
  });

  describe('PATCH /transfert/repair/:id/accept', () => {
    it('should accept a repair transfer', async () => {
      const res = mockRes();
      await controller.acceptRepairTransfer(1, 2, res);
      expect(mockService.acceptRepairTransfer).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Transfert accepté', status: 200, data: { ...mockTransfert, state: 'Reçu' } });
    });
  });

  describe('PATCH /transfert/repair/:id/refuse', () => {
    it('should refuse a repair transfer', async () => {
      const res = mockRes();
      await controller.refuseRepairTransfer(1, 2, res);
      expect(mockService.refuseRepairTransfer).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Transfert refusé', status: 200, data: { ...mockTransfert, state: 'Refusé' } });
    });
  });

  describe('PATCH /transfert/repair/:id/cancel', () => {
    it('should cancel a repair transfer', async () => {
      const res = mockRes();
      await controller.cancelRepairTransfer(1, 2, res);
      expect(mockService.cancelRepairTransfer).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Transfert annulé', status: 200, data: { ...mockTransfert, state: 'Annulé' } });
    });
  });

  describe('GET /transfert', () => {
    it('should return all transferts', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(mockService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'All transfert found successfuly !', status: 200, data: mockTransferts });
    });
  });

  describe('GET /transfert/:id', () => {
    it('should return one transfert', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'One transfert found successfuly !', status: 200, data: mockTransfert });
    });
  });

  describe('PATCH /transfert/:id', () => {
    it('should update a transfert', async () => {
      const res = mockRes();
      await controller.update(1, { state: 'Reçu' } as any, res);
      expect(mockService.update).toHaveBeenCalledWith(1, { state: 'Reçu' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Transfert updated successfuly !', status: 200, data: mockTransfert });
    });
  });

  describe('DELETE /transfert/:id', () => {
    it('should delete a transfert', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(mockService.remove).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Transfert deleted successfuly !', status: 200, data: mockTransfert });
    });
  });
});
