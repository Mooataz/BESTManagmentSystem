import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

const mockBrand = { id: 1, name: 'Samsung', status: 'Autoriser', logo: 'logo.png' };

describe('BrandsController', () => {
  let controller: BrandsController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBrand),
            findAll: jest.fn().mockResolvedValue([mockBrand]),
            findOne: jest.fn().mockResolvedValue(mockBrand),
            update: jest.fn().mockResolvedValue(mockBrand),
            remove: jest.fn().mockResolvedValue(mockBrand),
            findByStatus: jest.fn().mockResolvedValue([mockBrand]),
          },
        },
      ],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /brands', () => {
    it('should create a brand', async () => {
      const res = mockRes();
      await controller.create({ name: 'Samsung' } as any, res, { filename: 'logo.png' } as any);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /brands/findAutoriser', () => {
    it('should return authorized brands', async () => {
      const res = mockRes();
      await controller.getAutoriser(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /brands', () => {
    it('should return all brands', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /brands/:id', () => {
    it('should return one brand', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /brands/:id', () => {
    it('should update a brand', async () => {
      const res = mockRes();
      const logo = { filename: 'new-logo.png' } as Express.Multer.File;
      await controller.update(1, { name: 'Updated' } as any, res, logo);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /brands/:id', () => {
    it('should delete a brand', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
