import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, ConflictException, HttpException } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { Reference } from './entities/reference.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) { }

  @Post()
  async create(@Body() createReferenceDto: CreateReferenceDto,
    @Res() res: any) {
    try {
      const newcreate = await this.referencesService.create(createReferenceDto)
      return res.status(HttpStatus.CREATED).json({
        message:"reference created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate
      })
    } catch (error) {
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
      
      const findAll = await this.referencesService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"reference founded Successfuly !",
        status:HttpStatus.OK,
        data:findAll
      })
    } catch (error) {
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
    @Res() res: any) {
    try {
      const findOne = await this.referencesService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"reference founded Successfuly !",
        status:HttpStatus.OK,
        data:findOne
      })
    } catch (error) {
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
    @Body() updateReferenceDto: UpdateReferenceDto,
    @Res() res: any) {
    try {
      const update = await this.referencesService.update(+id, updateReferenceDto)
      return res.status(HttpStatus.OK).json({
        message:"reference updated Successfuly !",
        status:HttpStatus.OK,
        data:update
      })
    } catch (error) {
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
    @Res() res: any) {
    try {
      const deleteType = await this.referencesService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deleteType
      })
    } catch (error) {
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

  @Get('getCompatibleReferences/:modelId/:partId')
  async getCompatibleReferences(@Param('modelId') modelId: number,
                                @Param('partId') partId: number,
                                @Res() res: any) {
    try {
      const findReferences = await this.referencesService.findCompatibleReferences(modelId, partId)
      return res.status(HttpStatus.OK).json({
        message:"Founnd Successfuly !",
        status:HttpStatus.OK,
        data:findReferences
      })
    } catch (error) {
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

    
  
@Get('GetMC/:code')
  @ApiOperation({ summary: 'Find reference by material code' })
  async findReferenceByMaterialCode(
    @Param('code') code: string,
    @Res() res: any
) {
 
                                   
    try {
      
      const findReferences = await this.referencesService.findReferenceByMaterialCode(  code)
      return res.status(HttpStatus.OK).json({
        message:"Founnd Successfuly !",
        status:HttpStatus.OK,
        data:findReferences
      })
    } catch (error) {
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
