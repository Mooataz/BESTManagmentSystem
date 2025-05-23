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
                  @InjectRepository(Brand) private readonly  brandRepositry:Repository<Brand>,
                  @InjectRepository(TypeModel) private readonly  typeModelRepositry:Repository<TypeModel>,
                                  private appService: AppService ){}
  
    async create(createModelDto: CreateModelDto):Promise<Model> {
      createModelDto.name =this.appService.cleanSpaces(createModelDto.name)
    
      const brand = createModelDto.brand ? await this.brandRepositry.findOne({ where: { id: createModelDto.brand } }):undefined;
      if (!brand) { throw new NotFoundException("No valid brand found.");}
     
      const typeModel = createModelDto.brand ? await this.typeModelRepositry.findOne({ where: { id: createModelDto.typeModel } }):undefined;
      if (!typeModel) { throw new NotFoundException("No Type model found.");}

    const allpart = await this.allPartRepositry.find( { where : { id : In(createModelDto.allpartIds)}})
      const createNew = this.modelRepositry.create( { ...createModelDto, brand, allpart, typeModel})
      
      return await this.modelRepositry.save(createNew);
  }

  async findAll():Promise<Model[]>  {
    const findAll = await this.modelRepositry.find({
      relations: ['allpart', 'brand', 'typeModel'], // 🔥 Charge les pièces associées au modèle
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
      // Find existing model
  const existingModel = await this.modelRepositry.findOne({
    where: { id },
    relations: ['brand', 'typeModel', 'allpart']
  });
  
  if (!existingModel) {
    throw new NotFoundException('Model not found');
  }
  
  const updateData: Partial<Model> = {};
     if (updateModelDto.name) {
    updateData.name = this.appService.cleanSpaces(updateModelDto.name);
  }

   // Handle picture update
  if (updateModelDto.picture) {
    updateData.picture = updateModelDto.picture;
  }
  // Handle brand update
  if (updateModelDto.brand) {
    const brand = await this.brandRepositry.findOne({ 
      where: { id: updateModelDto.brand } 
    });
    if (!brand) {
      throw new NotFoundException("No valid brand found.");
    }
    updateData.brand = brand;
  }

  // Handle typeModel update
  if (updateModelDto.typeModel) {
    const typeModel = await this.typeModelRepositry.findOne({ 
      where: { id: updateModelDto.typeModel } 
    });
    if (!typeModel) {
      throw new NotFoundException("No Type model found.");
    }
    updateData.typeModel = typeModel;
  }
  // Handle allpartIds update
  if (updateModelDto.allpartIds) {
    const allpart = await this.allPartRepositry.find({ 
      where: { id: In(updateModelDto.allpartIds) } 
    });
    existingModel.allpart = allpart;
  }
  // Merge changes
  Object.assign(existingModel, updateData);

   return  await this.modelRepositry.save(existingModel);
     
  
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

