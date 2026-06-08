import { Test, TestingModule } from '@nestjs/testing';
import { OtherCostController } from './other-cost.controller';
import { OtherCostService } from './other-cost.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockOtherCost = { id: 1, name: 'Test Cost', price: 100, status: 'Active' };

describe('OtherCostController', () => {
  let controller: OtherCostController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherCostController],
      providers: [
        {
          provide: OtherCostService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockOtherCost),
            findAll: jest.fn().mockResolvedValue([mockOtherCost]),
            findOne: jest.fn().mockResolvedValue(mockOtherCost),
            update: jest.fn().mockResolvedValue(mockOtherCost),
            remove: jest.fn().mockResolvedValue(mockOtherCost),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OtherCostController>(OtherCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /other-cost', () => {
    it('should create an other cost', async () => {
      const res = mockRes();
      await controller.create({ name: 'Test Cost', price: 100 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 201,
        data: mockOtherCost,
      });
    });
  });

  describe('GET /other-cost', () => {
    it('should return all other costs', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: [mockOtherCost],
      });
    });
  });

  describe('GET /other-cost/:id', () => {
    it('should return one other cost', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockOtherCost,
      });
    });
  });

  describe('PATCH /other-cost/:id', () => {
    it('should update an other cost', async () => {
      const res = mockRes();
      await controller.update('1', { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockOtherCost,
      });
    });
  });

  describe('DELETE /other-cost/:id', () => {
    it('should delete an other cost', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockOtherCost,
      });
    });
  });
});
