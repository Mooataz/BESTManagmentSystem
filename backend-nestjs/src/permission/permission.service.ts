import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor ( @InjectRepository(Permission) private readonly  permissionRepositry:Repository<Permission>){}
  
  async create(createPermissionDto: CreatePermissionDto):Promise<Permission> {
    return await this.permissionRepositry.save(createPermissionDto);
  }

  async findAll():Promise<Permission[]> {
    const allPermissions = await this.permissionRepositry.find()
    if (!allPermissions || allPermissions.length === 0) {
      throw new NotFoundException ('There is no permissions available')
    }
    return allPermissions;
  }

  async findOne(id: number):Promise<Permission> {
    const onePermission = await this.permissionRepositry.findOne({ where : { id } })
    if (!onePermission){
      throw new NotFoundException('No permission available')
    }
    return onePermission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto):Promise<Permission> {
    await this.permissionRepositry.update(id,updatePermissionDto);
    const updateData = await this.permissionRepositry.findOne({ where : { id } })

    if (!updateData){
      throw new NotFoundException('Permission not found to update')
    }    
    return updateData;
  }

  async remove(id: number):Promise<Permission> {
    const deletedata = await this.permissionRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Permission  Not found for delete')
    }
    await this.permissionRepositry.delete({ id: deletedata.id })
    return deletedata;
  }
}
