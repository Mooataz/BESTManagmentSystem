import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { OtherCostService } from './other-cost.service';
import { CreateOtherCostDto } from './dto/create-other-cost.dto';
import { UpdateOtherCostDto } from './dto/update-other-cost.dto';

@Controller('other-cost')
export class OtherCostController {
  constructor(private readonly otherCostService: OtherCostService) {}

  @Post()
  async create(@Body() createOtherCostDto: CreateOtherCostDto,
  @Res() res) {
    try {
      const newcreate = await this.otherCostService.create(createOtherCostDto)
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
      const allfind = await this.otherCostService.findAll()
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
      const Onefind = await this.otherCostService.findOne(+id)
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
  async update(@Param('id') id: string, 
  @Body() updateOtherCostDto: UpdateOtherCostDto,
  @Res() res) {
    try {
      const updatedata = await this.otherCostService.update(+id, updateOtherCostDto)
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
      const deletedata = await this.otherCostService.remove(+id)
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
