import { Test, TestingModule } from '@nestjs/testing';
import { TypeModelController } from './type-model.controller';
import { TypeModelService } from './type-model.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockTypeModel = { id: 1, description: 'Test Type' };

describe('TypeModelController', () => {
  let controller: TypeModelController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeModelController],
      providers: [
        {
          provide: TypeModelService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTypeModel),
            findAll: jest.fn().mockResolvedValue([mockTypeModel]),
            findOne: jest.fn().mockResolvedValue(mockTypeModel),
            update: jest.fn().mockResolvedValue(mockTypeModel),
            remove: jest.fn().mockResolvedValue(mockTypeModel),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TypeModelController>(TypeModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /type-model', () => {
    it('should create a type model', async () => {
      const res = mockRes();
      await controller.create({ description: 'Test Type' } as any, res, {} as any);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 201,
        data: mockTypeModel,
      });
    });
  });

  describe('GET /type-model', () => {
    it('should return all type models', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: [mockTypeModel],
      });
    });
  });

  describe('GET /type-model/:id', () => {
    it('should return one type model', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockTypeModel,
      });
    });
  });

  describe('PATCH /type-model/:id', () => {
    it('should update a type model', async () => {
      const res = mockRes();
      await controller.update(1, { description: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockTypeModel,
      });
    });
  });

  describe('DELETE /type-model/:id', () => {
    it('should delete a type model', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockTypeModel,
      });
    });
  });
});
