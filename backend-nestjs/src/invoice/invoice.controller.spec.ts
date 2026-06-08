import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoicePdfService } from './invoice-pdf.service';

const mockInvoice = { id: 1, reference: 'FACT-001', total: 100 };

describe('InvoiceController', () => {
  let controller: InvoiceController;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockInvoice),
            findAll: jest.fn().mockResolvedValue({ data: [mockInvoice], total: 1 }),
            findOne: jest.fn().mockResolvedValue(mockInvoice),
            update: jest.fn().mockResolvedValue(mockInvoice),
            remove: jest.fn().mockResolvedValue(mockInvoice),
          },
        },
        {
          provide: InvoicePdfService,
          useValue: { generateInvoicePdf: jest.fn().mockResolvedValue(Buffer.from('PDF')) },
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /invoice', () => {
    it('should create invoice', async () => {
      const res = mockRes();
      await controller.create({ repair: 1 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /invoice', () => {
    it('should return all invoices', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /invoice/:id', () => {
    it('should return one invoice', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
