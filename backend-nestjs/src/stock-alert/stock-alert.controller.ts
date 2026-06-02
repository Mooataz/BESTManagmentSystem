import { Controller, Get, Param, Patch, Res } from '@nestjs/common';
import { StockAlertService } from './stock-alert.service';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';

@Controller('apiApp/stock-alert')
export class StockAlertController {
  constructor(
    private readonly service: StockAlertService,
    private readonly pdfService: PdfService,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  // --- Specific routes first (literal prefixes) ---

  @Get('generate/:branchId')
  generateForBranch(@Param('branchId') branchId: string) {
    return this.service.generateAlertForBranch(Number(branchId));
  }

  @Get('generate-all')
  generateAll() {
    return this.service.generateForAllBranches();
  }

  @Get('generate-reception/:branchId')
  generateReception(@Param('branchId') branchId: string) {
    return this.service.generateReceptionAlertForBranch(Number(branchId));
  }

  @Get('generate-reception-all')
  generateReceptionAll() {
    return this.service.generateReceptionForAllBranches();
  }

  @Get('generate-affectation/:branchId')
  generateAffectation(@Param('branchId') branchId: string) {
    return this.service.generateAffectationAlertForBranch(Number(branchId));
  }

  @Get('generate-affectation-all')
  generateAffectationAll() {
    return this.service.generateAffectationForAllBranches();
  }

  @Get('generate-reparation/:branchId')
  generateReparation(@Param('branchId') branchId: string) {
    return this.service.generateReparationAlertForBranch(Number(branchId));
  }

  @Get('generate-reparation-all')
  generateReparationAll() {
    return this.service.generateReparationForAllBranches();
  }

  @Get('generate-cq/:branchId')
  generateCq(@Param('branchId') branchId: string) {
    return this.service.generateCqAlertForBranch(Number(branchId));
  }

  @Get('generate-cq-all')
  generateCqAll() {
    return this.service.generateCqForAllBranches();
  }

  @Get('generate-bloque/:branchId')
  generateBloque(@Param('branchId') branchId: string) {
    return this.service.generateBloqueAlertForBranch(Number(branchId));
  }

  @Get('generate-bloque-all')
  generateBloqueAll() {
    return this.service.generateBloqueForAllBranches();
  }

  // --- PDF download (literal "pdf" segment) ---

  @Get(':id/pdf/:branchId')
  async downloadPdf(
    @Param('id') id: string,
    @Param('branchId') branchId: string,
    @Res() res: Response,
  ) {
    const alert = await this.service.findAlertById(Number(id));
    if (!alert) return res.status(404).send('Alerte introuvable');
    const branch = await this.branchRepo.findOneBy({ id: Number(branchId) });
    const safeName = (branch?.name ?? 'inconnue').replace(/[^a-zA-Z0-9_-]/g, '_');

    if (alert.type === 'reception') {
      const pdfBuffer = await this.pdfService.generateReceptionAlertPdf(
        Number(id), Number(branchId), alert.report as any[],
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Alert de reception ${safeName}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      return res.send(pdfBuffer);
    }

    if (alert.type === 'affectation') {
      const pdfBuffer = await this.pdfService.generateAffectationAlertPdf(
        Number(id), Number(branchId), alert.report as any[],
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Alert d affectation ${safeName}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      return res.send(pdfBuffer);
    }

    if (alert.type === 'reparation') {
      const pdfBuffer = await this.pdfService.generateReparationAlertPdf(
        Number(id), Number(branchId), alert.report as any[],
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Alert de reparation ${safeName}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      return res.send(pdfBuffer);
    }

    if (alert.type === 'cq') {
      const pdfBuffer = await this.pdfService.generateCqAlertPdf(
        Number(id), Number(branchId), alert.report as any[],
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Alert CQ ${safeName}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      return res.send(pdfBuffer);
    }

    if (alert.type === 'bloque') {
      const pdfBuffer = await this.pdfService.generateBloqueAlertPdf(
        Number(id), Number(branchId), alert.report as any[],
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Alert bloque ${safeName}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      return res.send(pdfBuffer);
    }

    const pdfBuffer = await this.pdfService.generateStockAlertPdf(
      Number(id), Number(branchId), alert.report as any[],
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Alert de stock ${safeName}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  }

  // --- Generic parameterized routes last ---

  @Get(':branchId/:userId')
  getAlerts(
    @Param('branchId') branchId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.getAlerts(Number(branchId), Number(userId));
  }

  @Get(':branchId/:userId/:type')
  getAlertsByType(
    @Param('branchId') branchId: string,
    @Param('userId') userId: string,
    @Param('type') type: string,
  ) {
    return this.service.getAlerts(Number(branchId), Number(userId), type);
  }

  @Patch(':id/read/:userId')
  markAsRead(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.service.markAsRead(Number(id), Number(userId));
  }
}
