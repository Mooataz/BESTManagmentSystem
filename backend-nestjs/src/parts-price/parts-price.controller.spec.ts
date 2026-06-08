import { Test, TestingModule } from '@nestjs/testing';
import { PartsPriceController } from './parts-price.controller';
import { PartsPriceService } from './parts-price.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';
import { BadRequestException } from '@nestjs/common';

const mockPartsPrice = { id: 1, price: 100 };

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('PartsPriceController', () => {
  let controller: PartsPriceController;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPartsPrice),
    findAll: jest.fn().mockResolvedValue([mockPartsPrice]),
    findOne: jest.fn().mockResolvedValue(mockPartsPrice),
    update: jest.fn().mockResolvedValue(mockPartsPrice),
    remove: jest.fn().mockResolvedValue(mockPartsPrice),
    getViewData: jest.fn().mockResolvedValue([{ calculatedPrice: 150 }]),
    getAvailability: jest.fn().mockResolvedValue([{ id: 1, stockCount: 5 }]),
    getReferences: jest.fn().mockResolvedValue({ brands: [], models: [], allParts: [], levelRepairs: [] }),
    generateTemplate: jest.fn().mockResolvedValue(Buffer.from('excel')),
    findByModelallPArt: jest.fn().mockResolvedValue(mockPartsPrice),
    findByModelAndPartIds: jest.fn().mockResolvedValue([mockPartsPrice]),
    getCompanyTvaTimbre: jest.fn().mockResolvedValue({ tva: 19, timbreFiscale: 1 }),
    importExcel: jest.fn().mockResolvedValue({ imported: 2, errors: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsPriceController],
      providers: [
        { provide: PartsPriceService, useValue: mockService },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(BranchAccessGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<PartsPriceController>(PartsPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /parts-price', () => {
    it('should create and return 201 with JSON body', async () => {
      const res = mockRes();
      await controller.create({ price: 100 } as any, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        status: 201,
        data: expect.anything(),
      }));
    });
  });

  describe('GET /parts-price', () => {
    it('should return all parts prices', async () => {
      const res = mockRes();
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        status: 200,
        data: [mockPartsPrice],
      }));
    });
  });

  describe('GET /parts-price/view-data', () => {
    it('should return view data with branchId query', async () => {
      const result = await controller.getViewData('1');
      expect(result).toEqual(expect.objectContaining({
        message: 'View data found',
        status: 200,
        data: expect.any(Array),
      }));
    });

    it('should throw BadRequestException if branchId missing', async () => {
      await expect(controller.getViewData('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET /parts-price/availability', () => {
    it('should return availability data', async () => {
      const result = await controller.getAvailability();
      expect(result).toEqual(expect.objectContaining({
        message: 'Availability found',
        status: 200,
        data: expect.any(Array),
      }));
    });
  });

  describe('GET /parts-price/references', () => {
    it('should return references data', async () => {
      const result = await controller.getReferences();
      expect(result).toEqual(expect.objectContaining({
        message: 'References found',
        status: 200,
        data: expect.any(Object),
      }));
    });
  });

  describe('GET /parts-price/template', () => {
    it('should download Excel template with correct headers', async () => {
      const res = mockRes();
      await controller.downloadTemplate(res);
      expect(mockService.generateTemplate).toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_import_parts_price.xlsx"',
      });
      expect(res.send).toHaveBeenCalledWith(expect.any(Buffer));
    });
  });

  describe('GET /parts-price/:id', () => {
    it('should find one by id', async () => {
      const res = mockRes();
      await controller.findOne(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle not found error', async () => {
      jest.spyOn(mockService, 'findOne').mockRejectedValueOnce(new BadRequestException('Not found'));
      const res = mockRes();
      await controller.findOne(999, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('PATCH /parts-price/:id', () => {
    it('should update a parts price', async () => {
      const res = mockRes();
      await controller.update(1, { price: 200 } as any, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'update').mockRejectedValueOnce(new BadRequestException('Not found'));
      const res = mockRes();
      await controller.update(999, { price: 200 } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('DELETE /parts-price/:id', () => {
    it('should delete a parts price', async () => {
      const res = mockRes();
      await controller.remove(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'remove').mockRejectedValueOnce(new BadRequestException('Not found'));
      const res = mockRes();
      await controller.remove(999, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('POST /parts-price/import', () => {
    it('should import from uploaded Excel file', async () => {
      const wb = new (await import('exceljs')).Workbook();
      const ws = wb.addWorksheet('Sheet1');
      ws.addRow(['Marque', 'Modèle', 'Pièce', 'Prix', 'Niveau']);
      ws.addRow(['Brand A', 'Model A', 'Part A', 100, 'Level 1']);
      const buffer = await wb.xlsx.writeBuffer() as Buffer;
      const res = mockRes();
      const file = { buffer } as Express.Multer.File;
      const req = {};
      await controller.importExcel(file, req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('importée'),
        status: 200,
        data: { imported: 2, errors: [] },
      }));
    });

    it('should import from request body rows', async () => {
      const res = mockRes();
      const req = {
        body: {
          rows: [
            { brandName: 'A', modelName: 'B', allPartDescription: 'C', price: 10 },
          ],
        },
      };
      await controller.importExcel(null as any, req, res);
      expect(mockService.importExcel).toHaveBeenCalledWith(req.body.rows);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should throw if no file and no body rows', async () => {
      const res = mockRes();
      const req = { body: {} };
      await expect(controller.importExcel(null as any, req, res)).rejects.toThrow(BadRequestException);
    });
  });

  describe('POST /parts-price/devis-info', () => {
    it('should return devis info with parts, tva and timbre', async () => {
      const res = mockRes();
      await controller.getDevisInfo({ modelId: 1, partIds: [1, 2] }, res);
      expect(mockService.findByModelAndPartIds).toHaveBeenCalledWith(1, [1, 2]);
      expect(mockService.getCompanyTvaTimbre).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        status: 200,
        data: expect.objectContaining({
          parts: expect.any(Array),
          tva: expect.any(Number),
          timbreFiscale: expect.any(Number),
        }),
      }));
    });

    it('should propagate HttpException errors', async () => {
      jest.spyOn(mockService, 'findByModelAndPartIds').mockRejectedValueOnce(new BadRequestException('Invalid'));
      const res = mockRes();
      await expect(controller.getDevisInfo({ modelId: 999, partIds: [] }, res)).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET /parts-price/:modelId/:allPartId', () => {
    it('should find by model and allPart ids', async () => {
      const res = mockRes();
      await controller.findPartsPriceByModelAndAllPart(1, 1, res);
      expect(mockService.findByModelallPArt).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error', async () => {
      jest.spyOn(mockService, 'findByModelallPArt').mockRejectedValueOnce(new BadRequestException('Not found'));
      const res = mockRes();
      await controller.findPartsPriceByModelAndAllPart(999, 999, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
