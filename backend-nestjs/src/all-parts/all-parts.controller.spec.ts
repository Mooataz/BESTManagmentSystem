import { Test, TestingModule } from '@nestjs/testing';
import { AllPartsController } from './all-parts.controller';
import { AllPartsService } from './all-parts.service';

const mockAllPart = { id: 1, description: 'Screen' };

describe('AllPartsController', () => {
  let controller: AllPartsController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllPartsController],
      providers: [
        {
          provide: AllPartsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockAllPart),
            findAll: jest.fn().mockResolvedValue([mockAllPart]),
            findOne: jest.fn().mockResolvedValue(mockAllPart),
            update: jest.fn().mockResolvedValue(mockAllPart),
            remove: jest.fn().mockResolvedValue(mockAllPart),
          },
        },
      ],
    }).compile();

    controller = module.get<AllPartsController>(AllPartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /all-parts', () => {
    it('should create a part', async () => {
      const res = mockRes();
      await controller.create({ description: 'Screen' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /all-parts', () => {
    it('should return all parts', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /all-parts/:id', () => {
    it('should return one part', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /all-parts/:id', () => {
    it('should update a part', async () => {
      const res = mockRes();
      await controller.update(1, { description: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /all-parts/:id', () => {
    it('should delete a part', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
