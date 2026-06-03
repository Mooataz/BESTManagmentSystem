import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException, UseInterceptors, UploadedFile, BadRequestException, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PartsPriceService, ImportRow } from './parts-price.service';
import * as ExcelJS from 'exceljs';
import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';

@Controller('parts-price')
export class PartsPriceController {
  constructor(private readonly partsPriceService: PartsPriceService) { }

  @Post()
  async create(@Body() createPartsPriceDto: CreatePartsPriceDto,
    @Res() res: any) {
    try {
      const newPrice = await this.partsPriceService.create(createPartsPriceDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Price created Successfuly !",
        status:HttpStatus.CREATED,
        data:newPrice
      })
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        })
      }
    
      throw error
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    
    try {
      const allTypes = await this.partsPriceService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Data founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Get('view-data')
  async getViewData(@Query('branchId') branchId: string) {
    if (!branchId) throw new BadRequestException('branchId is required');
    return {
      message: 'View data found',
      status: HttpStatus.OK,
      data: await this.partsPriceService.getViewData(+branchId),
    };
  }

  @Get('availability')
  async getAvailability() {
    return {
      message: 'Availability found',
      status: HttpStatus.OK,
      data: await this.partsPriceService.getAvailability(),
    };
  }

  @Get('references')
  async getReferences() {
    return {
      message: 'References found',
      status: HttpStatus.OK,
      data: await this.partsPriceService.getReferences(),
    };
  }

  @Get('template')
  async downloadTemplate(@Res() res: any) {
    const buffer = await this.partsPriceService.generateTemplate();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template_import_parts_price.xlsx"',
    });
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number,
    @Res() res: any) {
    try {
      const allTypes = await this.partsPriceService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Data founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updatePartsPriceDto: UpdatePartsPriceDto,
    @Res() res: any) {
    try {
      const allTypes = await this.partsPriceService.update(+id, updatePartsPriceDto)
      return res.status(HttpStatus.OK).json({
        message:"Data updated Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res() res: any) {
    
    try {
      const allTypes = await this.partsPriceService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Data deleted Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File, @Req() req: any, @Res() res: any) {
    try {
      let rows: ImportRow[];

      if (file) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) throw new BadRequestException('Aucune feuille trouvée');

        rows = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          rows.push({
            brandName: (row.getCell(1).value ?? '').toString().trim(),
            modelName: (row.getCell(2).value ?? '').toString().trim(),
            allPartDescription: (row.getCell(3).value ?? '').toString().trim(),
            price: parseFloat((row.getCell(4).value ?? '0').toString().trim()),
            levelRepairName: (row.getCell(5).value ?? '').toString().trim() || undefined,
          });
        });
      } else if (req.body && Array.isArray(req.body.rows)) {
        rows = req.body.rows;
      } else {
        throw new BadRequestException('Aucune donnée valide (fichier ou body.rows)');
      }

      const result = await this.partsPriceService.importExcel(rows);
      return res.status(HttpStatus.OK).json({
        message: `${result.imported} ligne(s) importée(s)`,
        status: HttpStatus.OK,
        data: result,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Import invalide');
    }
  }

  @Post('devis-info')
  async getDevisInfo(@Body() body: { modelId: number; partIds: number[] }, @Res() res: any) {
    try {
      const parts = await this.partsPriceService.findByModelAndPartIds(body.modelId, body.partIds);
      const { tva, timbreFiscale } = await this.partsPriceService.getCompanyTvaTimbre();
      
      return res.status(HttpStatus.OK).json({
        message: 'Devis info found successfully !',
        status: HttpStatus.OK,
        data: { parts, tva, timbreFiscale }
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw error;
    }
  }

  @Get(':modelId/:allPartId')
  async findPartsPriceByModelAndAllPart(
                                          @Param('modelId') modelId: number,
                                          @Param('allPartId') allPartId: number,
                                          @Res() res: any
                                        ) {
 

    try {
      const partsPrice = await this.partsPriceService.findByModelallPArt(
        modelId,
        allPartId,
      );
      return res.status(HttpStatus.OK).json({
        message:`Price Part founded for modelId ${modelId} and allPartId ${allPartId}`,
        status:HttpStatus.OK,
        data:partsPrice
      })
    } catch (error) {
  if (error instanceof HttpException) {
    return res.status(error.getStatus()).json({
      message: error.message,
      status: error.getStatus(),
      data: null,
    })
  }

  throw error
}
  }
}

