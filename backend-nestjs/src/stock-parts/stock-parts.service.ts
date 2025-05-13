import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateStockPartDto } from './dto/create-stock-part.dto';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockPart } from './entities/stock-part.entity';
import { In, Repository } from 'typeorm';
import { AppService } from 'src/app.service';
import { Bin } from 'src/bin/entities/bin.entity';
import { AppModule } from 'src/app.module';
import { ModelsService } from 'src/models/models.service';
import { ReferencesService } from 'src/references/references.service';
import { Reference } from 'src/references/entities/reference.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Cron } from '@nestjs/schedule';
import cluster, * as Cluster from 'cluster';
import * as Lockfile from 'lockfile';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { plainToInstance } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
@Injectable({ scope: Scope.DEFAULT })
export class StockPartsService {
  private readonly LOCK_FILE = path.join(os.tmpdir(), 'stock-calculation.lock');
  private isRunning = false; // Verrou en mémoire pour single-instance
  constructor ( @InjectRepository(StockPart) private readonly  stockPartRepositry:Repository<StockPart>,
                @InjectRepository(Branch) private readonly  branchRepositry:Repository<Branch>,
                @InjectRepository(Bin) private readonly  binRepositry:Repository<Bin>,
                @InjectRepository(Company) private readonly  companyRepositry:Repository<Company>,
                  private appService: AppService,
                  private modelService:ModelsService,
                  private referenceService: ReferencesService ){}

  async create(createStockPartDto: CreateStockPartDto):Promise<StockPart> {
    createStockPartDto.serialNumber =this.appService.cleanSpaces(createStockPartDto.serialNumber)

    return await this.stockPartRepositry.save(createStockPartDto);
  }

  async findAll():Promise<StockPart[]> {
    const findAll = await this.stockPartRepositry.find()
    if (!findAll || findAll.length === 0){
      throw new NotFoundException('No data found')
    }
    return findAll;  }

  async findOne(id: number):Promise<StockPart> {
    const findOne = await this.stockPartRepositry.findOne({ where : { id } })
    if (!findOne){
      throw new NotFoundException('No data available')
    }
    return findOne;  }

  async update(id: number, updateStockPartDto: UpdateStockPartDto):Promise<StockPart> {
    await this.stockPartRepositry.update(id,updateStockPartDto);
    const updateData = await this.stockPartRepositry.findOne({ where : { id } })

    if (!updateData){
      throw new NotFoundException('data not found to update')
    }    
    return updateData;  }

  async remove(id: number):Promise<StockPart> {
    const deletedata = await this.stockPartRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data not found for delete')
    }
    await this.stockPartRepositry.delete({ id: deletedata.id })
    return deletedata;   }

    
    async filterByReferenceAndBin( referencesIds: number[], binId: number): Promise<StockPart[]>{
      const findAll = await this.stockPartRepositry
        .createQueryBuilder('stockPart')
        .leftJoinAndSelect('stockPart.reference', 'reference')
        .leftJoinAndSelect('stockPart.bin', 'bin')
        .where('bin.id = :binId', {binId})
        .andWhere('reference.id IN (:...referencesIds)', {referencesIds})
        .getMany();
      if (!findAll || findAll.length === 0) {
          throw new NotFoundException("There is no data Available") }
      return findAll
    }

    async findByBinId(binId: number): Promise<StockPart[]> {
      return this.stockPartRepositry
          .createQueryBuilder('StockPart')
          .leftJoinAndSelect('StockPart.bin', 'bin')
          .where('bin.id = :binId', { binId }) 
          .getMany();
  } 

  async findByBinType(type: string, branchId: number): Promise<StockPart[]> {
    return this.stockPartRepositry
        .createQueryBuilder('StockPart')
        .leftJoinAndSelect('StockPart.bin', 'bin')
        .leftJoinAndSelect('bin.branch', 'branch')
        .where('bin.type = :type', { type }) 
        .andWhere('branch.id = :branchId', { branchId })
        .getMany();
}
async findGoodReference(references:Reference[], branchId: number): Promise<StockPart[]> {
  const refIds = references.map(ref => ref.id); // EXTRACTION des ids
  const goodPart = await this.stockPartRepositry
    .createQueryBuilder('stockPart')
    .leftJoinAndSelect('stockPart.reference', 'ref')
    .leftJoinAndSelect('stockPart.bin', 'bin')
    .leftJoinAndSelect('bin.branch', 'branch')
    .where('bin.type = :type', { type: 'Good' })
    .andWhere('branch.id = :branchId', { branchId })
    .andWhere('ref.id IN (:...refIds)', {refIds})
    .getMany();
  return goodPart ;
}



@Cron('08 23 * * 7')
  async stateStock() {
    
   // Vérification du verrou en mémoire
   if (this.isRunning) {
    console.log('Calcul déjà en cours (verrou mémoire)');
    return;
  }

  // Verrou fichier pour multi-instances
  try {
    const fd = await fs.open(this.LOCK_FILE, 'wx');
    await fd.close();
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('Calcul déjà en cours (verrou fichier)');
      return;
    }
    throw error;
  }

  this.isRunning = true;
  const executionId = Date.now();

  try {
    console.log(`[${executionId}] Début du calcul du stock`);
    
    // ... votre logique de calcul existante ...
    console.log( 'debut:') 
    const allBranch = await this.branchRepositry.find();
    const models = await this.modelService.findAll();
  
    var stockByReference: {
      branchID: number;
      modelId: number;
      partId: number;
      count: number;
      //stockDetails: StockPart[];
    }[] = [];
  
    for ( const branch of allBranch){
      for (const model of models) {
        for (const part of model.allpart) {
            // Validation des IDs
            const branchId = Number(branch.id);
            const modelId = Number(model.id);
            const partId = Number(part.id);

            if (isNaN(branchId)) throw new Error(`ID de branche invalide: ${branch.id}`);
            if (isNaN(modelId)) throw new Error(`ID de modèle invalide: ${model.id}`);
            if (isNaN(partId)) throw new Error(`ID de pièce invalide: ${part.id}`);
          const findCompRefe = await this.referenceService.findCompatibleReferences(model.id, part.id);
          const counter = await this.findGoodReference(findCompRefe, branch.id);
              // Validation du compteur
              const count = Number(counter.length);
              if (isNaN(count)) {
                console.error('Compteur invalide pour:', { branchId, modelId, partId });
                continue; // ou throw selon votre besoin
              }
            
               
              const stockPartWithCompany = await this.stockPartRepositry
                .createQueryBuilder('stockPart')
                .leftJoin('stockPart.bin', 'bin')
                .leftJoin('bin.branch', 'branch')
                .leftJoin('branch.company', 'company')
                .where('stockPart.id = :stockPartId', { stockPartId: part.id }) // Remplace "id" par l'ID réel du stockPart
                .select(['company.quantityAlertStock'])
                .getRawOne();

              const quantityAlertStock = stockPartWithCompany?.company_quantityAlertStock;
              //console.log('quantityAlertStock:', quantityAlertStock);

              if(counter.length <= quantityAlertStock){
                stockByReference.push({
                  branchID:branch.id,
                  modelId: model.id,
                  partId: part.id,
                  count: counter.length, /* stockDetails: counter */ });

                  // Ici ajouter Notification par firebase , la notification sera envoyer à l'Admin et StocKeeper de l'agence 
              }


             
              
        }
      }
    } 
    console.log(`[${executionId}] Résultat:`, stockByReference);
     return stockByReference;
     

     
  } catch (error) {
    console.error(`[${executionId}] Erreur lors du calcul:`, error);
        throw {
          message: 'Erreur lors du calcul du stock',
          status: 500,
          data: null
        };
  } finally {
    this.isRunning = false;
    try {
      await fs.unlink(this.LOCK_FILE);
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') {
        console.error('Erreur lors du nettoyage du verrou:', cleanupError);
      }
    }
  }
      
    
  }
}





