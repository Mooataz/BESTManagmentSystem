import { Test, TestingModule } from '@nestjs/testing';
import { StockAlertController } from './stock-alert.controller';
import { StockAlertService } from './stock-alert.service';
import { PdfService } from 'src/pdf/pdf.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Branch } from 'src/branches/entities/branch.entity';

const mockAlert = { id: 1, type: 'stock', report: [], branch: { name: 'Branch 1' } };

describe('StockAlertController', () => {
  let controller: StockAlertController;
  let service: StockAlertService;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockAlertController],
      providers: [
        {
          provide: StockAlertService,
          useValue: {
            getAlerts: jest.fn().mockResolvedValue([mockAlert]),
            markAsRead: jest.fn().mockResolvedValue({ id: 1, readBy: ['1'] }),
            findAlertById: jest.fn().mockResolvedValue(mockAlert),
            generateAlertForBranch: jest.fn().mockResolvedValue({ id: 1 }),
            generateForAllBranches: jest.fn().mockResolvedValue([{ id: 1 }]),
            generateReceptionAlertForBranch: jest.fn().mockResolvedValue({ id: 1 }),
            generateReceptionForAllBranches: jest.fn().mockResolvedValue([{ id: 1 }]),
            generateAffectationAlertForBranch: jest.fn().mockResolvedValue({ id: 1 }),
            generateAffectationForAllBranches: jest.fn().mockResolvedValue([{ id: 1 }]),
            generateReparationAlertForBranch: jest.fn().mockResolvedValue({ id: 1 }),
            generateReparationForAllBranches: jest.fn().mockResolvedValue([{ id: 1 }]),
            generateCqAlertForBranch: jest.fn().mockResolvedValue({ id: 1 }),
            generateCqForAllBranches: jest.fn().mockResolvedValue([{ id: 1 }]),
            generateBloqueAlertForBranch: jest.fn().mockResolvedValue({ id: 1 }),
            generateBloqueForAllBranches: jest.fn().mockResolvedValue([{ id: 1 }]),
          },
        },
        {
          provide: PdfService,
          useValue: {
            generateStockAlertPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
            generateReceptionAlertPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
            generateAffectationAlertPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
            generateReparationAlertPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
            generateCqAlertPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
            generateBloqueAlertPdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
          },
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({ id: 1, name: 'Branch 1' }),
          },
        },
      ],
    }).compile();

    controller = module.get<StockAlertController>(StockAlertController);
    service = module.get<StockAlertService>(StockAlertService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /apiApp/stock-alert/generate/:branchId', () => {
    it('should generate stock alerts for branch', async () => {
      const result = await controller.generateForBranch('1');
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('GET /apiApp/stock-alert/generate-all', () => {
    it('should generate alerts for all branches', async () => {
      const result = await controller.generateAll();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('GET /apiApp/stock-alert/generate-reception/:branchId', () => {
    it('should generate reception alerts', async () => {
      const result = await controller.generateReception('1');
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('GET /apiApp/stock-alert/generate-reception-all', () => {
    it('should generate reception alerts for all', async () => {
      const result = await controller.generateReceptionAll();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('GET /apiApp/stock-alert/generate-affectation/:branchId', () => {
    it('should generate affectation alerts', async () => {
      const result = await controller.generateAffectation('1');
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('GET /apiApp/stock-alert/:branchId/:userId', () => {
    it('should get alerts', async () => {
      const result = await controller.getAlerts('1', '1');
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('GET /apiApp/stock-alert/:branchId/:userId/:type', () => {
    it('should get alerts by type', async () => {
      const result = await controller.getAlertsByType('1', '1', 'stock');
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('PATCH /apiApp/stock-alert/:id/read/:userId', () => {
    it('should mark alert as read', async () => {
      const result = await controller.markAsRead('1', '1');
      expect(result).toEqual({ id: 1, readBy: ['1'] });
    });
  });

  describe('GET /apiApp/stock-alert/:id/pdf/:branchId', () => {
    it('should download stock alert pdf', async () => {
      const res = mockRes();
      await controller.downloadPdf('1', '1', res);
      expect(res.set).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if alert not found', async () => {
      const res = mockRes();
      jest.spyOn(service, 'findAlertById').mockResolvedValue(null);
      await controller.downloadPdf('999', '1', res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
