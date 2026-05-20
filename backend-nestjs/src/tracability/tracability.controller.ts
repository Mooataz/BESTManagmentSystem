import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, ParseIntPipe, HttpException } from '@nestjs/common';
import { TracabilityService } from './tracability.service';
import { CreateTracabilityDto } from './dto/create-tracability.dto';
import { UpdateTracabilityDto } from './dto/update-tracability.dto';

@Controller('tracability')
export class TracabilityController {
  constructor(private readonly tracabilityService: TracabilityService) { }

  @Post()
  async create(@Body() createTracabilityDto: CreateTracabilityDto,
    @Res() res:any) {
    try {
      const newcreate = await this.tracabilityService.create(createTracabilityDto)
      return res.status(HttpStatus.CREATED).json({
        message: "Data created Successfuly !",
        status: HttpStatus.CREATED,
        data: newcreate
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
  async findAll(@Res() res:any) {

    try {
      const findAll = await this.tracabilityService.findAll()
      return res.status(HttpStatus.OK).json({
        message: "All Data found successfuly !",
        status: HttpStatus.OK,
        data: findAll
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
    @Res() res:any) {
    try {
      const findOne = await this.tracabilityService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message: "One Data found successfuly !",
        status: HttpStatus.OK,
        data: findOne
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
    @Body() updateTracabilityDto: UpdateTracabilityDto,
    @Res() res:any) {
    try {
      const updatedata = await this.tracabilityService.update(+id, updateTracabilityDto)
      return res.status(HttpStatus.OK).json({
        message: "Data updates successfuly !",
        status: HttpStatus.OK,
        data: updatedata
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
    @Res() res:any) {
    try {
      const deletedata = await this.tracabilityService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message: "Data deleted successfuly !",
        status: HttpStatus.OK,
        data: deletedata
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

  @Get(':historyRepairId')
  async getByHistoryRepairId(@Param('historyRepairId', ParseIntPipe) historyRepairId: number,
                                @Res() res:any ) {
    try {
      const findtracability = await this.tracabilityService.findByHistoryRepairId(historyRepairId)
      return res.status(HttpStatus.OK).json({
        message:"Founnd Successfuly !",
        status:HttpStatus.OK,
        data:findtracability
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

  @Get(':historyRepairId')
  async getByHistoryStockPartId(@Param('historyStockPartId', ParseIntPipe) historyStockPartId: number,
                                @Res() res:any ) {
    try {
      const findtracability = await this.tracabilityService.findByHistoryStockPartId(historyStockPartId)
      return res.status(HttpStatus.OK).json({
        message:"Founnd Successfuly !",
        status:HttpStatus.OK,
        data:findtracability
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
