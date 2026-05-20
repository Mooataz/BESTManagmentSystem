import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { ApproveStockService } from './approve-stock.service';
import { CreateApproveStockDto } from './dto/create-approve-stock.dto';
import { UpdateApproveStockDto } from './dto/update-approve-stock.dto';

@Controller('approve-stock')
export class ApproveStockController {
  constructor(private readonly approveStockService: ApproveStockService) { }

  @Post()
  async create(@Body() createApproveStockDto: CreateApproveStockDto,
    @Res() res: any) {
    try {
      const newcreate = await this.approveStockService.create(createApproveStockDto)
      return res.status(HttpStatus.CREATED).json({
        message: "Data created Successfuly !",
        status: HttpStatus.CREATED,
        data: newcreate
      })

    }  catch (error) {
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
  @Get('/findByRepair/:repairId')
  async getByRepairId(@Param('repairId') repairId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.approveStockService.findByRepairId(repairId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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

  @Get('/findBySale/:saleId')
  async getBySaleId(@Param('saleId') saleId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.approveStockService.findBySaleId(saleId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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

  @Get('/findByBranch/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.approveStockService.findByBranchId(branchId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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

  @Get('/findByType/:type')
  async getByType(@Param('type') type: string,
                      @Res() res: any) {
    try {
      const allfind = await this.approveStockService.findByType(type)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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
  @Get('/findByState/:state')
  async getByState(@Param('state') state: string,
                      @Res() res: any) {
    try {
      const allfind = await this.approveStockService.findByState(state)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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
      const findAll = await this.approveStockService.findAll()
      return res.status(HttpStatus.OK).json({
        message: "All Data found successfuly !",
        status: HttpStatus.OK,
        data: findAll
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
  async findOne(@Param('id') id: number,
    @Res() res: any) {
    try {
      const findOne = await this.approveStockService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message: "One Data found successfuly !",
        status: HttpStatus.OK,
        data: findOne
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
  async update(@Param('id') id: number,
    @Body() updateApproveStockDto: UpdateApproveStockDto,
    @Res() res: any) {
    try {
      const updatedata = await this.approveStockService.update(+id, updateApproveStockDto)
      return res.status(HttpStatus.OK).json({
        message: "Data updates successfuly !",
        status: HttpStatus.OK,
        data: updatedata
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
  @Patch('updateState/:id/:binDefectId')
  async updateStateApprove(@Param('id') id: number,@Param('binDefectId') binDefectId: number,
    @Body() updateApproveStockDto: UpdateApproveStockDto,
    @Res() res: any) {
    try {
      const updatedata = await this.approveStockService.updateState(id, binDefectId, updateApproveStockDto)
      return res.status(HttpStatus.OK).json({
        message: "Data updates successfuly !",
        status: HttpStatus.OK,
        data: updatedata
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
  async remove(@Param('id') id: number,
    @Res() res: any) {
    try {
      const deletedata = await this.approveStockService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message: "Data deleted successfuly !",
        status: HttpStatus.OK,
        data: deletedata
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
