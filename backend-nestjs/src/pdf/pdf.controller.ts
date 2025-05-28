import { Controller,ParseIntPipe, Get, Post, Body, Patch, Param, Delete, Res, BadRequestException, NotFoundException } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { Response } from 'express';
import { RepairService } from '../repair/repair.service';
  @Controller('pdf')
export class PdfController {
  constructor( private readonly repairService: RepairService,
               private readonly pdfService: PdfService) {}

  @Get('repair/:id')
async generateRepairsPdf(
  @Param('id') id: number,
  @Res() res: Response,
) {
  try {
    const repair = await this.repairService.findOne(id);
    if (!repair) {
      throw new NotFoundException('Réparation non trouvée');
    }
    
    const pdfBuffer = await this.pdfService.generatRepairPdf(repair);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="fiche_reparation.pdf"',
      'Content-Length': pdfBuffer.length
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send('Erreur lors de la génération du PDF');
    }
  }
}

  /* @Post()
  create(@Body() createPdfDto: CreatePdfDto) {
    return this.pdfService.create(createPdfDto);
  }

  @Get()
  findAll() {
    return this.pdfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pdfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePdfDto: UpdatePdfDto) {
    return this.pdfService.update(+id, updatePdfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdfService.remove(+id);
  } */
}
