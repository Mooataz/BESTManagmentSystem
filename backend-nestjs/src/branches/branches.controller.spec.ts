import { Test, TestingModule } from '@nestjs/testing';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';

const mockBranch = { id: 1, name: 'Branch 1', location: 'Tunis' };

describe('BranchesController', () => {
  let controller: BranchesController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchesController],
      providers: [
        {
          provide: BranchesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBranch),
            findAll: jest.fn().mockResolvedValue([mockBranch]),
            findOne: jest.fn().mockResolvedValue(mockBranch),
            update: jest.fn().mockResolvedValue(mockBranch),
            remove: jest.fn().mockResolvedValue(mockBranch),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchesController>(BranchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /branches', () => {
    it('should create a branch', async () => {
      const res = mockRes();
      await controller.create({ name: 'Branch 1', location: 'Tunis' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /branches', () => {
    it('should return all branches', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /branches/:id', () => {
    it('should return one branch', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /branches/:id', () => {
    it('should update a branch', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /branches/:id', () => {
    it('should delete a branch', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
