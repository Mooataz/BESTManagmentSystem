import { Test, TestingModule } from '@nestjs/testing';
import { RepairController } from './repair.controller';
import { RepairService } from './repair.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockRepair = { id: 1, description: 'Test repair', device: { id: 1 }, customer: { id: 1 } };

describe('RepairController', () => {
  let controller: RepairController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairController],
      providers: [
        {
          provide: RepairService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRepair),
            findAll: jest.fn().mockResolvedValue({ data: [mockRepair], total: 1 }),
            findOne: jest.fn().mockResolvedValue(mockRepair),
            update: jest.fn().mockResolvedValue(mockRepair),
            remove: jest.fn().mockResolvedValue(mockRepair),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<RepairController>(RepairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /repair', () => {
    it('should create a repair', async () => {
      const res = mockRes();
      await controller.create({ description: 'Test' } as any, { sub: 1 }, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /repair', () => {
    it('should return paginated repairs', async () => {
      const res = mockRes();
      await controller.findAll('1', '10', res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /repair/:id', () => {
    it('should return one repair', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /repair/:id', () => {
    it('should update a repair', async () => {
      const res = mockRes();
      await controller.update(1, { description: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /repair/:id', () => {
    it('should delete a repair', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
