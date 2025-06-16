 

import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import * as path from 'path';
import { Repair } from '../repair/entities/repair.entity';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { Branch } from 'src/branches/entities/branch.entity';

 
 

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Company) private readonly companyRepository: Repository<Company>,
    @InjectRepository(Legislation) private readonly legislationRepository: Repository<Legislation>,
    @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
  ) {}

  async generatRepairPdf(repair: Repair): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({ margin: 20 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      try {
        // Récupération des données
        const firstHistory = repair.historyRepair?.[0] || {};
        const firstTracability = firstHistory.tracability?.[0] || {};
        const userBranch = firstTracability.user?.branch || {};
        const branchs = await this.branchRepository.find();
        const company = await this.companyRepository.findOne({ 
          where: { id: userBranch.company?.id } 
        });

        const allLaw = await this.legislationRepository.find()

        // Header avec logo
        const startX = 50;
        const startY = 20;
        const logoWidth = 80;
        const logoHeight = 40;

        if (company?.logo) {
          const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
          if (fs.existsSync(logoPath)) {
            doc.image(logoPath, startX, startY, { width: logoWidth });
            const textY = startY + (logoHeight / 2) - (doc.currentLineHeight() / 2);
            doc.fontSize(10)
               .text(company.name, startX + logoWidth + 10, textY, {color:'"#135188'});
          }
        }

        // Positionnement du contenu
        const contentStartY = startY + logoHeight ;
        doc.fontSize(10)
           .text(`Fiche de Réparation N°: ${repair.id}`, 50, contentStartY, { 
             align: 'center',
             /* underline: true */
           });

        // Configuration des boxes
        const boxWidth = doc.page.width/3 -40;
        const boxSpacing =  0;
        const lineHeight = 15;
        const padding = 6;
        const firstBoxY = contentStartY + 40;

        // Fonction pour calculer la hauteur maximale nécessaire
        const calculateMaxHeight = (boxesItems: {label: string, value: any}[][]) => {
          return Math.max(...boxesItems.map(items => {
            let totalLines = 0;
            items.forEach(item => {
              totalLines += 1; // Pour le label
              if (Array.isArray(item.value)) {
                totalLines += item.value.length;
              } else {
                const text = String(item.value);
                const approxLines = Math.ceil(doc.widthOfString(text) / 100);
                totalLines += Math.max(1, approxLines);
              }
            });
            return (totalLines * lineHeight) + (padding * 2);
          }));
        };

        // Données des boxes
        const safeDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : 'N/A';

        // Première ligne de boxes
        const box1Items = [
          { label: 'Client', value: repair.customer?.name || 'N/A' },
          { label: 'Téléphone', value: repair.customer?.phone || 'N/A' },
          { label: 'Distributeur', value: repair.customer?.distributer?.name || '-' },
          { label: 'Reçue le', value: safeDate(firstHistory.date) },
          { label: 'Employée', value: firstTracability.user?.name || '-' },
          { label: 'Agence', value: userBranch.name || '-' }
        ];

        const box2Items = [
          { label: 'Code Appareil', value: repair.device?.id || 'N/A' },
          { label: 'Marque', value: repair.device?.model?.brand?.name || 'N/A' },
          { label: 'Modèle', value: repair.device?.model?.name || 'N/A' },
          { label: 'Imei', value: repair.device?.serialenumber || 'N/A' },
          { label: 'Date achat', value: safeDate(repair.device?.purchaseDate) }
        ];

        const box3Items = [
          { label: 'État appareil', value: repair.deviceStateReceive || '-' },
          { 
            label: 'Accessoires', 
            value: repair.accessory?.length 
              ? repair.accessory.map(a => a.name) 
              : ['Aucun accessoire'] 
          }
        ];

         // Nouvelle fonction pour créer une boîte avec logo
        const createBrandBox = (x: number, y: number, width: number, height: number) => {
          // Dessiner le cadre de la boîte
          //doc.rect(x, y, width, height).stroke();
          
          // Ajouter le logo si disponible
          if (repair.device?.model?.brand?.logo) {
            const logoPath = path.join(__dirname, '..', '..', 'upload', 'brands', repair.device.model.brand.logo);
            
            if (fs.existsSync(logoPath)) {
              // Calculer la position centrée
              const logoWidth = 50; // Largeur fixe pour le logo
              const logoHeight = 40; // Hauteur fixe
              const logoX = x + (width - logoWidth) / 2;
              const logoY = y + 5; // Petit padding en haut
              
              doc.image(logoPath, logoX, logoY, { 
                width: logoWidth,
                height: logoHeight,
               
              });
              doc.restore();
              // Ajouter le nom de la marque sous le logo
              
            }
          }
        };

        // Utilisation dans votre layout
        
        const heights = [
              box1Items.length * lineHeight + padding * 2,
              box2Items.length * lineHeight + padding * 2,
              box3Items.length * lineHeight + padding * 2
            ];
        // Calcul de la hauteur uniforme
        const uniformHeight = Math.max(...heights);

        const boxSize = 50; // Taille carrée pour la boîte logo
        const boxX = 500;    // Position X
        const boxY = 20;   // Position Y
        
        createBrandBox(boxX, boxY, boxSize, boxSize);
        // Fonction pour dessiner les boxes avec hauteur fixe
        const drawUniformBox = (
          x: number,
          y: number,
          width: number,
          items: { label: string; value: any }[],
          boxHeight: number
        ) => {
          doc.lineWidth(0.5)
             .rect(x, y, width, boxHeight)
             .stroke();
          
          let currentY = y + padding;
          const labelWidth = 60;

          items.forEach(item => {
            doc.font('Helvetica-Bold')
               .fontSize(8)
               .text(`${item.label}:`, x + 5, currentY, {
                 width: labelWidth,
                 align: 'left'
               });

            doc.font('Helvetica')
               .fontSize(8)
               .text(
                 Array.isArray(item.value) 
                   ? item.value.map((v, i) => i === 0 ? v : `• ${v}`).join('\n')
                   : String(item.value),
                 x + labelWidth + 10, 
                 currentY,
                 {
                   width: width - labelWidth - 15,
                   align: 'left'
                 }
               );

            currentY += lineHeight * (Array.isArray(item.value) ? item.value.length : 1);
          });
        };

        // Dessin des boxes avec hauteur uniforme
        drawUniformBox(50, firstBoxY, boxWidth, box1Items, uniformHeight);
        drawUniformBox(50 + boxWidth + boxSpacing, firstBoxY, boxWidth, box2Items, uniformHeight);
        drawUniformBox(50 + (boxWidth + boxSpacing) * 2, firstBoxY, boxWidth, box3Items, uniformHeight);
        

        // Deuxième ligne de boxes
        const secondBoxY = firstBoxY + uniformHeight + 20;

        const box4Items = [{
          label: 'Problèmes',
          value: repair.listFault?.length
            ? repair.listFault.map(f => f.name)
            : ['Aucun problème']
        }];

        const box5Items = [{
          label: 'Remarque',
          value: repair.remark || 'Aucune remarque'
        }];

        const box6Items = [{
          label: 'Demande client',
          value: repair.customerRequest?.length
            ? repair.customerRequest.map(r => r.name)
            : ['Aucune demande']
        }];

        // Hauteur uniforme pour la deuxième ligne
        const uniformHeight2 = calculateMaxHeight([box4Items, box5Items, box6Items]);

        drawUniformBox(50, secondBoxY-20, boxWidth, box4Items, uniformHeight2);
        drawUniformBox(50 + boxWidth + boxSpacing, secondBoxY-20, boxWidth, box5Items, uniformHeight2);
        drawUniformBox(50 + (boxWidth + boxSpacing) * 2, secondBoxY-20, boxWidth, box6Items, uniformHeight2);

     
 const lawItems = allLaw.map(law => law.name);

        // Positionnement de la boîte législation (après les autres boxes)
        const lawBoxY = secondBoxY + uniformHeight2  ; // Ajustez selon votre layout
        const lawBoxWidth = doc.page.width - 40; // 100% width (marges de 20 de chaque côté)

        this.drawTwoColumnBox(
          doc,
          20, // x (marge gauche)
          lawBoxY-20,
          lawBoxWidth ,
          'Législations Applicables',
          lawItems
        );

 
//______________________________________________________________________________________________________
            const stY = 400;
            doc.moveTo(20, stY) // Position de départ (x, y)
              .lineTo(600, stY) // Position de fin (x, y)
              .lineWidth(0,5) // Épaisseur de la ligne
              .stroke(); // Dessiner la ligne

 
            const textY = 550 + (logoHeight / 2) - (doc.currentLineHeight() / 2);
            doc.fontSize(8)
               .text('BEST', startX , stY +10, {color:'"#135188'});
            doc.fontSize(6)
               .text('Adresse :'+company?.headquarterslocation, startX  , stY +20, {color:'"#135188'});
            doc.fontSize(6)
               .text('Banque: '+company?.bank, startX  , stY+30, {color:'"#135188'});
            doc.fontSize(6)
               .text('RIB: '+company?.rib, startX  , stY+40, {color:'"#135188'});
            doc.fontSize(6)
               .text('MF: '+company?.taxRegisterNumber, startX  , stY+50, {color:'"#135188'});
          
        const branch = repair.historyRepair[0].tracability[0].user.branch
            
        doc.fontSize(8)
               .text('Agence: '+branch.name, startX +200 , stY +10, {color:'"#135188'});
        doc.fontSize(6)
               .text('Téléphone: '+branch.phone, startX +200 , stY +20, {color:'"#135188'});
        doc.fontSize(6)
               .text('E-mail: '+branch.email, startX +200 , stY +30, {color:'"#135188'});
        doc.fontSize(6)
               .text('E-Adresse: '+branch.location, startX +200 , stY +40, {color:'"#135188'});
// - - - - - - -  - - - - - - - - -  - - - - - - - - - -  - - - - - - - - - - - -
        doc.moveTo(20, stY+60) // Position de départ (X, Y)
          .lineTo(600, stY+60) // Position de fin (X, Y)
          .lineWidth(1) // Épaisseur de la ligne
          .dash(5, { space: 3 }) // Pointillés (5px de trait, 3px d'espace)
          .stroke(); // Dessiner la ligne

// Désactiver les pointillés pour les éléments suivants (optionnel)
doc.undash();

if (company?.logo) {
          const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
          if (fs.existsSync(logoPath)) {
            doc.image(logoPath, startX, stY + 70, { width: logoWidth });
            const textY = stY+ 70 + (logoHeight / 2) - (doc.currentLineHeight() / 2);
            doc.fontSize(10)
               .text(company.name, startX + logoWidth + 10, textY, {color:'"#135188'});
          }
        }
        const  StartY = stY + 70 + logoHeight + 10;
        doc.fontSize(10)
           .text(`Fiche de Réparation N°: ${repair.id}`, 50, StartY, { 
             align: 'center',
             /* underline: true */
           });
        createBrandBox(500, stY + 70, 50, 50);

const Ystart = StartY +10
 // Dessin des boxes avec hauteur uniforme
        drawUniformBox(50, Ystart, boxWidth, box1Items, uniformHeight);
        drawUniformBox(50 + boxWidth + boxSpacing, Ystart, boxWidth, box2Items, uniformHeight);
        drawUniformBox(50 + (boxWidth + boxSpacing) * 2, Ystart, boxWidth, box3Items, uniformHeight);

 const uniformHeight3 = calculateMaxHeight([box4Items, box5Items, box6Items]);

        drawUniformBox(50, Ystart + 110, boxWidth, box4Items, uniformHeight2);
        drawUniformBox(50 + boxWidth + boxSpacing, Ystart + 110, boxWidth, box5Items, uniformHeight2);
        drawUniformBox(50 + (boxWidth + boxSpacing) * 2, Ystart + 110, boxWidth, box6Items, uniformHeight2);
        // Pied de page
        doc.fontSize(6)
           .text(
             `Document généré le ${new Date().toLocaleDateString('fr-FR')}`,
             50,
             doc.page.height - 30,
             { align: 'right' }
           );

        doc.end();
      } catch (error) {
        console.error('Erreur génération PDF:', error);
        reject(error);
      }
    });
  }

  private drawTwoColumnBox(
    doc: PDFDocument,
    x: number,
    y: number,
    width: number,
    title: string,
    items: string[]
  ): number {
    // Configuration
    const padding = 5;
    const lineHeight = 5;
    const columnGap = 10;
    const columnWidth = (width - columnGap) / 2;
    
    // Calcul de la hauteur nécessaire
    const itemsPerColumn = Math.ceil(items.length / 2);
    const boxHeight = Math.max(
      itemsPerColumn * lineHeight + padding * 2,
      40 // Hauteur minimale
    );

    // Style du titre
    doc.font('Helvetica-Bold').fontSize(7);

    // Dessin du cadre et titre
    doc.rect(x, y, width, boxHeight).stroke();
    doc.text(title, x + padding, y + padding, {
      width: width - padding * 2,
      align: 'center'
    });

    // Séparation en deux colonnes
    const column1Items = items.slice(0, Math.ceil(items.length / 2));
    const column2Items = items.slice(Math.ceil(items.length / 2));

    // Style du contenu
    doc.font('Helvetica').fontSize(6);

    // Colonne de gauche
    let currentY = y + padding + doc.currentLineHeight();
    column1Items.forEach(item => {
      doc.text(`• ${item}`, x + padding, currentY, {
        width: columnWidth,
        align: 'left'
      });
      currentY += lineHeight;
    });

    // Colonne de droite
    currentY = y + padding + doc.currentLineHeight();
    column2Items.forEach(item => {
      doc.text(`• ${item}`, x + columnWidth + columnGap, currentY, {
        width: columnWidth,
        align: 'left'
      });
      currentY += lineHeight;
    });

    return boxHeight; // Retourne la hauteur utilisée
  }
}

