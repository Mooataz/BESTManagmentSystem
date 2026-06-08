import { Test, TestingModule } from '@nestjs/testing';
import { NotesCustomerController } from './notes-customer.controller';
import { NotesCustomerService } from './notes-customer.service';

const mockNotesCustomer = { id: 1, name: 'Note 1' };

describe('NotesCustomerController', () => {
  let controller: NotesCustomerController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesCustomerController],
      providers: [
        {
          provide: NotesCustomerService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockNotesCustomer),
            findAll: jest.fn().mockResolvedValue([mockNotesCustomer]),
            findOne: jest.fn().mockResolvedValue(mockNotesCustomer),
            update: jest.fn().mockResolvedValue(mockNotesCustomer),
            remove: jest.fn().mockResolvedValue(mockNotesCustomer),
          },
        },
      ],
    }).compile();

    controller = module.get<NotesCustomerController>(NotesCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /notes-customer', () => {
    it('should create a notes customer', async () => {
      const res = mockRes();
      await controller.create({ name: 'Note 1' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /notes-customer', () => {
    it('should return all notes customers', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /notes-customer/:id', () => {
    it('should return one notes customer', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /notes-customer/:id', () => {
    it('should update a notes customer', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /notes-customer/:id', () => {
    it('should delete a notes customer', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
