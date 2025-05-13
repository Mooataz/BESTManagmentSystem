import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';
import { PartsPrice } from './entities/parts-price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';

@Injectable()
export class PartsPriceService {
  constructor ( @InjectRepository(PartsPrice) private readonly  partsPriceRepositry:Repository<PartsPrice>,
                @InjectRepository(Model) private readonly  modelRepositry:Repository<Model>,
                @InjectRepository(AllPart) private readonly  allPartRepositry:Repository<AllPart>,
                @InjectRepository(LevelRepair) private readonly  levelRepairRepositry:Repository<LevelRepair>
              ){}

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
    const findAll = await this.partsPriceRepositry.find()
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

  async findByModelallPArt ( modelId : number, allPartId : number ):Promise<PartsPrice>{
     const find = await this.partsPriceRepositry.findOne( { where : 
                                                                    { model: { id: modelId}, 
                                                                      allPart: {id: allPartId}, }, 

                                                            relations: ['model', 'allPart'],});

                                                 
  if (!find) { throw new NotFoundException('Data not founded by this Ids')}
                                              
     return find
  }
}
