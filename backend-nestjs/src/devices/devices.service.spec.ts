import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Model } from 'src/models/entities/model.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockDevice = { id: 1, serialenumber: 'SN123', purchaseDate: new Date('2024-01-01'), model: { id: 1 }, repair: [] } as any;
const mockCustomer = { id: 1, name: 'Customer 1' };
const mockModelEnt = { id: 1, name: 'Model 1' };

describe('DevicesService', () => {
  let service: DevicesService;
  let deviceRepo: any;
  let customerRepo: any;
  let modelRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: AppService,
          useValue: {
            cleanSpaces: jest.fn().mockImplementation((x) => x),
          },
        },
        {
          provide: getRepositoryToken(Device),
          useValue: {
            create: jest.fn().mockReturnValue(mockDevice),
            save: jest.fn().mockResolvedValue(mockDevice),
            find: jest.fn().mockResolvedValue([mockDevice]),
            findOne: jest.fn().mockResolvedValue(mockDevice),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
        {
          provide: getRepositoryToken(Model),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockModelEnt),
          },
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    deviceRepo = module.get(getRepositoryToken(Device));
    customerRepo = module.get(getRepositoryToken(Customer));
    modelRepo = module.get(getRepositoryToken(Model));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a device', async () => {
      const result = await service.create({ serialenumber: 'SN123', purchaseDate: '2024-01-01' } as any);
      expect(result).toEqual(mockDevice);
    });
  });

  describe('findAll', () => {
    it('should return all devices', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockDevice]);
    });
  });

  describe('findOne', () => {
    it('should return a device', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockDevice);
    });

    it('should throw if not found', async () => {
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a device', async () => {
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValueOnce(mockDevice).mockResolvedValueOnce(mockDevice);
      const result = await service.update(1, { serialenumber: 'SN456' } as any);
      expect(result).toEqual(mockDevice);
    });

    it('should throw if not found after update', async () => {
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a device', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockDevice);
    });

    it('should throw if not found', async () => {
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('filterDevicesByCustomer', () => {
    it('should return devices by customer', async () => {
      const qb = { leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([mockDevice]) };
      jest.spyOn(deviceRepo, 'createQueryBuilder').mockReturnValue(qb);
      const result = await service.filterDevicesByCustomer(1);
      expect(result).toEqual([mockDevice]);
    });

    it('should throw if empty', async () => {
      const qb = { leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) };
      jest.spyOn(deviceRepo, 'createQueryBuilder').mockReturnValue(qb);
      await expect(service.filterDevicesByCustomer(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('filterBySerialNumber', () => {
    it('should return devices by serial number', async () => {
      const qb = { where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([mockDevice]) };
      jest.spyOn(deviceRepo, 'createQueryBuilder').mockReturnValue(qb);
      const result = await service.filterBySerialNumber(123);
      expect(result).toEqual([mockDevice]);
    });

    it('should throw if empty', async () => {
      const qb = { where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) };
      jest.spyOn(deviceRepo, 'createQueryBuilder').mockReturnValue(qb);
      await expect(service.filterBySerialNumber(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('filterByModel', () => {
    it('should return devices by model', async () => {
      const qb = { where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([mockDevice]) };
      jest.spyOn(deviceRepo, 'createQueryBuilder').mockReturnValue(qb);
      const result = await service.filterByModel(1);
      expect(result).toEqual([mockDevice]);
    });

    it('should throw if empty', async () => {
      const qb = { where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) };
      jest.spyOn(deviceRepo, 'createQueryBuilder').mockReturnValue(qb);
      await expect(service.filterByModel(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllWithRepairs', () => {
    it('should return devices with repairs', async () => {
      jest.spyOn(deviceRepo, 'find').mockResolvedValue([mockDevice]);
      const result = await service.findAllWithRepairs();
      expect(result).toEqual([mockDevice]);
    });
  });

  describe('deviceHasOpenRepair', () => {
    it('should return false if no device', async () => {
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValue(null);
      const result = await service.deviceHasOpenRepair('SN123');
      expect(result).toBe(false);
    });

    it('should return false if device has no repairs', async () => {
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValue({ ...mockDevice, repair: [] });
      const result = await service.deviceHasOpenRepair('SN123');
      expect(result).toBe(false);
    });

    it('should return true if last repair step is not Récupérer', async () => {
      const deviceWithRepair = {
        ...mockDevice,
        repair: [{ id: 1, historyRepair: [{ date: new Date(), step: 'En cours' }] }],
      };
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValue(deviceWithRepair);
      const result = await service.deviceHasOpenRepair('SN123');
      expect(result).toBe(true);
    });

    it('should return false if last repair step is Récupérer', async () => {
      const deviceWithRepair = {
        ...mockDevice,
        repair: [{ id: 1, historyRepair: [{ date: new Date(), step: 'Récupérer' }] }],
      };
      jest.spyOn(deviceRepo, 'findOne').mockResolvedValue(deviceWithRepair);
      const result = await service.deviceHasOpenRepair('SN123');
      expect(result).toBe(false);
    });
  });

  describe('chekDevice', () => {
    it('should find or create a device', async () => {
      const qb = { where: jest.fn().mockReturnThis(), getOne: jest.fn().mockResolvedValue(null) };
      jest.spyOn(deviceRepo, 'createQueryBuilder').mockReturnValue(qb);
      jest.spyOn(deviceRepo, 'create').mockReturnValue(mockDevice);
      jest.spyOn(deviceRepo, 'save').mockResolvedValue(mockDevice);
      const result = await service.chekDevice('SN123', '2024-01-01', 1);
      expect(result).toEqual(mockDevice);
    });
  });
});
