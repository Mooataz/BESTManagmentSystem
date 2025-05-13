import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class BrandsService {
  constructor ( @InjectRepository(Brand) private readonly  brandRepositry:Repository<Brand>,
                private appService: AppService
){}

  async create(createBrandDto: CreateBrandDto):Promise<Brand> {
    createBrandDto.name =this.appService.cleanSpaces(createBrandDto.name)
    return await this.brandRepositry.save(createBrandDto);
  }

  async findAll():Promise<Brand[]> {
    const allBrands= await this.brandRepositry.find()
      if ( !allBrands || allBrands.length === 0){
        throw new NotFoundException("There is no brands data Available")
      }
      return allBrands
  }

  async findOne(id: number):Promise<Brand> {
    const OneBrand= await this.brandRepositry.findOne({ where: { id } })
    if ( !OneBrand){
      throw new NotFoundException("There is no brand data Available")
    }
    return OneBrand
  }
  

  async update(id: number, updateBrandDto: UpdateBrandDto):Promise<Brand> {
    await this.brandRepositry.update(id,updateBrandDto);
    const updatedata = await this.brandRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('Brand Not found for update = failed')
    }

    return updatedata
  }

  async remove(id: number):Promise<Brand> {
    const deletedata = await this.brandRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Brand Not found for delete = failed')
    }
    await this.brandRepositry.delete({ id: deletedata.id })
    return deletedata;
  }

async findByStatus(status: string): Promise<Brand[]> {
  const findAll = await this.brandRepositry
            .createQueryBuilder('approveStock')
            .where('status = :status', { status }) // Filtre sur l'ID de repair
            .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
  return findAll
    }
}
