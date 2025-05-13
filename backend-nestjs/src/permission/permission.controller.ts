import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto, @Res() res) {
    
    try {
          const newPermission = await this.permissionService.create(createPermissionDto)
          return res.status(HttpStatus.CREATED).json({
            message:"Permission created Successfuly !",
            status:HttpStatus.CREATED,
            data:newPermission
          })
        } catch (error) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message:error.message,
            status:HttpStatus.BAD_REQUEST,
            data:null
          })
        }

  }

  @Get()
  async findAll(@Res() res) {
    
    try {
      const allPermissions = await this.permissionService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Permissions founded Successfuly !",
        status:HttpStatus.OK,
        data:allPermissions
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    
    try {
      const onePermissions = await this.permissionService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Permission founded Successfuly !",
        status:HttpStatus.OK,
        data:onePermissions
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePermissionDto: UpdatePermissionDto, @Res() res) {
    try {
      const updatePermission = await this.permissionService.update(+id, updatePermissionDto)
      return res.status(HttpStatus.OK).json({
        message:"Permission updated Successfuly !",
        status:HttpStatus.OK,
        data:updatePermission
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    try {
      const deletePermission = await this.permissionService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Permission deleted Successfuly !",
        status:HttpStatus.OK,
        data:deletePermission
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
}
