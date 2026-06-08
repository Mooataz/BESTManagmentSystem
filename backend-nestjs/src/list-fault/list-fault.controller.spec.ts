import { Test, TestingModule } from '@nestjs/testing';
import { ListFaultController } from './list-fault.controller';
import { ListFaultService } from './list-fault.service';

const mockListFault = { id: 1, name: 'Fault 1' };

describe('ListFaultController', () => {
  let controller: ListFaultController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListFaultController],
      providers: [
        {
          provide: ListFaultService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockListFault),
            findAll: jest.fn().mockResolvedValue([mockListFault]),
            findOne: jest.fn().mockResolvedValue(mockListFault),
            update: jest.fn().mockResolvedValue(mockListFault),
            remove: jest.fn().mockResolvedValue(mockListFault),
          },
        },
      ],
    }).compile();

    controller = module.get<ListFaultController>(ListFaultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /list-fault', () => {
    it('should create a list fault', async () => {
      const res = mockRes();
      await controller.create({ name: 'Fault 1' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /list-fault', () => {
    it('should return all list faults', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /list-fault/:id', () => {
    it('should return one list fault', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /list-fault/:id', () => {
    it('should update a list fault', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /list-fault/:id', () => {
    it('should delete a list fault', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
