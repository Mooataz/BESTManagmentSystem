import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { BadRequestException } from '@nestjs/common';

jest.mock('pdfkit', () => {
  const EventEmitter = require('events');
  return jest.fn().mockImplementation(() => {
    const doc = new EventEmitter();
    doc.pipe = jest.fn().mockReturnValue(doc);
    doc.font = jest.fn().mockReturnValue(doc);
    doc.fontSize = jest.fn().mockReturnValue(doc);
    doc.fillColor = jest.fn().mockReturnValue(doc);
    doc.fill = jest.fn().mockReturnValue(doc);
    doc.text = jest.fn().mockReturnValue(doc);
    doc.rect = jest.fn().mockReturnValue(doc);
    doc.moveTo = jest.fn().mockReturnValue(doc);
    doc.lineTo = jest.fn().mockReturnValue(doc);
    doc.stroke = jest.fn().mockReturnValue(doc);
    doc.image = jest.fn().mockReturnValue(doc);
    doc.addPage = jest.fn().mockReturnValue(doc);
    doc.switchToPage = jest.fn().mockReturnValue(doc);
    doc.moveDown = jest.fn().mockReturnValue(doc);
    doc.strokeColor = jest.fn().mockReturnValue(doc);
    doc.bufferedPageRange = jest
      .fn()
      .mockReturnValue({ count: 1, start: 0 });
    doc.heightOfString = jest.fn().mockReturnValue(10);
    doc.page = { width: 595, height: 842 };
    doc.y = 40;
    doc.end = jest.fn().mockImplementation(function () {
      process.nextTick(() => doc.emit('end'));
    });
    return doc;
  });
});

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  createWriteStream: jest
    .fn()
    .mockReturnValue({ on: jest.fn(), end: jest.fn() }),
}));

const mockBranch = {
  id: 1,
  name: 'Branch1',
  phone: 123,
  company: { id: 1 },
};
const mockCompany = {
  id: 1,
  name: 'BEST',
  logo: null,
  headquarterslocation: 'Tunis',
  taxRegisterNumber: '123',
  rib: 123,
  bank: 'BT',
};
const mockLegislations = [{ id: 1, name: 'Legislation 1' }];

const mockRepair = {
  id: 1,
  device: {
    model: {
      id: 1,
      name: 'Model1',
      brand: { id: 1, name: 'Brand1', logo: null },
      typeModel: { id: 1, description: 'Type1' },
    },
    serialenumber: 'SN12345',
  },
  deviceStateReceive: 'Bon état',
  customer: {
    name: 'Jean Dupont',
    phone: 98765432,
    distributer: { name: 'Distrib1' },
  },
  accessory: [{ name: 'Chargeur' }],
  listFault: [{ name: 'Écran cassé' }],
  customerRequest: [{ name: 'Réparation' }],
  historyRepair: [
    {
      date: new Date(),
      step: 'Réparation',
      tracability: [
        {
          user: {
            name: 'Tech1',
            branch: {
              id: 1,
              name: 'Branch1',
              phone: 123,
              company: { id: 1 },
            },
          },
        },
      ],
    },
  ],
};

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdfService,
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCompany),
            find: jest.fn().mockResolvedValue([mockCompany]),
          },
        },
        {
          provide: getRepositoryToken(Legislation),
          useValue: { find: jest.fn().mockResolvedValue(mockLegislations) },
        },
        {
          provide: getRepositoryToken(Repair),
          useValue: { find: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue(mockBranch),
          },
        },
      ],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatRepairPdf', () => {
    it('should throw BadRequestException if device or model missing', async () => {
      await expect(
        service.generatRepairPdf({ id: 1 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should generate a PDF buffer for a valid repair', async () => {
      const result = await service.generatRepairPdf(mockRepair as any);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('generateStockReport', () => {
    it('should throw BadRequestException if parts array is empty', async () => {
      await expect(service.generateStockReport(1, [])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return file path when parts provided', async () => {
      const parts = [
        { modelName: 'M1', partName: 'P1', count: 5 },
        { modelName: 'M2', partName: 'P2', count: 3 },
      ];
      const result = await service.generateStockReport(1, parts);
      expect(result).toContain('stock-1.pdf');
    });
  });

  describe('generateStockAlertPdf', () => {
    it('should return a PDF buffer', async () => {
      const report = [
        { brand: 'Brand1', model: 'M1', part: 'P1', quantity: 2 },
      ];
      const result = await service.generateStockAlertPdf(1, 1, report);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('generateReceptionAlertPdf', () => {
    it('should return a PDF buffer', async () => {
      const report = [
        {
          repairId: 1,
          customerName: 'C1',
          deviceModel: 'M1',
          serialNumber: 'SN1',
          creationDate: new Date(),
        },
      ];
      const result = await service.generateReceptionAlertPdf(1, 1, report);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('generateAffectationAlertPdf', () => {
    it('should return a PDF buffer', async () => {
      const report = [
        {
          repairId: 1,
          customerName: 'C1',
          deviceModel: 'M1',
          serialNumber: 'SN1',
          creationDate: new Date(),
        },
      ];
      const result = await service.generateAffectationAlertPdf(1, 1, report);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('generateReparationAlertPdf', () => {
    it('should return a PDF buffer', async () => {
      const report = [
        {
          repairId: 1,
          customerName: 'C1',
          deviceModel: 'M1',
          serialNumber: 'SN1',
          creationDate: new Date(),
        },
      ];
      const result = await service.generateReparationAlertPdf(1, 1, report);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('generateCqAlertPdf', () => {
    it('should return a PDF buffer', async () => {
      const report = [
        {
          repairId: 1,
          customerName: 'C1',
          deviceModel: 'M1',
          serialNumber: 'SN1',
          creationDate: new Date(),
        },
      ];
      const result = await service.generateCqAlertPdf(1, 1, report);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('generateBloqueAlertPdf', () => {
    it('should return a PDF buffer', async () => {
      const report = [
        { step: 'Réparation', count: 55 },
        { step: 'CQ', count: 60 },
      ];
      const result = await service.generateBloqueAlertPdf(1, 1, report);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('generateStockPartTicketPdf', () => {
    it('should return a PDF buffer', async () => {
      const stockParts = [
        {
          id: 1,
          serialNumber: 'SN001',
          bin: { name: 'A1', type: 'Étagère', branch: { name: 'Branch1' } },
          reference: {
            materialCode: 'MC001',
            description: 'Vis M8',
            model: [
              {
                brand: { name: 'Brand1' },
                typeModel: { description: 'Standard' },
                name: 'Model1',
              },
            ],
            allpart: { description: 'Vis' },
          },
        },
      ];
      const result = await service.generateStockPartTicketPdf(stockParts);
      expect(result).toBeInstanceOf(Buffer);
    });
  });
});
