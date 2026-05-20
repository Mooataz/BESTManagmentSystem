import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
 
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Res() res:any) {
    try {
      
      const newCustomer= await this.customersService.create(createCustomerDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Customer created Successfuly !",
        status:HttpStatus.CREATED,
        data:newCustomer
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

  
  @Get('/findByDistributer/:distributerId')
  async getByDistributerId(@Param('distributerId') distributerId: number,
                      @Res() res: any) {
    try {
      const allfind = await this.customersService.findByDistributer(distributerId)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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
  
 
 
  @Post('/findByName')
  async getByName(@Body() body:{name:string , phone:number, distributer:number} ,
                      @Res() res: any) {
    try {
      const {name, phone, distributer} = body;
      const allfind = await this.customersService.findByName(name, phone, distributer)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:allfind })
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
  async findAll(@Res() res: any) {
    try {
      const allCustomer= await this.customersService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"customers found successfuly !",
        status:HttpStatus.OK,
        data:allCustomer
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
  async findOne(@Param('id') id: number, @Res() res: any) {
  
    try {
      const OneCustomer = await this.customersService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One Customer found successfuly !",
        status:HttpStatus.OK,
        data:OneCustomer
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
  async update(@Param('id') id: number, @Body() updateCustomerDto: UpdateCustomerDto, @Res() res: any) {
   

    try {
      const updatedata = await this.customersService.update(+id, updateCustomerDto)
      return res.status(HttpStatus.OK).json({
        message:"Customer updates successfuly !",
        status:HttpStatus.OK,
        data:updatedata
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
  async remove(@Param('id') id: number, @Res() res: any) {
    
    try {
      const deletedata = await this.customersService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"User deleted successfuly !",
        status:HttpStatus.OK,
        data:deletedata
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
