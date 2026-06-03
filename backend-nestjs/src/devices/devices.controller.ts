import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Res, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}


  
 
  @Post()
  async create( @Body() createDeviceDto: CreateDeviceDto, 
                @Res() res: any   
                 ) {
    try {
           
          const newDevice = await this.devicesService.create(createDeviceDto)
          return res.status(HttpStatus.CREATED).json({
            message:"Device created Successfuly !",
            status:HttpStatus.CREATED,
            data:newDevice
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
  async findAll(@Res() res: any) {
    try {
      const findAll= await this.devicesService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"All Devices found successfuly !",
        status:HttpStatus.OK,
        data:findAll
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

  @Get('history')
  async findAllWithRepairs(@Res() res: any) {
    try {
      const data = await this.devicesService.findAllWithRepairs()
      return res.status(HttpStatus.OK).json({
        message: "Devices with repairs found successfully !",
        status: HttpStatus.OK,
        data
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
  async findOne( @Param('id') id: number, 
                 @Res() res: any) {
    try {
      const findOne = await this.devicesService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One device found successfuly !",
        status:HttpStatus.OK,
        data:findOne
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
  async update( @Param('id') id: number, 
                @Body() updateDeviceDto: UpdateDeviceDto, 
                @Res() res : any 
                ) {

    try {
       
    const updatedata = await this.devicesService.update(+id, updateDeviceDto)
    return res.status(HttpStatus.OK).json({
      message:"Device updated successfuly !",
      status:HttpStatus.OK,
      data:updatedata
    })
  }catch (error) {
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
  async remove( @Param('id') id: number, 
                @Res() res : any , ) {
    try {
      const deletedata = await this.devicesService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"Device deleted successfuly !",
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

@ApiBody({
    schema:{
      type:'object',
      properties: {
        serialenumber:{type:"string"},
         purchaseDate: {type :"Date"},
        model: {type: "number"},
         
      },
      }
    })
   
   @Post('Device')
   async checkDevice (@Body() body:{
    serialenumber?:string,
    purchaseDate?:string,
     
    model?:number
   }, @Res() res: any   ){

     
    try {
         
    const device = await this.devicesService.chekDevice(
      body.serialenumber,
      body.purchaseDate,
      body.model
    );
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:device })
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

    @Get('deviceHasOpenRepair/:id')
  async deviceHasOpenRepair( @Param('id') id: string, 
                 @Res() res: any) {
    try {
      const findOne = await this.devicesService.deviceHasOpenRepair(id)
       return res.status(HttpStatus.OK).json({
        message:"Tested successfuly !",
        status:HttpStatus.OK,
        data:findOne
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
 
