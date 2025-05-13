import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ApproveStockService } from './approve-stock.service';
import { CreateApproveStockDto } from './dto/create-approve-stock.dto';
import { UpdateApproveStockDto } from './dto/update-approve-stock.dto';

@Controller('approve-stock')
export class ApproveStockController {
  constructor(private readonly approveStockService: ApproveStockService) { }

  @Post()
  async create(@Body() createApproveStockDto: CreateApproveStockDto,
    @Res() res) {
    try {
      const newcreate = await this.approveStockService.create(createApproveStockDto)
      return res.status(HttpStatus.CREATED).json({
        message: "Data created Successfuly !",
        status: HttpStatus.CREATED,
        data: newcreate
      })

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }
  @Get('/findByRepair/:repairId')
  async getByRepairId(@Param('repairId') repairId: number,
                      @Res() res) {
    try {
      const allfind = await this.approveStockService.findByRepairId(repairId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null }) }
  }

  @Get('/findBySale/:saleId')
  async getBySaleId(@Param('saleId') saleId: number,
                      @Res() res) {
    try {
      const allfind = await this.approveStockService.findBySaleId(saleId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null }) }
  }

  @Get('/findByBranch/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
                      @Res() res) {
    try {
      const allfind = await this.approveStockService.findByBranchId(branchId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null }) }
  }

  @Get('/findByType/:type')
  async getByType(@Param('type') type: string,
                      @Res() res) {
    try {
      const allfind = await this.approveStockService.findByType(type)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null }) }
  }
  @Get('/findByState/:state')
  async getByState(@Param('state') state: string,
                      @Res() res) {
    try {
      const allfind = await this.approveStockService.findByState(state)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null }) }
  }
  @Get()
  async findAll(@Res() res) {
    try {
      const findAll = await this.approveStockService.findAll()
      return res.status(HttpStatus.OK).json({
        message: "All Data found successfuly !",
        status: HttpStatus.OK,
        data: findAll
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number,
    @Res() res) {
    try {
      const findOne = await this.approveStockService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message: "One Data found successfuly !",
        status: HttpStatus.OK,
        data: findOne
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updateApproveStockDto: UpdateApproveStockDto,
    @Res() res) {
    try {
      const updatedata = await this.approveStockService.update(+id, updateApproveStockDto)
      return res.status(HttpStatus.OK).json({
        message: "Data updates successfuly !",
        status: HttpStatus.OK,
        data: updatedata
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })

    }
  }
  @Patch('updateState/:id/:binDefectId')
  async updateStateApprove(@Param('id') id: number,@Param('binDefectId') binDefectId: number,
    @Body() updateApproveStockDto: UpdateApproveStockDto,
    @Res() res) {
    try {
      const updatedata = await this.approveStockService.updateState(id, binDefectId, updateApproveStockDto)
      return res.status(HttpStatus.OK).json({
        message: "Data updates successfuly !",
        status: HttpStatus.OK,
        data: updatedata
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })

    }
  }
  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res() res) {
    try {
      const deletedata = await this.approveStockService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message: "Data deleted successfuly !",
        status: HttpStatus.OK,
        data: deletedata
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })

    }
  }
}
