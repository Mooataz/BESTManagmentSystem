import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { BadRequestException } from '@nestjs/common';

const mockSale = { id: 1, state: 'En attente', totalPrice: 100 };
const mockSales = [mockSale];
const mockAccessories = [{ id: 1, description: 'Chargeur' }];
const mockStockParts = [{ id: 1, serialNumber: 'SN001' }];

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
}

describe('SalesController', () => {
  let controller: SalesController;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockSale),
    findAll: jest.fn().mockResolvedValue(mockSales),
    findOne: jest.fn().mockResolvedValue(mockSale),
    findByBranchId: jest.fn().mockResolvedValue(mockSales),
    findByUserId: jest.fn().mockResolvedValue(mockSales),
    findByState: jest.fn().mockResolvedValue(mockSales),
    update: jest.fn().mockResolvedValue(mockSale),
    remove: jest.fn().mockResolvedValue(mockSale),
    getAccessories: jest.fn().mockResolvedValue(mockAccessories),
    findForSale: jest.fn().mockResolvedValue(mockStockParts),
    batchChangeBin: jest.fn().mockResolvedValue({ updated: 2 }),
    generatePdf: jest.fn().mockResolvedValue(undefined),
    validate: jest.fn().mockResolvedValue({ ...mockSale, state: 'Validé' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [{ provide: SalesService, useValue: mockService }],
    }).compile();
    controller = module.get<SalesController>(SalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /sales', () => {
    it('should create a sale', async () => {
      const res = mockRes();
      await controller.create({ state: 'En attente' } as any, res);
      expect(mockService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Created Successfuly !',
        status: 201,
        data: mockSale,
      });
    });

    it('should handle HttpException from service', async () => {
      mockService.create.mockRejectedValueOnce(new BadRequestException('Bad request'));
      const res = mockRes();
      await controller.create({} as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bad request', status: 400, data: null });
    });
  });

  describe('GET /sales/findByBranch/:branchId', () => {
    it('should return sales by branch', async () => {
      const res = mockRes();
      await controller.getByBranchId(1, res);
      expect(mockService.findByBranchId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Founded Successfuly !', status: 200, data: mockSales });
    });
  });

  describe('GET /sales/findByUser/:userId', () => {
    it('should return sales by user', async () => {
      const res = mockRes();
      await controller.getByUserId(1, res);
      expect(mockService.findByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /sales/findByState/:state', () => {
    it('should return sales by state', async () => {
      const res = mockRes();
      await controller.getByState('En attente', res);
      expect(mockService.findByState).toHaveBeenCalledWith('En attente');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /sales', () => {
    it('should return all sales', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(mockService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Founded Successfuly !', status: 200, data: mockSales });
    });
  });

  describe('GET /sales/accessories', () => {
    it('should return accessories', async () => {
      const res = mockRes();
      await controller.getAccessories(res);
      expect(mockService.getAccessories).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Accessories found', status: 200, data: mockAccessories });
    });
  });

  describe('GET /sales/stock-parts/:saleId/:branchId', () => {
    it('should return stock parts for sale', async () => {
      const res = mockRes();
      await controller.findStockPartsForSale(1, 1, res);
      expect(mockService.findForSale).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Stock parts found', status: 200, data: mockStockParts });
    });
  });

  describe('PATCH /sales/stock-parts/batch-change-bin', () => {
    it('should batch change bin', async () => {
      const res = mockRes();
      const body = { stockPartIds: [1, 2], binId: 1, userId: 1, saleId: 1 };
      await controller.batchChangeBin(body, res);
      expect(mockService.batchChangeBin).toHaveBeenCalledWith([1, 2], 1, 1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Stock parts updated successfully', status: 200, data: { updated: 2 } });
    });
  });

  describe('GET /sales/pdf/:id', () => {
    it('should generate PDF', async () => {
      const res = mockRes();
      await controller.generatePdf(1, res);
      expect(mockService.generatePdf).toHaveBeenCalledWith(1, res);
    });

    it('should handle HttpException from PDF generation', async () => {
      mockService.generatePdf.mockRejectedValueOnce(new BadRequestException('Bad request'));
      const res = mockRes();
      await controller.generatePdf(1, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bad request', status: 400, data: null });
    });
  });

  describe('GET /sales/:id', () => {
    it('should return one sale', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Founded Successfuly !', status: 200, data: mockSale });
    });
  });

  describe('PATCH /sales/validate/:id', () => {
    it('should validate a sale', async () => {
      const res = mockRes();
      await controller.validate(1, 1, res);
      expect(mockService.validate).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vente validée avec succès', status: 200, data: { ...mockSale, state: 'Validé' } });
    });
  });

  describe('PATCH /sales/:id', () => {
    it('should update a sale', async () => {
      const res = mockRes();
      await controller.update('1', { state: 'Confirmé' } as any, res);
      expect(mockService.update).toHaveBeenCalledWith(1, { state: 'Confirmé' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Updated Successfuly !', status: 200, data: mockSale });
    });
  });

  describe('DELETE /sales/:id', () => {
    it('should delete a sale', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(mockService.remove).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deleted Successfuly !', status: 200, data: mockSale });
    });
  });
});
