import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRequestController } from './customer-request.controller';
import { CustomerRequestService } from './customer-request.service';

const mockCustomerRequest = { id: 1, name: 'Repair Request' };

describe('CustomerRequestController', () => {
  let controller: CustomerRequestController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerRequestController],
      providers: [
        {
          provide: CustomerRequestService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCustomerRequest),
            findAll: jest.fn().mockResolvedValue([mockCustomerRequest]),
            findOne: jest.fn().mockResolvedValue(mockCustomerRequest),
            update: jest.fn().mockResolvedValue(mockCustomerRequest),
            remove: jest.fn().mockResolvedValue(mockCustomerRequest),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerRequestController>(CustomerRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /customer-request', () => {
    it('should create a customer request', async () => {
      const res = mockRes();
      await controller.create({ name: 'Repair Request' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /customer-request', () => {
    it('should return all customer requests', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /customer-request/:id', () => {
    it('should return one customer request', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /customer-request/:id', () => {
    it('should update a customer request', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /customer-request/:id', () => {
    it('should delete a customer request', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
