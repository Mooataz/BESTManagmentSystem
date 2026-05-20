import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req, HttpException } from '@nestjs/common';
import { TypeModelService } from './type-model.service';
import { CreateTypeModelDto } from './dto/create-type-model.dto';
import { UpdateTypeModelDto } from './dto/update-type-model.dto';

@Controller('type-model')
export class TypeModelController {
  constructor(private readonly typeModelService: TypeModelService) {}

  @Post()
  async create( @Body() createTypeModelDto: CreateTypeModelDto,
                @Res() res: any, @Req() req: Request) {
                  /* const user = req.user; */
    try {
      const newType = await this.typeModelService.create(createTypeModelDto/* , user */)
      return res.status(HttpStatus.CREATED).json({
        message:"Type created Successfuly !",
        status:HttpStatus.CREATED,
        data:newType
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
  async findAll(@Res() res: any) {
    
    try {
      const allTypes = await this.typeModelService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Types founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
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
  async findOne( @Param('id') id: number,
                 @Res() res: any) {
   
    try {
      const oneType = await this.typeModelService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Type founded Successfuly !",
        status:HttpStatus.OK,
        data:oneType
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
  async update( @Param('id') id: number, 
                @Body() updateTypeModelDto: UpdateTypeModelDto,
                @Res() res: any) {
    try {
      const updateType = await this.typeModelService.update(+id, updateTypeModelDto)
      return res.status(HttpStatus.OK).json({
        message:"Type updated Successfuly !",
        status:HttpStatus.OK,
        data:updateType
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
  async remove( @Param('id') id: number,
                @Res() res: any) {
    try {
      const deleteType = await this.typeModelService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Type updated Successfuly !",
        status:HttpStatus.OK,
        data:deleteType
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
