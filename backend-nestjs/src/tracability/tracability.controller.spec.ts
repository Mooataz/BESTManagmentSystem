import { Test, TestingModule } from '@nestjs/testing';
import { TracabilityController } from './tracability.controller';
import { TracabilityService } from './tracability.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockTracability = { id: 1, user: { id: 1 }, historyRepair: { id: 1 } };

describe('TracabilityController', () => {
  let controller: TracabilityController;
  let module: TestingModule;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [TracabilityController],
      providers: [
        {
          provide: TracabilityService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTracability),
            findAll: jest.fn().mockResolvedValue([mockTracability]),
            findOne: jest.fn().mockResolvedValue(mockTracability),
            update: jest.fn().mockResolvedValue(mockTracability),
            remove: jest.fn().mockResolvedValue(mockTracability),
            findByHistoryRepairId: jest.fn().mockResolvedValue(mockTracability),
            findByHistoryStockPartId: jest.fn().mockResolvedValue(mockTracability),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<TracabilityController>(TracabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /tracability', () => {
    it('should create a tracability record', async () => {
      const res = mockRes();
      await controller.create({ user: 1, historyRepair: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle error on create', async () => {
      const svc = module.get(TracabilityService);
      jest.spyOn(svc, 'create').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.create({} as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /tracability', () => {
    it('should return all tracability records', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findAll', async () => {
      const svc = module.get(TracabilityService);
      jest.spyOn(svc, 'findAll').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /tracability/:id', () => {
    it('should return one tracability record', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findOne', async () => {
      const svc = module.get(TracabilityService);
      jest.spyOn(svc, 'findOne').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findOne(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('PATCH /tracability/:id', () => {
    it('should update a tracability record', async () => {
      const res = mockRes();
      await controller.update(1, { user: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on update', async () => {
      const svc = module.get(TracabilityService);
      jest.spyOn(svc, 'update').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.update(999, {} as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('DELETE /tracability/:id', () => {
    it('should delete a tracability record', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on remove', async () => {
      const svc = module.get(TracabilityService);
      jest.spyOn(svc, 'remove').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.remove(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /tracability/:historyRepairId', () => {
    it('should return tracability by historyRepair id', async () => {
      const res = mockRes();
      await controller.getByHistoryRepairId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on getByHistoryRepairId', async () => {
      const svc = module.get(TracabilityService);
      jest.spyOn(svc, 'findByHistoryRepairId').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.getByHistoryRepairId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /tracability/:historyStockPartId', () => {
    it('should return tracability by historyStockPart id', async () => {
      const res = mockRes();
      await controller.getByHistoryStockPartId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on getByHistoryStockPartId', async () => {
      const svc = module.get(TracabilityService);
      jest.spyOn(svc, 'findByHistoryStockPartId').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.getByHistoryStockPartId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
