import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePdfService } from './invoice-pdf.service';
import { InvoiceService } from './invoice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('pdfkit', () => {
  const EventEmitter = require('events');
  return jest.fn().mockImplementation(() => {
    const doc = new EventEmitter();
    doc.pipe = jest.fn().mockReturnValue(doc);
    doc.font = jest.fn().mockReturnValue(doc);
    doc.fontSize = jest.fn().mockReturnValue(doc);
    doc.fill = jest.fn().mockReturnValue(doc);
    doc.fillColor = jest.fn().mockReturnValue(doc);
    doc.text = jest.fn().mockReturnValue(doc);
    doc.rect = jest.fn().mockReturnValue(doc);
    doc.moveTo = jest.fn().mockReturnValue(doc);
    doc.lineTo = jest.fn().mockReturnValue(doc);
    doc.stroke = jest.fn().mockReturnValue(doc);
    doc.strokeColor = jest.fn().mockReturnValue(doc);
    doc.image = jest.fn().mockReturnValue(doc);
    doc.addPage = jest.fn().mockReturnValue(doc);
    doc.moveDown = jest.fn().mockReturnValue(doc);
    doc.bufferedPageRange = jest
      .fn()
      .mockReturnValue({ count: 1, start: 0 });
    doc.heightOfString = jest.fn().mockReturnValue(10);
    doc.page = { width: 595, height: 842 };
    doc.y = 40;
    doc.end = jest.fn().mockImplementation(function () {
      doc.emit('end');
    });
    return doc;
  });
});

const mockCompany = {
  id: 1,
  name: 'BEST Tunisie',
  logo: null,
  headquarterslocation: 'Tunis',
  taxRegisterNumber: '1234567',
  rib: 123456,
  bank: 'BT',
  tva: 19,
  timbreFiscale: 1,
};

const mockPartsPrices = [
  {
    id: 1,
    price: 50,
    allPart: { id: 1, description: 'Pièce A' },
    levelRepair: { price: 30, name: 'Niveau 1' },
  },
  {
    id: 2,
    price: 100,
    allPart: { id: 2, description: 'Pièce B' },
    levelRepair: { price: 30, name: 'Niveau 1' },
  },
];

const mockOtherCosts = [
  { id: 1, name: 'Transport', price: 20, status: 'Autoriser' },
];

const baseInvoice = {
  id: 1,
  date: new Date(),
  repair: {
    id: 1,
    partsNeed: [1, 2],
    customer: { name: 'Jean', phone: '12345678' },
    device: {
      serialenumber: 'SN123',
      model: { id: 1, name: 'M1', brand: { id: 1, name: 'B1' } },
    },
  },
  user: {
    branch: {
      name: 'Agence Centre',
      location: 'Tunis',
      phone: '98765432',
      email: 'agence@test.com',
    },
  },
  details: null,
};

const mockRes = { setHeader: jest.fn() };

describe('InvoicePdfService', () => {
  let service: InvoicePdfService;
  let invoiceService: any;

  const mockInvoiceService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicePdfService,
        { provide: InvoiceService, useValue: mockInvoiceService },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            find: jest.fn().mockResolvedValue([mockCompany]),
          },
        },
        {
          provide: getRepositoryToken(OtherCost),
          useValue: {
            find: jest.fn().mockResolvedValue(mockOtherCosts),
          },
        },
        {
          provide: getRepositoryToken(PartsPrice),
          useValue: {
            find: jest.fn().mockResolvedValue(mockPartsPrices),
          },
        },
      ],
    }).compile();

    service = module.get<InvoicePdfService>(InvoicePdfService);
    invoiceService = module.get(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePdf', () => {
    it('should throw NotFoundException when invoice not found', async () => {
      invoiceService.findOne.mockResolvedValue(null);

      await expect(service.generatePdf(999, mockRes)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should generate PDF with stored details', async () => {
      const invoiceWithDetails = {
        ...baseInvoice,
        details: {
          parts: [{ partId: 1, partName: 'Pièce A', price: 50 }],
          otherCosts: [{ id: 1, name: 'Transport', price: 20 }],
          levelRepairPrice: 30,
          partsTotal: 50,
          otherCostsTotal: 20,
          totalHT: 100,
          tva: 19,
          tvaAmount: 19,
          timbreFiscale: 1,
          totalTTC: 120,
        },
      };
      invoiceService.findOne.mockResolvedValue(invoiceWithDetails);

      const res = { setHeader: jest.fn() };
      await service.generatePdf(1, res);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/pdf',
      );
    });

    it('should generate PDF without stored details (computed mode)', async () => {
      invoiceService.findOne.mockResolvedValue(baseInvoice);

      const res = { setHeader: jest.fn() };
      await service.generatePdf(1, res);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/pdf',
      );
    });

    it('should throw BadRequestException when part price is zero', async () => {
      const invoiceWithBadDetails = {
        ...baseInvoice,
        details: {
          parts: [{ partId: 1, partName: 'Pièce A', price: 0 }],
          otherCosts: [],
          levelRepairPrice: 0,
          partsTotal: 0,
          otherCostsTotal: 0,
          totalHT: 0,
          tva: 19,
          tvaAmount: 0,
          timbreFiscale: 0,
          totalTTC: 0,
        },
      };
      invoiceService.findOne.mockResolvedValue(invoiceWithBadDetails);

      const res = { setHeader: jest.fn() };
      await expect(service.generatePdf(1, res)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
