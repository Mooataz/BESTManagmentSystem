import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AccessoryService } from './accessory.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Controller('accessory')
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) { }

  @Post()
  async create(@Body() createAccessoryDto: CreateAccessoryDto,
    @Res() res:any) {
    try {
      const newcreate = await this.accessoryService.create(createAccessoryDto)
      return res.status(HttpStatus.CREATED).json({
        message:"created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate
      })
    }   catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        message: error.message,
        status: error.getStatus(),
        data: null,
      })
    }
  
    throw error
  }
  }

  @Get()
  async findAll(@Res() res:any) {
    try {
      const allfind = await  this.accessoryService.findAll();
      return res.status(HttpStatus.OK).json({
        message:" founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind
      })
    }   catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        message: error.message,
        status: error.getStatus(),
        data: null,
      })
    }
  
    throw error
  }
  }

  @Get(':id')
  async findOne(@Param('id') id: number,
    @Res() res:any) {
    try {
      const onefind = await this.accessoryService.findOne(+id);
      return res.status(HttpStatus.OK).json({
        message:"One  founded Successfuly !",
        status:HttpStatus.OK,
        data:onefind
      })
    }   catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        message: error.message,
        status: error.getStatus(),
        data: null,
      })
    }
  
    throw error
  }
  }

  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updateAccessoryDto: UpdateAccessoryDto,
    @Res() res:any) {
    try {
      const updatedata = await this.accessoryService.update(+id, updateAccessoryDto)
      return res.status(HttpStatus.OK).json({
        message:" updated Successfuly !",
        status:HttpStatus.OK,
        data:updatedata
      })
    }   catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        message: error.message,
        status: error.getStatus(),
        data: null,
      })
    }
  
    throw error
  }
  }

  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res() res:any) {
    try {
      const deletedata = await this.accessoryService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:" deleted Successfuly !",
        status:HttpStatus.OK,
        data:deletedata
      })
    }   catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        message: error.message,
        status: error.getStatus(),
        data: null,
      })
    }
  
    throw error
  }
  }
}
