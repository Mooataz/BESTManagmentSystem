import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { RepairService } from 'src/repair/repair.service';

describe('PdfController', () => {
  let controller: PdfController;
  let pdfService: any;
  let repairService: any;

  const mockPdfService = {
    generatRepairPdf: jest.fn(),
  };

  const mockRepairService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [
        { provide: PdfService, useValue: mockPdfService },
        { provide: RepairService, useValue: mockRepairService },
      ],
    }).compile();

    controller = module.get<PdfController>(PdfController);
    pdfService = module.get(PdfService);
    repairService = module.get(RepairService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /pdf/repair/:id', () => {
    it('should generate and send a repair PDF', async () => {
      repairService.findOne.mockResolvedValue({ id: 1 });
      pdfService.generatRepairPdf.mockResolvedValue(Buffer.from('pdf data'));

      const res = {
        set: jest.fn(),
        send: jest.fn(),
      };

      await controller.generateRepairsPdf(1, res as any);

      expect(repairService.findOne).toHaveBeenCalledWith(1);
      expect(pdfService.generatRepairPdf).toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="fiche_reparation.pdf"',
        'Content-Length': 8,
      });
      expect(res.send).toHaveBeenCalledWith(Buffer.from('pdf data'));
    });

    it('should return 404 if repair not found', async () => {
      repairService.findOne.mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.generateRepairsPdf(999, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 on pdf service error', async () => {
      repairService.findOne.mockResolvedValue({ id: 1 });
      pdfService.generatRepairPdf.mockRejectedValue(
        new Error('PDF error'),
      );

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.generateRepairsPdf(1, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('POST /pdf', () => {
    it('should generate and send a stock part PDF', async () => {
      pdfService.generatRepairPdf.mockResolvedValue(Buffer.from('stock pdf'));

      const res = {
        set: jest.fn(),
        send: jest.fn(),
      };

      await controller.generateAddStockPartPDF(
        { id: 1, device: { model: { name: 'M1' } } },
        res as any,
      );

      expect(pdfService.generatRepairPdf).toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Ajoute_Stock.pdf"',
        'Content-Length': 9,
      });
      expect(res.send).toHaveBeenCalledWith(Buffer.from('stock pdf'));
    });

    it('should return 500 on error', async () => {
      pdfService.generatRepairPdf.mockRejectedValue(
        new Error('Generation failed'),
      );

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.generateAddStockPartPDF({}, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
