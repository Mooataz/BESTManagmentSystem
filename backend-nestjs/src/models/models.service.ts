import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './entities/model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TypeModel } from 'src/type-model/entities/type-model.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class ModelsService {
    constructor ( @InjectRepository(Model) private readonly  modelRepositry:Repository<Model>,
                  @InjectRepository(AllPart) private readonly  allPartRepositry:Repository<AllPart>,
                                  private appService: AppService ){}
  
    async create(createModelDto: CreateModelDto):Promise<Model> {
      createModelDto.name =this.appService.cleanSpaces(createModelDto.name)

      const allpart = await this.allPartRepositry.find( { where : { id : In(createModelDto.allpartIds)}})
      const createNew = this.modelRepositry.create( { ...createModelDto, allpart})
      
      return await this.modelRepositry.save(createNew);
  }

  async findAll():Promise<Model[]>  {
    const findAll = await this.modelRepositry.find({
      relations: ['allpart'], // 🔥 Charge les pièces associées au modèle
    })
    if (!findAll || findAll.length === 0){
      throw new NotFoundException('No models found')
    }
    return findAll;
  }

  async findOne(id: number):Promise<Model>  {
    const findOne = await this.modelRepositry.findOne({ where : { id } })
    if (!findOne){
      throw new NotFoundException('No model found')
    }
    return findOne;
  }

  async update(id: number, updateModelDto: UpdateModelDto):Promise<Model>  {
    
     await this.modelRepositry.update(id,updateModelDto);
    const updatedata = await this.modelRepositry.findOne({where : {id}})

    if (!updatedata) {
      throw new NotFoundException('Model not found for update')
    }

    return updatedata 
  }

  async remove(id: number):Promise<Model>  {
    const deletedata = await this.modelRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Brand Not found for delete = failed')
    }
    await this.modelRepositry.delete({ id: deletedata.id })
    return deletedata;
  }

  async findByBrandId(brandId: number): Promise<Model[]> {
    const findAll = await this.modelRepositry
          .createQueryBuilder("model")
          .leftJoinAndSelect("model.brand", "brand")
          .where("brand.id = :brandId", { brandId })
          .getMany();
    if (!findAll || findAll.length === 0) {
          throw new NotFoundException("There is no data Available") }
      return findAll
  }

  async findByTypeModelId(typeModelId: number): Promise<Model[]> {
    const findAll = await this.modelRepositry
          .createQueryBuilder("model")
          .leftJoinAndSelect("model.typeModel", "typeModel")
          .where("typeModel.id = :typeModelId", { typeModelId })
          .getMany();
    if (!findAll || findAll.length === 0) {
          throw new NotFoundException("There is no data Available") }
      return findAll
  }
}

