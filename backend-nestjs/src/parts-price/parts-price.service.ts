import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';
import { PartsPrice } from './entities/parts-price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';
import * as ExcelJS from 'exceljs';

export interface ImportRow {
  brandName: string;
  modelName: string;
  allPartDescription: string;
  price: number;
  levelRepairName?: string;
}

@Injectable()
export class PartsPriceService {
  constructor ( @InjectRepository(PartsPrice) private readonly  partsPriceRepositry:Repository<PartsPrice>,
                @InjectRepository(Model) private readonly  modelRepositry:Repository<Model>,
                @InjectRepository(AllPart) private readonly  allPartRepositry:Repository<AllPart>,
                @InjectRepository(LevelRepair) private readonly  levelRepairRepositry:Repository<LevelRepair>
              ){}

    async getReferences() {
        const [brands, models, allParts, levelRepairs] = await Promise.all([
          this.partsPriceRepositry.manager.query('SELECT DISTINCT name FROM brand ORDER BY name ASC'),
          this.modelRepositry.find({ order: { name: 'ASC' } }),
          this.allPartRepositry.find({ order: { description: 'ASC' } }),
          this.levelRepairRepositry.find({ order: { name: 'ASC' } }),
        ]);
        return {
            brands: brands.map((b: any) => b.name),
            models: models.map((m: any) => m.name),
            allParts: allParts.map((a: any) => a.description),
            levelRepairs: levelRepairs.map((l: any) => l.name),
        };
  }

  async generateTemplate(): Promise<any> {
    const refs = await this.getReferences();
    const workbook = new ExcelJS.Workbook();

    const sheet1 = workbook.addWorksheet('Modèle');
    sheet1.columns = [
      { header: 'Marque', key: 'brandName', width: 20 },
      { header: 'Modèle', key: 'modelName', width: 25 },
      { header: 'Pièce', key: 'allPartDescription', width: 30 },
      { header: 'Prix', key: 'price', width: 15 },
      { header: 'Niveau de réparation', key: 'levelRepairName', width: 20 },
    ];
    sheet1.addRow({ brandName: '', modelName: '', allPartDescription: '', price: '', levelRepairName: '' });
    sheet1.getRow(1).font = { bold: true };

    const sheet2 = workbook.addWorksheet('Références');
    let rowNum = 1;
    sheet2.getCell(rowNum, 1).value = 'Marques';
    sheet2.getCell(rowNum, 1).font = { bold: true };
    rowNum++;
    refs.brands.forEach((b: string, i: number) => { sheet2.getCell(rowNum + i, 1).value = b; });
    rowNum += refs.brands.length + 1;

    sheet2.getCell(rowNum, 1).value = 'Modèles';
    sheet2.getCell(rowNum, 1).font = { bold: true };
    rowNum++;
    refs.models.forEach((m: string, i: number) => { sheet2.getCell(rowNum + i, 1).value = m; });
    rowNum += refs.models.length + 1;

    sheet2.getCell(rowNum, 1).value = 'Pièces';
    sheet2.getCell(rowNum, 1).font = { bold: true };
    rowNum++;
    refs.allParts.forEach((p: string, i: number) => { sheet2.getCell(rowNum + i, 1).value = p; });
    rowNum += refs.allParts.length + 1;

    sheet2.getCell(rowNum, 1).value = 'Niveaux de réparation';
    sheet2.getCell(rowNum, 1).font = { bold: true };
    rowNum++;
    refs.levelRepairs.forEach((l: string, i: number) => { sheet2.getCell(rowNum + i, 1).value = l; });

    return await workbook.xlsx.writeBuffer();
  }

  async create(createPartsPriceDto: CreatePartsPriceDto):Promise<PartsPrice> {
   
   const model = await this.modelRepositry.findOne({ where: { id: createPartsPriceDto.modelId }, });
  if (!model) { throw new NotFoundException(`Model with ID ${createPartsPriceDto.modelId} not found`);}

  // Chargez l'entité AllPart à partir de allPartId
  const allPart = await this.allPartRepositry.findOne({ where: { id: createPartsPriceDto.allPartId }, });
  if (!allPart) { throw new NotFoundException(`AllPart with ID ${createPartsPriceDto.allPartId} not found`);}

  const levelRepair = await this.levelRepairRepositry.findOne({ where: { id: createPartsPriceDto.laborCharge}})
  if (!levelRepair) { throw new NotFoundException('Level repair not found')};

  // Créez une nouvelle instance de PartsPrice
  const partsPrice = this.partsPriceRepositry.create({ ...createPartsPriceDto, model,  allPart, levelRepair});
  
  // Sauvegardez l'entité PartsPrice
  return this.partsPriceRepositry.save(partsPrice);
  }

  async findAll():Promise<PartsPrice[]> {
    const findAll = await this.partsPriceRepositry.find({       relations:['model','model.brand','allPart','levelRepair']})
    if (!findAll || findAll.length === 0){
      throw new NotFoundException('No data found')
    }
    return findAll;
  }

  async findOne(id: number):Promise<PartsPrice> {
    const findOne = await this.partsPriceRepositry.findOne({ where : { id } })
    if (!findOne){
      throw new NotFoundException('No data available')
    }
    return findOne;  }

  async update(id: number, updatePartsPriceDto: UpdatePartsPriceDto):Promise<PartsPrice> {
    await this.partsPriceRepositry.update(id,updatePartsPriceDto);
    const updateData = await this.partsPriceRepositry.findOne({ where : { id } })

    if (!updateData){
      throw new NotFoundException('Data not found to update')
    }    
    return updateData;  }

  async remove(id: number):Promise<PartsPrice> {
    const deletedata = await this.partsPriceRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Data not found for delete')
    }
    await this.partsPriceRepositry.delete({ id: deletedata.id })
    return deletedata;
  }

  async importExcel(rows: ImportRow[]): Promise<{ imported: number; errors: string[] }> {
    let imported = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        if (!row.brandName || !row.modelName || !row.allPartDescription || row.price == null) {
          errors.push(`Ligne ${i + 1}: Données incomplètes`);
          continue;
        }

        const model = await this.modelRepositry.findOne({
          where: { name: row.modelName, brand: { name: row.brandName } },
          relations: ['brand'],
        });
        if (!model) {
          errors.push(`Ligne ${i + 1}: Modèle "${row.modelName}" (${row.brandName}) introuvable`);
          continue;
        }

        const allPart = await this.allPartRepositry.findOne({
          where: { description: row.allPartDescription },
        });
        if (!allPart) {
          errors.push(`Ligne ${i + 1}: Pièce "${row.allPartDescription}" introuvable`);
          continue;
        }

        let levelRepair: LevelRepair | null = null;
        if (row.levelRepairName) {
          levelRepair = await this.levelRepairRepositry.findOne({
            where: { name: row.levelRepairName },
          });
          if (!levelRepair) {
            errors.push(`Ligne ${i + 1}: Niveau réparation "${row.levelRepairName}" introuvable`);
            continue;
          }
        }

        let partsPrice = await this.partsPriceRepositry.findOne({
          where: { model: { id: model.id }, allPart: { id: allPart.id } },
        });

        if (partsPrice) {
          partsPrice.price = row.price;
          if (levelRepair) partsPrice.levelRepair = levelRepair;
          await this.partsPriceRepositry.save(partsPrice);
        } else {
          partsPrice = this.partsPriceRepositry.create({
            price: row.price,
            model,
            allPart,
            levelRepair: levelRepair ?? undefined,
          });
          await this.partsPriceRepositry.save(partsPrice);
        }
        imported++;
      } catch (err: any) {
        errors.push(`Ligne ${i + 1}: ${err.message}`);
      }
    }

    return { imported, errors };
  }

  async findByModelallPArt ( modelId : number, allPartId : number ):Promise<PartsPrice>{
     const find = await this.partsPriceRepositry.findOne( { where : 
                                                                    { model: { id: modelId}, 
                                                                      allPart: {id: allPartId}, }, 

                                                            relations: ['model', 'allPart'],});

                                                 
  if (!find) { throw new NotFoundException('Data not founded by this Ids')}
                                              
     return find
  }
}
