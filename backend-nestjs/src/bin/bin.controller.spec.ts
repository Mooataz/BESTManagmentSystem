import { Test, TestingModule } from '@nestjs/testing';
import { BinController } from './bin.controller';
import { BinService } from './bin.service';

const mockBin = { id: 1, name: 'Bin A', type: 'Storage' };

describe('BinController', () => {
  let controller: BinController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinController],
      providers: [
        {
          provide: BinService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBin),
            findAll: jest.fn().mockResolvedValue([mockBin]),
            findOne: jest.fn().mockResolvedValue(mockBin),
            update: jest.fn().mockResolvedValue(mockBin),
            remove: jest.fn().mockResolvedValue(mockBin),
            findByBranchId: jest.fn().mockResolvedValue([mockBin]),
            findByName: jest.fn().mockResolvedValue(mockBin),
            findByBranchIdAndType: jest.fn().mockResolvedValue([mockBin]),
          },
        },
      ],
    }).compile();

    controller = module.get<BinController>(BinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /bin', () => {
    it('should create a bin', async () => {
      const res = mockRes();
      await controller.create({ name: 'Bin A', type: 'Storage', branch: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /bin', () => {
    it('should return all bins', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /bin/:id', () => {
    it('should return one bin', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /bin/find/:branchId', () => {
    it('should return bins by branch', async () => {
      const res = mockRes();
      await controller.getByBranchId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /bin/findName/:name', () => {
    it('should return a bin by name', async () => {
      const res = mockRes();
      await controller.getByName('Bin A', res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /bin/find/:branchId/:type', () => {
    it('should return bins by branch and type', async () => {
      const res = mockRes();
      await controller.getByBranchIdAndType(1, 'Storage', res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /bin/:id', () => {
    it('should update a bin', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /bin/:id', () => {
    it('should delete a bin', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
