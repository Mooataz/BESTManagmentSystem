import { Test, TestingModule } from '@nestjs/testing';
import { AccessoryController } from './accessory.controller';
import { AccessoryService } from './accessory.service';

const mockAccessory = { id: 1, name: 'Charger' };

describe('AccessoryController', () => {
  let controller: AccessoryController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessoryController],
      providers: [
        {
          provide: AccessoryService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockAccessory),
            findAll: jest.fn().mockResolvedValue([mockAccessory]),
            findOne: jest.fn().mockResolvedValue(mockAccessory),
            update: jest.fn().mockResolvedValue(mockAccessory),
            remove: jest.fn().mockResolvedValue(mockAccessory),
          },
        },
      ],
    }).compile();

    controller = module.get<AccessoryController>(AccessoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /accessory', () => {
    it('should create an accessory', async () => {
      const res = mockRes();
      await controller.create({ name: 'Charger' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /accessory', () => {
    it('should return all accessories', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /accessory/:id', () => {
    it('should return one accessory', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /accessory/:id', () => {
    it('should update an accessory', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /accessory/:id', () => {
    it('should delete an accessory', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
