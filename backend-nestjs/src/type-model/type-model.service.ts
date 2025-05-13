import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeModelDto } from './dto/create-type-model.dto';
import { UpdateTypeModelDto } from './dto/update-type-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeModel } from './entities/type-model.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
import { User } from 'src/users/entities/user.entity';
import { hasAnyRole } from 'src/utils/role.utils';

@Injectable()
export class TypeModelService {
      constructor ( @InjectRepository(TypeModel) private readonly  typeModelRepositry:Repository<TypeModel>,
                    //@InjectRepository(User) private readonly userRepositry:Repository<User>,
                      private appService: AppService ){}

  async create(createTypeModelDto: CreateTypeModelDto, /* user: any */):Promise<TypeModel> {
    /* if (!hasAnyRole(user, ['Technician', 'Admin'])) {
      throw new ForbiddenException('Accès refusé à la creation de réparation.');
    } */
    createTypeModelDto.description =this.appService.cleanSpaces(createTypeModelDto.description)

    return await this.typeModelRepositry.save(createTypeModelDto);
  }

  async findAll():Promise<TypeModel[]> {
    const findAll = await this.typeModelRepositry.find()
    if (!findAll || findAll.length === 0){
      throw new NotFoundException('No Type model found')
    }
    return findAll;
    
  }

  async findOne(id: number):Promise<TypeModel> {
    const findOne = await this.typeModelRepositry.findOne({ where : { id } })
    if (!findOne){
      throw new NotFoundException('No type available')
    }
    return findOne;
  }

  async update(id: number, updateTypeModelDto: UpdateTypeModelDto):Promise<TypeModel> {
    await this.typeModelRepositry.update(id,updateTypeModelDto);
    const updateData = await this.typeModelRepositry.findOne({ where : { id } })

    if (!updateData){
      throw new NotFoundException('Type not found to update')
    }    
    return updateData;
  }
  

  async remove(id: number):Promise<TypeModel> {
    const deletedata = await this.typeModelRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Type not found for delete')
    }
    await this.typeModelRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
