import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, ConflictException } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';

@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) { }

  @Post()
  async create(@Body() createReferenceDto: CreateReferenceDto,
    @Res() res) {
    try {
      const newcreate = await this.referencesService.create(createReferenceDto)
      return res.status(HttpStatus.CREATED).json({
        message:"reference created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate
      })
    } catch (error) {
      if (error.code === '23505') {
              throw new ConflictException('reference already exists');
            }
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
      const findAll = await this.referencesService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"reference founded Successfuly !",
        status:HttpStatus.OK,
        data:findAll
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
  async findOne(@Param('id') id: number,
    @Res() res) {
    try {
      const findOne = await this.referencesService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"reference founded Successfuly !",
        status:HttpStatus.OK,
        data:findOne
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
  async update(@Param('id') id: number,
    @Body() updateReferenceDto: UpdateReferenceDto,
    @Res() res) {
    try {
      const update = await this.referencesService.update(+id, updateReferenceDto)
      return res.status(HttpStatus.OK).json({
        message:"reference updated Successfuly !",
        status:HttpStatus.OK,
        data:update
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
  async remove(@Param('id') id: number,
    @Res() res) {
    try {
      const deleteType = await this.referencesService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
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

  @Get(':modelId/:partId')
  async getCompatibleReferences(@Param('modelId') modelId: number,
                                @Param('partId') partId: number,
                                @Res() res ) {
    try {
      const findReferences = await this.referencesService.findCompatibleReferences(modelId, partId)
      return res.status(HttpStatus.OK).json({
        message:"Founnd Successfuly !",
        status:HttpStatus.OK,
        data:findReferences
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }    
  }
  @Get('findByMC/:materialCode')
  async getByMaterialCode(@Param('materialCode') materialCode: string,
                                @Res() res ) {
    try {
      const findReferences = await this.referencesService.findByMaterialCode(materialCode)
      return res.status(HttpStatus.OK).json({
        message:"Founnd Successfuly !",
        status:HttpStatus.OK,
        data:findReferences
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
