import { Test, TestingModule } from '@nestjs/testing';
import { StockPartsController } from './stock-parts.controller';
import { StockPartsService } from './stock-parts.service';
import { PdfService } from 'src/pdf/pdf.service';

const mockPart = { id: 1, reference: 'REF-001', quantity: 10 };

describe('StockPartsController', () => {
  let controller: StockPartsController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockPartsController],
      providers: [
        {
          provide: StockPartsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPart),
            findAll: jest.fn().mockResolvedValue([mockPart]),
            findOne: jest.fn().mockResolvedValue(mockPart),
            update: jest.fn().mockResolvedValue(mockPart),
            remove: jest.fn().mockResolvedValue(mockPart),
          },
        },
        {
          provide: PdfService,
          useValue: { generatePdf: jest.fn().mockResolvedValue(Buffer.from('PDF')) },
        },
      ],
    }).compile();

    controller = module.get<StockPartsController>(StockPartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /stock-parts', () => {
    it('should create part', async () => {
      const res = mockRes();
      await controller.create({ reference: 'REF-001' } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /stock-parts', () => {
    it('should return all', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /stock-parts/:id', () => {
    it('should return one', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
