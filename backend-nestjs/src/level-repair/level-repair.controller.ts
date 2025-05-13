import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { LevelRepairService } from './level-repair.service';
import { CreateLevelRepairDto } from './dto/create-level-repair.dto';
import { UpdateLevelRepairDto } from './dto/update-level-repair.dto';

@Controller('level-repair')
export class LevelRepairController {
  constructor(private readonly levelRepairService: LevelRepairService) { }

  @Post()
  async create(@Body() createLevelRepairDto: CreateLevelRepairDto,
    @Res() res) {
    try {
      const newcreate = await this.levelRepairService.create(createLevelRepairDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Created Successfuly !",
        status:HttpStatus.CREATED,
        data:newcreate
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
      const allfind = await this.levelRepairService.findAll()
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
      const Onefind = await this.levelRepairService.findOne(+id)
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
    @Body() updateLevelRepairDto: UpdateLevelRepairDto,
    @Res() res) {
    try {
      const updatedata = await this.levelRepairService.update(+id, updateLevelRepairDto)
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
      const deletedata = await this.levelRepairService.remove(+id)
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
