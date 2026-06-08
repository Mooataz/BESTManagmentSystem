import { Test, TestingModule } from '@nestjs/testing';
import { LegislationController } from './legislation.controller';
import { LegislationService } from './legislation.service';

const mockLegislation = { id: 1, name: 'Law 1' };

describe('LegislationController', () => {
  let controller: LegislationController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegislationController],
      providers: [
        {
          provide: LegislationService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockLegislation),
            findAll: jest.fn().mockResolvedValue([mockLegislation]),
            findOne: jest.fn().mockResolvedValue(mockLegislation),
            update: jest.fn().mockResolvedValue(mockLegislation),
            remove: jest.fn().mockResolvedValue(mockLegislation),
          },
        },
      ],
    }).compile();

    controller = module.get<LegislationController>(LegislationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /legislation', () => {
    it('should create a legislation', async () => {
      const res = mockRes();
      await controller.create({ name: 'Law 1' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /legislation', () => {
    it('should return all legislations', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /legislation/:id', () => {
    it('should return one legislation', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /legislation/:id', () => {
    it('should update a legislation', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /legislation/:id', () => {
    it('should delete a legislation', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
