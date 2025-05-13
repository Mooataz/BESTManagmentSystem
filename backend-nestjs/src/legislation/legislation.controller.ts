import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { LegislationService } from './legislation.service';
import { CreateLegislationDto } from './dto/create-legislation.dto';
import { UpdateLegislationDto } from './dto/update-legislation.dto';

@Controller('legislation')
export class LegislationController {
  constructor(private readonly legislationService: LegislationService) { }

  @Post()
  async create(@Body() createLegislationDto: CreateLegislationDto,
    @Res() res) {
    try {
      const newcreate = await this.legislationService.create(createLegislationDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate})
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null})
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const allfind = await this.legislationService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind
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
      const Onefind = await this.legislationService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:Onefind
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
    @Body() updateLegislationDto: UpdateLegislationDto,
    @Res() res) {
    try {
      const updatedata = await this.legislationService.update(+id, updateLegislationDto)
      return res.status(HttpStatus.OK).json({
        message:"Updated Successfuly !",
        status:HttpStatus.OK,
        data:updatedata
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
      const deletedata = await this.legislationService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:"Deleted Successfuly !",
        status:HttpStatus.OK,
        data:deletedata
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
