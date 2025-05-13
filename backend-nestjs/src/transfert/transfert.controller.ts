import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { TransfertService } from './transfert.service';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';

@Controller('transfert')
export class TransfertController {
  constructor(private readonly transfertService: TransfertService) {}

  @Post()
  async create( @Body() createTransfertDto: CreateTransfertDto, 
                @Res() res) {
    try {
              const newDevice = await this.transfertService.create(createTransfertDto)
              return res.status(HttpStatus.CREATED).json({
                message:"Transfert created Successfuly !",
                status:HttpStatus.CREATED,
                data:newDevice
              })
        
            } catch (error) {
              return res.status(HttpStatus.BAD_REQUEST).json({
                message:error.message,
                status:HttpStatus.BAD_REQUEST,
                data:null
              })
            }
  }

  @Get('/findByState/:state')
  async getByState(@Param('state') state: string,
                      @Res() res) {
    try {
      const allfind = await this.transfertService.findByState(state)
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
      const allfind = await this.transfertService.findByBranchId(branchId)
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
  async findAll( @Res() res) {
    try {
      const findAll= await this.transfertService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"All transfert found successfuly !",
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
  async findOne( @Param('id') id: number, 
                 @Res() res) {
    try {
      const findOne = await this.transfertService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One transfert found successfuly !",
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
  async update( @Param('id') id: number, 
                @Body() updateTransfertDto: UpdateTransfertDto, 
                @Res() res) {
    try {
    const updatedata = await this.transfertService.update(+id, updateTransfertDto)
    return res.status(HttpStatus.OK).json({
      message:"Transfert updated successfuly !",
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
  async remove( @Param('id') id: number, 
                @Res() res) {
    try {
      const deletedata = await this.transfertService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"Transfert deleted successfuly !",
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
