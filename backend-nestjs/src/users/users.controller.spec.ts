import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 1,
  name: 'Test User',
  login: 'test@best.tn',
  phone: 90908080,
  role: ['Technicien'],
  status: 'Autoriser',
  branch: { id: 1, name: 'Branch 1' },
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue({ data: [mockUser], total: 1 }),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(mockUser),
            findByBranchId: jest.fn().mockResolvedValue([mockUser]),
            findByStatus: jest.fn().mockResolvedValue([mockUser]),
            findUserByLogin: jest.fn().mockResolvedValue(mockUser),
            findToAssign: jest.fn().mockResolvedValue([mockUser]),
            getUsersByRole: jest.fn().mockResolvedValue([mockUser]),
            getAllUsersSortedByRole: jest.fn().mockResolvedValue([mockUser]),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users', () => {
    it('should return paginated users', async () => {
      const res = mockResponse();
      await controller.findAll('1', '10', res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ total: 1, page: 1, limit: 10 })
      );
    });

    it('should handle empty table', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new NotFoundException());
      const res = mockResponse();
      await controller.findAll('1', '10', res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /users/:id', () => {
    it('should return one user', async () => {
      const res = mockResponse();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      const res = mockResponse();
      await controller.findOne(999, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const res = mockResponse();
      await controller.create({ password: '123456', name: 'Test', login: 't@t.tn', phone: 90908080, role: 'Technicien', status: 'Autoriser', createdDate: new Date(), branch: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const res = mockResponse();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const res = mockResponse();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /users/findByBranch/:branchId', () => {
    it('should return users by branch', async () => {
      const res = mockResponse();
      await controller.getByBranchId(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /users/by-role/:role', () => {
    it('should return users by role', async () => {
      const result = await controller.getByRole('Technicien');
      expect(result).toEqual([mockUser]);
    });
  });

  describe('GET /users/sorted', () => {
    it('should return users sorted', async () => {
      const result = await controller.getAllSorted();
      expect(result).toEqual([mockUser]);
    });
  });
});
