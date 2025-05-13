import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req } from '@nestjs/common';
import { TypeModelService } from './type-model.service';
import { CreateTypeModelDto } from './dto/create-type-model.dto';
import { UpdateTypeModelDto } from './dto/update-type-model.dto';

@Controller('type-model')
export class TypeModelController {
  constructor(private readonly typeModelService: TypeModelService) {}

  @Post()
  async create( @Body() createTypeModelDto: CreateTypeModelDto,
                @Res() res, @Req() req: Request) {
                  /* const user = req.user; */
    try {
      const newType = await this.typeModelService.create(createTypeModelDto/* , user */)
      return res.status(HttpStatus.CREATED).json({
        message:"Type created Successfuly !",
        status:HttpStatus.CREATED,
        data:newType
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
      const allTypes = await this.typeModelService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Types founded Successfuly !",
        status:HttpStatus.OK,
        data:allTypes
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
  async findOne( @Param('id') id: number,
                 @Res() res) {
   
    try {
      const oneType = await this.typeModelService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Type founded Successfuly !",
        status:HttpStatus.OK,
        data:oneType
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
  async update( @Param('id') id: number, 
                @Body() updateTypeModelDto: UpdateTypeModelDto,
                @Res() res) {
    try {
      const updateType = await this.typeModelService.update(+id, updateTypeModelDto)
      return res.status(HttpStatus.OK).json({
        message:"Type updated Successfuly !",
        status:HttpStatus.OK,
        data:updateType
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
  async remove( @Param('id') id: number,
                @Res() res) {
    try {
      const deleteType = await this.typeModelService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Type updated Successfuly !",
        status:HttpStatus.OK,
        data:deleteType
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
