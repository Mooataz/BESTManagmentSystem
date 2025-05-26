import { Controller, Get, Post, Body, Patch, Param, Delete, Res, BadRequestException, NotFoundException } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
  import { Response } from 'express';
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}
  @Get('repair/:id')
  async generateRepairPdf(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    try {
      console.log('id: ', id)
      const pdfBuffer = await this.pdfService.generatRepairPdf(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=fiche_reparation.pdf',
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }

  @Post()
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
  }
}
