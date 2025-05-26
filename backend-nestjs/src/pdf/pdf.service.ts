import { Injectable } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import * as PdfPrinter from 'pdfmake';
 import * as fs from 'fs';
 import { getVfs } from 'pdfmake/build/vfs_fonts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';
 @Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Repair) private repairRepository:Repository<Repair>,

  ){}
    async generatRepairPdf(repairId: number): Promise<Buffer> {
    
    // Récupérer les données depuis la BD
    const repair = await this.repairRepository.findOne({
      where: { id: repairId },
      relations: ['customer', 'device'],
    });
 
    if (!repair) {
      throw new Error('Réparation non trouvée');
    }

    // Créer le document PDF
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    // Ajouter le contenu au PDF
    doc.fontSize(25).text('Fiche de Réparation', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`ID: ${repair.id}`);
    doc.text(`Situè dans: ${repair.actuellyBranch}`);
    doc.text(`Statut: ${repair.deviceStateReceive}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Description:');
    doc.fontSize(12).text(repair.remark);
    doc.moveDown();
    
    doc.fontSize(16).text('Client:');
    doc.fontSize(12).text(`Nom: ${repair.customer.name}`);
      
    doc.text(`Téléphone: ${repair.customer.phone}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Appareil:');
    doc.fontSize(12).text(`Modèle: ${repair.device.model.name}`);
    doc.text(`Marque: ${repair.device.model.brand.name}`);
    doc.text(`S/N: ${repair.device.serialenumber}`);
    
    // Finaliser le PDF
    doc.end();
    
    // Retourner le buffer
    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
    });
  }
 





  create(createPdfDto: CreatePdfDto) {
    return 'This action adds a new pdf';
  }

  findAll() {
    return `This action returns all pdf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdf`;
  }

  update(id: number, updatePdfDto: UpdatePdfDto) {
    return `This action updates a #${id} pdf`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdf`;
  }


}
