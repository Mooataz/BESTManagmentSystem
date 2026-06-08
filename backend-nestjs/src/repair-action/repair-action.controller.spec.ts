import { Test, TestingModule } from '@nestjs/testing';
import { RepairActionController } from './repair-action.controller';
import { RepairActionService } from './repair-action.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockRepairAction = { id: 1, name: 'Test Action' };

describe('RepairActionController', () => {
  let controller: RepairActionController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairActionController],
      providers: [
        {
          provide: RepairActionService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRepairAction),
            findAll: jest.fn().mockResolvedValue([mockRepairAction]),
            findOne: jest.fn().mockResolvedValue(mockRepairAction),
            update: jest.fn().mockResolvedValue(mockRepairAction),
            remove: jest.fn().mockResolvedValue(mockRepairAction),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<RepairActionController>(RepairActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /repair-action', () => {
    it('should create a repair action', async () => {
      const res = mockRes();
      await controller.create({ name: 'Test Action' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 201,
        data: mockRepairAction,
      });
    });
  });

  describe('GET /repair-action', () => {
    it('should return all repair actions', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: [mockRepairAction],
      });
    });
  });

  describe('GET /repair-action/:id', () => {
    it('should return one repair action', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockRepairAction,
      });
    });
  });

  describe('PATCH /repair-action/:id', () => {
    it('should update a repair action', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockRepairAction,
      });
    });
  });

  describe('DELETE /repair-action/:id', () => {
    it('should delete a repair action', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockRepairAction,
      });
    });
  });
});
