import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 1,
  name: 'Test User',
  login: 'test@best.tn',
  phone: 90908080,
  password: 'hashed123',
  role: ['Technicien'],
  status: 'Autoriser',
  createdDate: new Date(),
  branch: { id: 1, name: 'Branch 1' },
};

const mockBranch = { id: 1, name: 'Branch 1' };

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: any;
  let branchRepo: any;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AppService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
            find: jest.fn().mockResolvedValue([mockUser]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockUser]),
            })),
          },
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockBranch),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    branchRepo = module.get(getRepositoryToken(Branch));
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: any = {
        name: 'Test User',
        login: 'test@best.tn',
        phone: 90908080,
        password: '123456',
        role: 'Technicien',
        branch: 1,
        status: 'Autoriser',
        createdDate: new Date(),
      };
      const result = await service.create(dto);
      expect(result).toEqual(mockUser);
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('should throw if branch not found', async () => {
      jest.spyOn(branchRepo, 'findOne').mockResolvedValue(null);
      const dto: any = {
        name: 'Test',
        login: 'test@best.tn',
        phone: 90908080,
        password: '123456',
        role: 'Technicien',
        branch: 999,
        status: 'Autoriser',
        createdDate: new Date(),
      };
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const result = await service.findAll(1, 10);
      expect(result.data).toEqual([mockUser]);
      expect(result.total).toBe(1);
    });

    it('should return empty array if no users found', async () => {
      jest.spyOn(userRepo, 'findAndCount').mockResolvedValue([[], 0]);
      const result = await service.findAll(1, 10);
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockUser);
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found after update', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.update(999, { name: 'Updated' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
