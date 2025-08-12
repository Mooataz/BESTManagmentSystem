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
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { StockGateway } from './Stock.Gateway';
import { User } from 'src/users/entities/user.entity';

 

@Injectable({ scope: Scope.DEFAULT })
export class StockPartsService {
  private readonly LOCK_FILE = path.join(os.tmpdir(), 'stock-calculation.lock');
  private isRunning = false; // Verrou en mémoire pour single-instance
  constructor ( @InjectRepository(StockPart) private readonly  stockPartRepositry:Repository<StockPart>,
                @InjectRepository(Branch) private readonly  branchRepositry:Repository<Branch>,
                @InjectRepository(Bin) private readonly  binRepositry:Repository<Bin>,
                @InjectRepository(Company) private readonly  companyRepositry:Repository<Company>,
                @InjectRepository(HistoryStockPart) private readonly historyStockPartRepositry:Repository<HistoryStockPart>,
                @InjectRepository(Tracability) private readonly tracabilityRepositry:Repository<Tracability>,
                   @InjectRepository(User) private readonly UserRepositry:Repository<User>,
                   private appService: AppService,
                  private modelService:ModelsService,
                  private referenceService: ReferencesService,
                private PDFService: PdfService,
               private StockGateway: StockGateway, ){}

  async create(createStockPartDto: CreateStockPartDto, userId: number):Promise<StockPart> {
    createStockPartDto.serialNumber =this.appService.cleanSpaces(createStockPartDto.serialNumber)
const newCreate =  this.stockPartRepositry.create(createStockPartDto);
 const saveStockPart =   await this.stockPartRepositry.save(newCreate);

 const history = this.historyStockPartRepositry.create({
      date: new Date(),
      step: 'Création',
      stockPart: { id: saveStockPart.id },
    });

    const savedHistory = await this.historyStockPartRepositry.save(history);


     const tracability = this.tracabilityRepositry.create({
      historyStockPart: { id: savedHistory.id },
      user: { id: userId },
    });
    await this.tracabilityRepositry.save(tracability);
    return saveStockPart
  }

  async findAll():Promise<StockPart[]> {
    const findAll = await this.stockPartRepositry.find({relations:[
      'bin',
      'reference','reference.model','reference.model.brand','reference.allpart',
      'historyStockPart','historyStockPart.tracability','historyStockPart.tracability.user'
    ]})
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

async findByBranchId(branchId: number): Promise<StockPart[]> {
  return this.stockPartRepositry
    .createQueryBuilder('stockPart')
    .leftJoinAndSelect('stockPart.bin', 'bin')
    .leftJoinAndSelect('bin.branch', 'branch')
    .leftJoinAndSelect('stockPart.reference', 'reference')
    .leftJoinAndSelect('reference.model', 'model')
    .leftJoinAndSelect('model.brand', 'brand')
    .leftJoinAndSelect('reference.allpart', 'allpart')
    .leftJoinAndSelect('stockPart.historyStockPart', 'historyStockPart')
    .leftJoinAndSelect('historyStockPart.tracability', 'tracability')
    .leftJoinAndSelect('tracability.user', 'user')
    .where('branch.id = :branchId', { branchId })
    .orderBy('stockPart.id', 'DESC')  // ← Ajout du tri ici
    .getMany();
}


 

  async findByBinType(type: string, branchId: number): Promise<StockPart[]> {
    return this.stockPartRepositry
        .createQueryBuilder('StockPart')
        .leftJoinAndSelect('StockPart.bin', 'bin')
        .leftJoinAndSelect('bin.branch', 'branch')
        .leftJoinAndSelect('StockPart.reference', 'reference')
        .leftJoinAndSelect('reference.allpart', 'allpart')
        .leftJoinAndSelect('reference.model', 'model')
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



/* @Cron('00 10 * * 5') */
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
  
    /* for ( const branch of allBranch){
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
                  count: counter.length,  stockDetails: counter   });

                  // Ici ajouter Notification par firebase , la notification sera envoyer à l'Admin et StocKeeper de l'agence 
              }


             
              
        }
      }
    }  */
   for (const branch of allBranch) {
  const branchCriticalParts: {
    modelId: number;
    modelName: string;
    partId: number;
    partName: string;
    count: number;
  }[] = [];
  for (const model of models) {
    for (const part of model.allpart) {
      const counter = await this.findGoodReference(
        await this.referenceService.findCompatibleReferences(model.id, part.id),
        branch.id,
      );
      const count = Number(counter.length);
      if (isNaN(count)) continue;
      const quantityAlertStock = (
        await this.stockPartRepositry
          .createQueryBuilder('stockPart')
          .leftJoin('stockPart.bin', 'bin')
          .leftJoin('bin.branch', 'branch')
          .leftJoin('branch.company', 'company')
          .where('stockPart.id = :stockPartId', { stockPartId: part.id })
          .select(['company.quantityAlertStock'])
          .getRawOne()
      )?.company_quantityAlertStock;
      if (count <= quantityAlertStock) {
        // :épingle: On ajoute les infos dans un tableau
        branchCriticalParts.push({
          modelId: model.id,
          modelName: model.name,
          partId: part.id,
          partName: part.description,
          count,
        });
      }
    }
  }
  // Si cette branche a des pièces critiques, on génère le PDF + envoie notif
  if (branchCriticalParts.length > 0) {
    // :coche_blanche: Générer PDF
    const pdfPath = await this.PDFService.generateStockReport(branch.id, branchCriticalParts);
    // :haut_parleur: Notifier les utilisateurs
    const usersToNotify = await this.UserRepositry
      .createQueryBuilder('user')
      .innerJoin('user.branch', 'branch')
      .where('branch.id = :branchId', { branchId: branch.id })
      .andWhere('user.role IN (:...roles)', { roles: ['Admin', 'StockKeeper'] })
      .getMany();
    const userIds = usersToNotify.map((u) => u.id);
    await this.StockGateway.sendStockAlertToUsers(userIds, {
      branchId: branch.id,
      reportUrl: `/uploads/stock-report-branch-${branch.id}.pdf`, // :nouveau:
      message: `:danger: Rapport de stock critique généré pour la branche ${branch.id}`,
    });
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





