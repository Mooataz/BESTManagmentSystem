import { Test, TestingModule } from '@nestjs/testing';
import { LevelRepairController } from './level-repair.controller';
import { LevelRepairService } from './level-repair.service';

const mockLevelRepair = { id: 1, name: 'Level 1', price: 100 };

describe('LevelRepairController', () => {
  let controller: LevelRepairController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelRepairController],
      providers: [
        {
          provide: LevelRepairService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockLevelRepair),
            findAll: jest.fn().mockResolvedValue([mockLevelRepair]),
            findOne: jest.fn().mockResolvedValue(mockLevelRepair),
            update: jest.fn().mockResolvedValue(mockLevelRepair),
            remove: jest.fn().mockResolvedValue(mockLevelRepair),
          },
        },
      ],
    }).compile();

    controller = module.get<LevelRepairController>(LevelRepairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /level-repair', () => {
    it('should create a level repair', async () => {
      const res = mockRes();
      await controller.create({ name: 'Level 1', price: 100 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /level-repair', () => {
    it('should return all level repairs', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /level-repair/:id', () => {
    it('should return one level repair', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /level-repair/:id', () => {
    it('should update a level repair', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /level-repair/:id', () => {
    it('should delete a level repair', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
