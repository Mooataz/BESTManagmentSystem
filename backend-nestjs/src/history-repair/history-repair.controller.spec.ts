import { Test, TestingModule } from '@nestjs/testing';
import { HistoryRepairController } from './history-repair.controller';
import { HistoryRepairService } from './history-repair.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockHistoryRepair = { id: 1, date: new Date(), step: 'test', repair: { id: 1 } };

describe('HistoryRepairController', () => {
  let controller: HistoryRepairController;
  let module: TestingModule;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [HistoryRepairController],
      providers: [
        {
          provide: HistoryRepairService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockHistoryRepair),
            findAll: jest.fn().mockResolvedValue([mockHistoryRepair]),
            findOne: jest.fn().mockResolvedValue(mockHistoryRepair),
            update: jest.fn().mockResolvedValue(mockHistoryRepair),
            remove: jest.fn().mockResolvedValue(mockHistoryRepair),
            findByRepairId: jest.fn().mockResolvedValue([mockHistoryRepair]),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<HistoryRepairController>(HistoryRepairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /history-repair', () => {
    it('should create a history repair', async () => {
      const res = mockRes();
      await controller.create({ step: 'test', repair: 1 } as any, { user: { id: 1 } } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle error on create', async () => {
      const svc = module.get(HistoryRepairService);
      jest.spyOn(svc, 'create').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.create({} as any, {} as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /history-repair/find/:repairId', () => {
    it('should return history repairs by repair id', async () => {
      const res = mockRes();
      await controller.getByRepairId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on getByRepairId', async () => {
      const svc = module.get(HistoryRepairService);
      jest.spyOn(svc, 'findByRepairId').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.getByRepairId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /history-repair', () => {
    it('should return all history repairs', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findAll', async () => {
      const svc = module.get(HistoryRepairService);
      jest.spyOn(svc, 'findAll').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /history-repair/:id', () => {
    it('should return one history repair', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findOne', async () => {
      const svc = module.get(HistoryRepairService);
      jest.spyOn(svc, 'findOne').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findOne(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('PATCH /history-repair/:id', () => {
    it('should update a history repair', async () => {
      const res = mockRes();
      await controller.update(1, { step: 'updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on update', async () => {
      const svc = module.get(HistoryRepairService);
      jest.spyOn(svc, 'update').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.update(999, {} as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('DELETE /history-repair/:id', () => {
    it('should delete a history repair', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on remove', async () => {
      const svc = module.get(HistoryRepairService);
      jest.spyOn(svc, 'remove').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.remove(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
