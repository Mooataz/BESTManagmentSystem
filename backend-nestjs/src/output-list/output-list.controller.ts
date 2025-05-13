import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { OutputListService } from './output-list.service';
import { CreateOutputListDto } from './dto/create-output-list.dto';
import { UpdateOutputListDto } from './dto/update-output-list.dto';

@Controller('output-list')
export class OutputListController {
  constructor(private readonly outputListService: OutputListService) { }

  @Post()
  async create(@Body() createOutputListDto: CreateOutputListDto,
    @Res() res) {
    try {
      const newcreate = await this.outputListService.create(createOutputListDto)
      return res.status(HttpStatus.CREATED).json({
        message : 'created Successfuly',
        status : HttpStatus.CREATED,
        data : newcreate
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
      const allfind= await this.outputListService.findAll()
      return res.status(HttpStatus.OK).json({
        message:" found successfuly !",
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
      const Onefind = await this.outputListService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One found successfuly !",
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
  @Get('/findByBranch/:branchId')
  async getByBranchId(@Param('branchId') branchId: number,
                      @Res() res) {
    try {
      const allfind = await this.outputListService.findByBranchId(branchId)
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

  @Get('/findByCustomer/:customerId')
  async getByCustomerId(@Param('customerId') customerId: number,
                      @Res() res) {
    try {
      const allfind = await this.outputListService.findByCustomerId(customerId)
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
 /*  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updateOutputListDto: UpdateOutputListDto,
    @Res() res) {
    try {
      const updatedata = await this.outputListService.update(+id, updateOutputListDto)
      return res.status(HttpStatus.OK).json({
        message:" updated successfuly !",
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
 */
  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res() res) {
    try {
      const deletedata = await this.outputListService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:" deleted successfuly !",
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
