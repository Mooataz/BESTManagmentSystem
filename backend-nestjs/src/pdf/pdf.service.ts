import { Injectable } from '@nestjs/common';
 
import * as path from 'path';
import { Repair } from '../repair/entities/repair.entity';
import * as PDFDocument from 'pdfkit';
@Injectable()
export class PdfService {
  async generatRepairPdf(repair: Repair): Promise<Buffer> {
    // Initialise les polices
   
  const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(8).text('Fiche Réparation', { underline: true });
    doc.text(`Client: ${repair.customer?.name ?? 'N/A'}`);
    doc.text(`Appareil: ${repair.device?.serialenumber ?? 'N/A'}`);
    doc.text(`État reçu: ${repair.deviceStateReceive}`);
    doc.text(`Remarque: ${repair.remark}`);

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  }
}