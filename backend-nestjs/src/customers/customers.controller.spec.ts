import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

const mockCustomer = { id: 1, name: 'Client Test', phone: 90908080 };

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCustomer),
            findAll: jest.fn().mockResolvedValue([mockCustomer]),
            findOne: jest.fn().mockResolvedValue(mockCustomer),
            update: jest.fn().mockResolvedValue(mockCustomer),
            remove: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /customers should create', async () => {
    const res = mockRes();
    await controller.create({ name: 'Test' } as any, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('GET /customers should return all', async () => {
    const res = mockRes();
    await controller.findAll(res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('GET /customers/:id should return one', async () => {
    const res = mockRes();
    await controller.findOne(1, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('PATCH /customers/:id should update', async () => {
    const res = mockRes();
    await controller.update(1, { name: 'Updated' } as any, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('DELETE /customers/:id should delete', async () => {
    const res = mockRes();
    await controller.remove(1, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
