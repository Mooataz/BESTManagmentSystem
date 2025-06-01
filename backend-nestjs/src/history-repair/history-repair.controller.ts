import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { HistoryRepairService } from './history-repair.service';
import { CreateHistoryRepairDto } from './dto/create-history-repair.dto';
import { UpdateHistoryRepairDto } from './dto/update-history-repair.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('history-repair')
export class HistoryRepairController {
  constructor(private readonly historyRepairService: HistoryRepairService) { }
@UseGuards(AccessTokenGuard)
  @Post()
  async create(/*@Body()  createHistoryRepairDto: CreateHistoryRepairDto */date:Date,step: string,repair: number,   @Req() req,
    @Res() res) {
    try {
       const userId = req.user.id; // extraire depuis le token
      const createHistory={
        date,
        step,
        repair,
        user: userId,
        
      }
      const newcreate = await this.historyRepairService.create(createHistory  )
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
  @Get('/find/:repairId')
  async getByRepairId(@Param('repairId') repairId: number,
    @Res() res) {
    try {
      const allfind = await this.historyRepairService.findByRepairId(repairId)
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
  @Get()
  async findAll(@Res() res) {
    try {
      const allfind = await this.historyRepairService.findAll()
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
      const Onefind = await this.historyRepairService.findOne(+id)
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
    @Body() updateHistoryRepairDto: UpdateHistoryRepairDto,
    @Res() res) {
    try {
      const updatedata = await this.historyRepairService.update(+id, updateHistoryRepairDto)
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
      const deletedata = await this.historyRepairService.remove(+id)
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
