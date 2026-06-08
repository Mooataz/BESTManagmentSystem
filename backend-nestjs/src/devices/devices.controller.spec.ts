import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

const mockDevice = { id: 1, serialenumber: 'SN123' };

describe('DevicesController', () => {
  let controller: DevicesController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [
        {
          provide: DevicesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDevice),
            findAll: jest.fn().mockResolvedValue([mockDevice]),
            findOne: jest.fn().mockResolvedValue(mockDevice),
            update: jest.fn().mockResolvedValue(mockDevice),
            remove: jest.fn().mockResolvedValue(mockDevice),
            findAllWithRepairs: jest.fn().mockResolvedValue([mockDevice]),
            chekDevice: jest.fn().mockResolvedValue(mockDevice),
            deviceHasOpenRepair: jest.fn().mockResolvedValue(false),
          },
        },
      ],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /devices', () => {
    it('should create a device', async () => {
      const res = mockRes();
      await controller.create({ serialenumber: 'SN123' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 201, data: mockDevice }));
    });
  });

  describe('GET /devices', () => {
    it('should return all devices', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: [mockDevice] }));
    });
  });

  describe('GET /devices/history', () => {
    it('should return devices with repairs', async () => {
      const res = mockRes();
      await controller.findAllWithRepairs(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: [mockDevice] }));
    });
  });

  describe('GET /devices/:id', () => {
    it('should return one device', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: mockDevice }));
    });
  });

  describe('PATCH /devices/:id', () => {
    it('should update a device', async () => {
      const res = mockRes();
      await controller.update(1, { serialenumber: 'SN456' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: mockDevice }));
    });
  });

  describe('DELETE /devices/:id', () => {
    it('should delete a device', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: mockDevice }));
    });
  });

  describe('POST /devices/Device', () => {
    it('should check/create a device', async () => {
      const res = mockRes();
      await controller.checkDevice({ serialenumber: 'SN123' }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: mockDevice }));
    });
  });

  describe('GET /devices/deviceHasOpenRepair/:id', () => {
    it('should check if device has open repair', async () => {
      const res = mockRes();
      await controller.deviceHasOpenRepair('SN123', res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), status: 200, data: false }));
    });
  });
});
