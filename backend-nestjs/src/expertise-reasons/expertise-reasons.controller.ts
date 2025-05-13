import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ExpertiseReasonsService } from './expertise-reasons.service';
import { CreateExpertiseReasonDto } from './dto/create-expertise-reason.dto';
import { UpdateExpertiseReasonDto } from './dto/update-expertise-reason.dto';

@Controller('expertise-reasons')
export class ExpertiseReasonsController {
  constructor(private readonly expertiseReasonsService: ExpertiseReasonsService) { }

  @Post()
  async create(@Body() createExpertiseReasonDto: CreateExpertiseReasonDto,
    @Res() res) {
    try {
      const newcreate = await this.expertiseReasonsService.create(createExpertiseReasonDto)
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
      const allfind = await this.expertiseReasonsService.findAll()
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
      const Onefind = await this.expertiseReasonsService.findOne(+id)
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
    @Body() updateExpertiseReasonDto: UpdateExpertiseReasonDto,
    @Res() res) {
    try {
      const updatedata = await this.expertiseReasonsService.update(+id, updateExpertiseReasonDto)
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
      const deletedata = await this.expertiseReasonsService.remove(+id)
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
