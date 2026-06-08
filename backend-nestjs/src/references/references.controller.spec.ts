import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';

const mockReference = { id: 1, materialCode: 'MC001', description: 'Test Ref' };

describe('ReferencesController', () => {
  let controller: ReferencesController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferencesController],
      providers: [
        {
          provide: ReferencesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockReference),
            findAll: jest.fn().mockResolvedValue([mockReference]),
            findOne: jest.fn().mockResolvedValue(mockReference),
            update: jest.fn().mockResolvedValue(mockReference),
            remove: jest.fn().mockResolvedValue(mockReference),
            findCompatibleReferences: jest.fn().mockResolvedValue([mockReference]),
            findReferenceByMaterialCode: jest.fn().mockResolvedValue(mockReference),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ReferencesController>(ReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /references', () => {
    it('should create a reference', async () => {
      const res = mockRes();
      await controller.create({ materialCode: 'MC001', description: 'Test', modelIds: [1], allpart: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 201,
        data: mockReference,
      });
    });
  });

  describe('GET /references', () => {
    it('should return all references', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: [mockReference],
      });
    });
  });

  describe('GET /references/:id', () => {
    it('should return one reference', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockReference,
      });
    });
  });

  describe('PATCH /references/:id', () => {
    it('should update a reference', async () => {
      const res = mockRes();
      await controller.update(1, { description: 'Updated' } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockReference,
      });
    });
  });

  describe('DELETE /references/:id', () => {
    it('should delete a reference', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockReference,
      });
    });
  });

  describe('GET /references/getCompatibleReferences/:modelId/:partId', () => {
    it('should return compatible references', async () => {
      const res = mockRes();
      await controller.getCompatibleReferences(1, 1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: [mockReference],
      });
    });
  });

  describe('GET /references/GetMC/:code', () => {
    it('should find reference by material code', async () => {
      const res = mockRes();
      await controller.findReferenceByMaterialCode('MC001', res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        status: 200,
        data: mockReference,
      });
    });
  });
});
