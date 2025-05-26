import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Res, UploadedFile, HttpStatus } from '@nestjs/common';
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
                @Res() res   
                 ) {
    try {
           
          const newDevice = await this.devicesService.create(createDeviceDto)
          return res.status(HttpStatus.CREATED).json({
            message:"Device created Successfuly !",
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

  @Get()
  async findAll(@Res() res) {
    try {
      const findAll= await this.devicesService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"All Devices found successfuly !",
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
      const findOne = await this.devicesService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One device found successfuly !",
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
                @Body() updateDeviceDto: UpdateDeviceDto, 
                @Res() res  
                ) {

    try {
       
    const updatedata = await this.devicesService.update(+id, updateDeviceDto)
    return res.status(HttpStatus.OK).json({
      message:"Device updated successfuly !",
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
                @Res() res , ) {
    try {
      const deletedata = await this.devicesService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"Device deleted successfuly !",
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
   }, @Res() res   ){

     
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
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null })
    }

   }

   
  
  }
 
