import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTracabilityDto } from './dto/create-tracability.dto';
import { UpdateTracabilityDto } from './dto/update-tracability.dto';
import { Tracability } from './entities/tracability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TracabilityService {
  constructor ( @InjectRepository(Tracability) private readonly  tracabilityRepositry:Repository<Tracability>,
                @InjectRepository(HistoryRepair) private readonly  historyRepairRepositry:Repository<HistoryRepair>,
                @InjectRepository(HistoryStockPart) private readonly  historyStockPartRepositry:Repository<HistoryStockPart>,
                @InjectRepository(User) private readonly  userRepositry:Repository<User>,
){}
  
async create(createTracabilityDto: CreateTracabilityDto): Promise<Tracability> {
  const user = await this.userRepositry.findOne({ where: { id: createTracabilityDto.user } });
  if (!user) throw new NotFoundException('User not found');

  let historyRepair: HistoryRepair | undefined = undefined;
  if (createTracabilityDto.historyRepair) {
   const  historyRepair = await this.historyRepairRepositry.findOne({ where: { id: createTracabilityDto.historyRepair } });
    if (!historyRepair) throw new NotFoundException('HistoryRepair not found');
  }

  let historyStockPart: HistoryStockPart | undefined = undefined;
  if (createTracabilityDto.historyStockPart) {
    const historyStockPart = await this.historyStockPartRepositry.findOne({ where: { id: createTracabilityDto.historyStockPart } });
    if (!historyStockPart) throw new NotFoundException('HistoryStockPart not found');
  }

  const tracabilityData: DeepPartial<Tracability> = {
    user,
    historyRepair,
    historyStockPart,
  };

  const newCreate = this.tracabilityRepositry.create(tracabilityData);
  return await this.tracabilityRepositry.save(newCreate);
}


  async findAll():Promise<Tracability[]> {
     const findAll= await this.tracabilityRepositry.find()
          if ( !findAll || findAll.length === 0){
            throw new NotFoundException("There is no data Available")
          }
          return findAll
  }

  async findOne(id: number):Promise<Tracability> {
    const findOne= await this.tracabilityRepositry.findOne({ where: { id } ,
      relations: ['user','historyRepair']})
    if ( !findOne){
      throw new NotFoundException("There is no data Available")
    }
    return findOne
  }
  

  async update(id: number, updateTracabilityDto: UpdateTracabilityDto): Promise<Tracability> {
    const tracability = await this.tracabilityRepositry.findOne({ where: { id } });
    if (!tracability) {
        throw new NotFoundException('Tracability record not found');
    }

    // Récupérer les entités liées si des IDs sont fournis
    const historyRepair = updateTracabilityDto.historyRepair 
        ? await this.historyRepairRepositry.findOne({ where: { id: updateTracabilityDto.historyRepair } }) 
        : tracability.historyRepair;
        
    const historyStockPart = updateTracabilityDto.historyStockPart 
        ? await this.historyStockPartRepositry.findOne({ where: { id: updateTracabilityDto.historyStockPart } }) 
        : tracability.historyStockPart;
    
    const user = updateTracabilityDto.user 
        ? await this.userRepositry.findOne({ where: { id: updateTracabilityDto.user } }) 
        : tracability.user;

    // Vérification des entités récupérées
    if (updateTracabilityDto.historyRepair && !historyRepair) {
        throw new NotFoundException('HistoryRepair not found');
    }
    if (updateTracabilityDto.historyStockPart && !historyStockPart) {
        throw new NotFoundException('HistoryStockPart not found');
    }
    if (updateTracabilityDto.user && !user) {
        throw new NotFoundException('User not found');
    }

    // Création de l'objet de mise à jour
    const updateData: DeepPartial<Tracability> = {
      historyRepair: historyRepair || undefined,
      historyStockPart: historyStockPart || undefined,
      user: user || undefined,
  };
  

    // Mise à jour des données
    await this.tracabilityRepositry.update(id, updateData);

    // Récupérer et retourner les nouvelles données mises à jour
    const updatedData = await this.tracabilityRepositry.findOne({ where: { id } });
    if (!updatedData) {
        throw new NotFoundException('Data not found after update');
    }

    return updatedData;
}


  async remove(id: number):Promise<Tracability> {
    const deletedata = await this.tracabilityRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.tracabilityRepositry.delete({ id: deletedata.id })
    return deletedata;  }

   

    async findByHistoryRepairId(historyRepairId: number): Promise<Tracability> {
      if (isNaN(historyRepairId)) {
        throw new BadRequestException('Invalid historyRepair ID - must be a number');
      }
      const tracability = await this.tracabilityRepositry
        .createQueryBuilder('tracability')
        .leftJoinAndSelect('tracability.historyRepair', 'historyRepair')
       //.leftJoinAndSelect('tracability.historyStockPart', 'historyStockPart')
        //.leftJoinAndSelect('tracability.user', 'user')
        .where('historyRepair.id = :historyRepairId', { historyRepairId })
        .getOne();
    
      if (!tracability) {
        throw new NotFoundException(`Tracability with historyRepair ID ${historyRepairId} not found`);
      }
    
      return tracability;
    }
   
    async findByHistoryStockPartId(historyStockPartId: number): Promise<Tracability> {
      if (isNaN(historyStockPartId)) {
        throw new BadRequestException('Invalid historyRepair ID - must be a number');
      }
      const tracability = await this.tracabilityRepositry
        .createQueryBuilder('tracability')
        .leftJoinAndSelect('tracability.historyStockPartId', 'historyStockPartId')
        .where('historyStockPartId.id = :historyStockPartId', { historyStockPartId })
        .getOne();
    
      if (!tracability) {
        throw new NotFoundException(`Tracability with historyRepair ID ${historyStockPartId} not found`);
      }
    
      return tracability;
    }  
    
   
}
