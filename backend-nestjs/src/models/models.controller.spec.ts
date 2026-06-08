import { Test, TestingModule } from '@nestjs/testing';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

const mockModel = { id: 1, name: 'Model 1' };

describe('ModelsController', () => {
  let controller: ModelsController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelsController],
      providers: [
        {
          provide: ModelsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockModel),
            findAll: jest.fn().mockResolvedValue([mockModel]),
            findOne: jest.fn().mockResolvedValue(mockModel),
            update: jest.fn().mockResolvedValue(mockModel),
            remove: jest.fn().mockResolvedValue(mockModel),
            findByBrandId: jest.fn().mockResolvedValue([mockModel]),
            findByTypeModelId: jest.fn().mockResolvedValue([mockModel]),
            findByBrandAuthorised: jest.fn().mockResolvedValue([mockModel]),
          },
        },
      ],
    }).compile();

    controller = module.get<ModelsController>(ModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /models', () => {
    it('should create a model', async () => {
      const res = mockRes();
      await controller.create({ name: 'Model 1' } as any, res, { filename: 'pic.jpg' } as any);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 201, data: mockModel }));
    });
  });

  describe('GET /models', () => {
    it('should return all models', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: [mockModel] }));
    });
  });

  describe('GET /models/findByBrand/:brandId', () => {
    it('should return models by brand', async () => {
      const res = mockRes();
      await controller.getByBrand(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: [mockModel] }));
    });
  });

  describe('GET /models/findByBrand/:typeModelId', () => {
    it('should return models by typeModel', async () => {
      const res = mockRes();
      await controller.getByTypeModelId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: [mockModel] }));
    });
  });

  describe('GET /models/findByBrandAuthorised', () => {
    it('should return authorised models', async () => {
      const res = mockRes();
      await controller.findByBrandAuthorised(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: [mockModel] }));
    });
  });

  describe('GET /models/:id', () => {
    it('should return one model', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: mockModel }));
    });
  });

  describe('PATCH /models/:id', () => {
    it('should update a model', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res, null as any);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: mockModel }));
    });
  });

  describe('DELETE /models/:id', () => {
    it('should delete a model', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: mockModel }));
    });
  });
});
