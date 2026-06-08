import { Test, TestingModule } from '@nestjs/testing';
import { DistributeurController } from './distributeur.controller';
import { DistributeurService } from './distributeur.service';

const mockDistributeur = { id: 1, name: 'Distrib A', phone: 123456, email: 'a@a.com', location: 'Tunis', taxRegisterNumber: 'TN123' };

describe('DistributeurController', () => {
  let controller: DistributeurController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributeurController],
      providers: [
        {
          provide: DistributeurService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDistributeur),
            findAll: jest.fn().mockResolvedValue([mockDistributeur]),
            findOne: jest.fn().mockResolvedValue(mockDistributeur),
            update: jest.fn().mockResolvedValue(mockDistributeur),
            remove: jest.fn().mockResolvedValue(mockDistributeur),
          },
        },
      ],
    }).compile();

    controller = module.get<DistributeurController>(DistributeurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /distributeur', () => {
    it('should create a distributeur', async () => {
      const res = mockRes();
      await controller.create({ name: 'Distrib A' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /distributeur', () => {
    it('should return all distributeurs', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /distributeur/:id', () => {
    it('should return one distributeur', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /distributeur/:id', () => {
    it('should update a distributeur', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /distributeur/:id', () => {
    it('should delete a distributeur', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
