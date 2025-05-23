import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
 
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Res() res) {
    try {
      
      const newCustomer= await this.customersService.create(createCustomerDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Customer created Successfuly !",
        status:HttpStatus.CREATED,
        data:newCustomer
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  
  @Get('/findByDistributer/:distributerId')
  async getByDistributerId(@Param('distributerId') distributerId: number,
                      @Res() res) {
    try {
      const allfind = await this.customersService.findByDistributer(distributerId)
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
  
 
 
  @Post('/findByName')
  async getByName(@Body() body:{name:string , phone:number, distributer} ,
                      @Res() res) {
    try {
      const {name, phone, distributer} = body;
      const allfind = await this.customersService.findByName(name, phone, distributer)
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
      const allCustomer= await this.customersService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"customers found successfuly !",
        status:HttpStatus.OK,
        data:allCustomer
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
  async findOne(@Param('id') id: number, @Res() res) {
  
    try {
      const OneCustomer = await this.customersService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One Customer found successfuly !",
        status:HttpStatus.OK,
        data:OneCustomer
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
  async update(@Param('id') id: number, @Body() updateCustomerDto: UpdateCustomerDto, @Res() res) {
   

    try {
      const updatedata = await this.customersService.update(+id, updateCustomerDto)
      return res.status(HttpStatus.OK).json({
        message:"Customer updates successfuly !",
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
  async remove(@Param('id') id: number, @Res() res) {
    
    try {
      const deletedata = await this.customersService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"User deleted successfuly !",
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
