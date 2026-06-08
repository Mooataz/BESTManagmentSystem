import { Test, TestingModule } from '@nestjs/testing';
import { ApproveStockController } from './approve-stock.controller';
import { ApproveStockService } from './approve-stock.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockApproveStock = { id: 1, type: 'Repair', state: 'Pending' };

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ApproveStockController', () => {
  let controller: ApproveStockController;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockApproveStock),
    findAll: jest.fn().mockResolvedValue([mockApproveStock]),
    findOne: jest.fn().mockResolvedValue(mockApproveStock),
    update: jest.fn().mockResolvedValue(mockApproveStock),
    remove: jest.fn().mockResolvedValue(mockApproveStock),
    findByRepairId: jest.fn().mockResolvedValue([mockApproveStock]),
    findBySaleId: jest.fn().mockResolvedValue([mockApproveStock]),
    findByBranchId: jest.fn().mockResolvedValue([mockApproveStock]),
    findByBranchIdForSale: jest.fn().mockResolvedValue([mockApproveStock]),
    findByType: jest.fn().mockResolvedValue([mockApproveStock]),
    findByState: jest.fn().mockResolvedValue([mockApproveStock]),
    findAvailableParts: jest.fn().mockResolvedValue([{ id: 1 }]),
    confirmPart: jest.fn().mockResolvedValue({ ...mockApproveStock, state: 'Confirmer' }),
    updateState: jest.fn().mockResolvedValue({ ...mockApproveStock, state: 'Approved' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApproveStockController],
      providers: [
        { provide: ApproveStockService, useValue: mockService },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ApproveStockController>(ApproveStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /approve-stock', () => {
    it('should create and return 201 with JSON body', async () => {
      const res = mockRes();
      await controller.create({ type: 'Repair' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        status: 201,
        data: expect.anything(),
      }));
    });

    it('should handle service error and return error JSON', async () => {
      jest.spyOn(mockService, 'create').mockRejectedValueOnce(new HttpException('Error', 400));
      const res = mockRes();
      await controller.create({ type: 'Repair' } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: null }));
    });
  });

  describe('GET /approve-stock/findByRepair/:repairId', () => {
    it('should return approve stocks by repair', async () => {
      const res = mockRes();
      await controller.getByRepairId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        status: 200,
        data: [mockApproveStock],
      }));
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findByRepairId').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.getByRepairId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /approve-stock/findBySale/:saleId', () => {
    it('should return approve stocks by sale', async () => {
      const res = mockRes();
      await controller.getBySaleId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findBySaleId').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.getBySaleId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /approve-stock/findByBranchForSale/:branchId', () => {
    it('should return sale approvals by branch', async () => {
      const res = mockRes();
      await controller.getByBranchForSale(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findByBranchIdForSale').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.getByBranchForSale(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /approve-stock/findByBranch/:branchId', () => {
    it('should return approve stocks by branch', async () => {
      const res = mockRes();
      await controller.getByBranchId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findByBranchId').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.getByBranchId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /approve-stock/:id/available-parts', () => {
    it('should return available parts', async () => {
      const res = mockRes();
      await controller.getAvailableParts(1, 1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Available parts found',
        status: 200,
        data: expect.any(Array),
      }));
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findAvailableParts').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.getAvailableParts(1, 1, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('POST /approve-stock/:id/confirm-part', () => {
    it('should confirm part', async () => {
      const res = mockRes();
      await controller.confirmPart(1, 1, 2, 1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Part confirmed successfully',
        status: 200,
        data: expect.anything(),
      }));
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'confirmPart').mockRejectedValueOnce(new HttpException('Bad request', 400));
      const res = mockRes();
      await controller.confirmPart(1, 1, 2, 1, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('GET /approve-stock/findByType/:type', () => {
    it('should return by type', async () => {
      const res = mockRes();
      await controller.getByType('Repair', res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findByType').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.getByType('Unknown', res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /approve-stock/findByState/:state', () => {
    it('should return by state', async () => {
      const res = mockRes();
      await controller.getByState('Pending', res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findByState').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.getByState('Unknown', res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /approve-stock', () => {
    it('should find all', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findAll').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /approve-stock/:id', () => {
    it('should find one', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        status: 200,
        data: expect.anything(),
      }));
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findOne').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.findOne(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('PATCH /approve-stock/:id', () => {
    it('should update', async () => {
      const res = mockRes();
      await controller.update(1, { state: 'Approved' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'update').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.update(999, { state: 'Approved' } as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('PATCH /approve-stock/updateState/:id/:binDefectId', () => {
    it('should update state', async () => {
      const res = mockRes();
      await controller.updateStateApprove(1, 2, { state: 'Approved' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'updateState').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.updateStateApprove(999, 2, { state: 'Approved' } as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('DELETE /approve-stock/:id', () => {
    it('should remove', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'remove').mockRejectedValueOnce(new HttpException('Not found', 404));
      const res = mockRes();
      await controller.remove(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
