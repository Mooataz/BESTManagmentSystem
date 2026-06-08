import { Test, TestingModule } from '@nestjs/testing';
import { OutputListController } from './output-list.controller';
import { OutputListService } from './output-list.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockOutputList = { id: 1, date: new Date(), remark: 'test' };

describe('OutputListController', () => {
  let controller: OutputListController;
  let module: TestingModule;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [OutputListController],
      providers: [
        {
          provide: OutputListService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockOutputList),
            findAll: jest.fn().mockResolvedValue([mockOutputList]),
            findOne: jest.fn().mockResolvedValue(mockOutputList),
            findByBranchId: jest.fn().mockResolvedValue([mockOutputList]),
            findByCustomerId: jest.fn().mockResolvedValue([mockOutputList]),
            remove: jest.fn().mockResolvedValue(mockOutputList),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<OutputListController>(OutputListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /output-list', () => {
    it('should create an output list', async () => {
      const res = mockRes();
      await controller.create({ repairIds: [1], customer: 1, user: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle error on create', async () => {
      const svc = module.get(OutputListService);
      jest.spyOn(svc, 'create').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.create({} as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /output-list', () => {
    it('should return all output lists', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findAll', async () => {
      const svc = module.get(OutputListService);
      jest.spyOn(svc, 'findAll').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /output-list/findByBranch/:branchId', () => {
    it('should return output lists by branch', async () => {
      const res = mockRes();
      await controller.getByBranchId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findByBranchId', async () => {
      const svc = module.get(OutputListService);
      jest.spyOn(svc, 'findByBranchId').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.getByBranchId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /output-list/findByCustomer/:customerId', () => {
    it('should return output lists by customer', async () => {
      const res = mockRes();
      await controller.getByCustomerId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findByCustomerId', async () => {
      const svc = module.get(OutputListService);
      jest.spyOn(svc, 'findByCustomerId').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.getByCustomerId(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /output-list/:id', () => {
    it('should return one output list', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on findOne', async () => {
      const svc = module.get(OutputListService);
      jest.spyOn(svc, 'findOne').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.findOne(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('DELETE /output-list/:id', () => {
    it('should delete an output list', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error on remove', async () => {
      const svc = module.get(OutputListService);
      jest.spyOn(svc, 'remove').mockRejectedValue(new (require('@nestjs/common').NotFoundException)('fail'));
      const res = mockRes();
      await controller.remove(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
