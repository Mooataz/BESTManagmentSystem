import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoryRepairDto } from './dto/create-history-repair.dto';
import { UpdateHistoryRepairDto } from './dto/update-history-repair.dto';
import { HistoryRepair } from './entities/history-repair.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';

@Injectable()
export class HistoryRepairService {
  constructor ( @InjectRepository(HistoryRepair) private readonly  historyRepairRepositry:Repository<HistoryRepair>,
                @InjectRepository(Repair) private readonly  repairRepositry:Repository<Repair>,
               ){}

  async create(createHistoryRepairDto: CreateHistoryRepairDto ):Promise<HistoryRepair> {
    const repair = await this.repairRepositry.findOne({ where: {id: createHistoryRepairDto.repair}})
    if (!repair) throw new NotFoundException('repair not found');
   
    const newCreate = this.historyRepairRepositry.create({...createHistoryRepairDto, repair});

    return  await this.historyRepairRepositry.save(newCreate);
  }

  async findAll():Promise<HistoryRepair[]> {
    const allfind = await this.historyRepairRepositry.find()

    if (!allfind || allfind.length === 0) { throw new NotFoundException ("There is no data available")}
    return allfind
  }

  async findOne(id: number):Promise<HistoryRepair> {
    const Onefind= await this.historyRepairRepositry.findOne({ where: { id } })
    
    if ( !Onefind) { throw new NotFoundException("There is no data Available")}
    return Onefind  }

  async update(id: number, updateHistoryRepairDto: UpdateHistoryRepairDto):Promise<HistoryRepair> {
    let repair: Repair | undefined = undefined;
    if (updateHistoryRepairDto.repair !== undefined){
      const foundRepair = await this.repairRepositry.findOne({ where: { id: updateHistoryRepairDto.repair}});
      if (!foundRepair) { throw new NotFoundException('Repair not found')}
      repair = foundRepair;
    }

    const updateData: Partial<HistoryRepair> = {
      ...updateHistoryRepairDto,
      repair: repair
    } 

    await this.historyRepairRepositry.update(id,updateData);
    const updatedata = await this.historyRepairRepositry.findOne({where :{ id }})
    if (!updatedata) { throw new NotFoundException('data Not found for update = failed') }

    return updatedata 
  }

  async remove(id: number):Promise<HistoryRepair> {
    const deletedata = await this.historyRepairRepositry.findOne ({where: {id}});
    if (!deletedata) { throw new NotFoundException('data Not found for delete = failed')}
    
    await this.historyRepairRepositry.delete({ id: deletedata.id })
    return deletedata;  }

    async findByRepairId(repairId: number): Promise<HistoryRepair[]> {
      return this.historyRepairRepositry
          .createQueryBuilder('historyRepair')
          .leftJoinAndSelect('historyRepair.repair', 'repair')
          .where('repair.id = :repairId', { repairId }) // Filtre sur l'ID de repair
          .getMany();
  }
    
    
}
