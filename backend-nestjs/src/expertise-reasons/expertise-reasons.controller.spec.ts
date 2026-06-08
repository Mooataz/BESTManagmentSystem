import { Test, TestingModule } from '@nestjs/testing';
import { ExpertiseReasonsController } from './expertise-reasons.controller';
import { ExpertiseReasonsService } from './expertise-reasons.service';

const mockExpertiseReason = { id: 1, name: 'Reason 1' };

describe('ExpertiseReasonsController', () => {
  let controller: ExpertiseReasonsController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertiseReasonsController],
      providers: [
        {
          provide: ExpertiseReasonsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockExpertiseReason),
            findAll: jest.fn().mockResolvedValue([mockExpertiseReason]),
            findOne: jest.fn().mockResolvedValue(mockExpertiseReason),
            update: jest.fn().mockResolvedValue(mockExpertiseReason),
            remove: jest.fn().mockResolvedValue(mockExpertiseReason),
          },
        },
      ],
    }).compile();

    controller = module.get<ExpertiseReasonsController>(ExpertiseReasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /expertise-reasons', () => {
    it('should create an expertise reason', async () => {
      const res = mockRes();
      await controller.create({ name: 'Reason 1' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /expertise-reasons', () => {
    it('should return all expertise reasons', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /expertise-reasons/:id', () => {
    it('should return one expertise reason', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /expertise-reasons/:id', () => {
    it('should update an expertise reason', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /expertise-reasons/:id', () => {
    it('should delete an expertise reason', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
