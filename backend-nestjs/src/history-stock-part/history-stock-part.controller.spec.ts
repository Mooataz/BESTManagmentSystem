import { Test, TestingModule } from '@nestjs/testing';
import { HistoryStockPartController } from './history-stock-part.controller';
import { HistoryStockPartService } from './history-stock-part.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockHistoryStockPart = { id: 1, date: new Date(), step: 'test', stockPart: { id: 1 } };

describe('HistoryStockPartController', () => {
  let controller: HistoryStockPartController;
  let module: TestingModule;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [HistoryStockPartController],
      providers: [
        {
          provide: HistoryStockPartService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockHistoryStockPart),
            findAll: jest.fn().mockResolvedValue([mockHistoryStockPart]),
            findOne: jest.fn().mockResolvedValue(mockHistoryStockPart),
            update: jest.fn().mockResolvedValue(mockHistoryStockPart),
            remove: jest.fn().mockResolvedValue(mockHistoryStockPart),
            findByStockPartId: jest.fn().mockResolvedValue([mockHistoryStockPart]),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<HistoryStockPartController>(HistoryStockPartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /history-stock-part', () => {
    it('should create a history stock part', async () => {
      const res = mockRes();
      await controller.create({ step: 'test', stockPart: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle error on create', async () => {
      const svc = module.get(HistoryStockPartService);
      jest.spyOn(svc, 'create').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.create({} as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /history-stock-part/find/:stockPartId', () => {
    it('should return history stock parts by stock part id', async () => {
      const res = mockRes();
      await controller.getByStockPartId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on getByStockPartId', async () => {
      const svc = module.get(HistoryStockPartService);
      jest.spyOn(svc, 'findByStockPartId').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.getByStockPartId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /history-stock-part', () => {
    it('should return all history stock parts', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findAll', async () => {
      const svc = module.get(HistoryStockPartService);
      jest.spyOn(svc, 'findAll').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /history-stock-part/:id', () => {
    it('should return one history stock part', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findOne', async () => {
      const svc = module.get(HistoryStockPartService);
      jest.spyOn(svc, 'findOne').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findOne(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('PATCH /history-stock-part/:id', () => {
    it('should update a history stock part', async () => {
      const res = mockRes();
      await controller.update(1, { step: 'updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on update', async () => {
      const svc = module.get(HistoryStockPartService);
      jest.spyOn(svc, 'update').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.update(999, {} as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('DELETE /history-stock-part/:id', () => {
    it('should delete a history stock part', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on remove', async () => {
      const svc = module.get(HistoryStockPartService);
      jest.spyOn(svc, 'remove').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.remove(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
