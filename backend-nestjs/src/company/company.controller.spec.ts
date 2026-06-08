import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

const mockCompany = { id: 1, name: 'BEST', bank: 'BIAT' };

describe('CompanyController', () => {
  let controller: CompanyController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCompany),
            findAll: jest.fn().mockResolvedValue([mockCompany]),
            findOne: jest.fn().mockResolvedValue(mockCompany),
            update: jest.fn().mockResolvedValue(mockCompany),
            remove: jest.fn().mockResolvedValue(mockCompany),
          },
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /company', () => {
    it('should create a company', async () => {
      const res = mockRes();
      await controller.create({ name: 'BEST' } as any, res, { filename: 'logo.png' } as any);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /company', () => {
    it('should return all companies', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /company/:id', () => {
    it('should return one company', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PATCH /company/:id', () => {
    it('should update a company', async () => {
      const res = mockRes();
      await controller.update(1, { name: 'Updated' } as any, res, null as any);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('DELETE /company/:id', () => {
    it('should delete a company', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
