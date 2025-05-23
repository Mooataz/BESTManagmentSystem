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


  @ApiBody({
    schema:{
      type:'object',
      properties: {
        serialeNumber:{type:"string"},
        warrentyProof : {type:"string" , format:"binary"},
        purchaseDate: {type :"Date"},
        model: {type: "number"},
        'customer[0]': {
        type: 'number',
        description: 'First permission',
        example: 1,
      },
      'customer[1]': {
        type: 'number',
        description: 'First permission',
        example: 1,
      },
      'customer[2]': {
        type: 'number',
        description: 'First permission',
        example: 1,
      },
      'customer[3]': {
        type: 'number',
        description: 'First permission',
        example: 1,
      },
      }
    }
    
  })
  @ApiConsumes("multipart/form-data")
  // configuration Multer
  @UseInterceptors(
    FileInterceptor('warrentyProof', {
      storage : diskStorage({
        destination:"./upload/devices",
        filename:(_request, warrentyProof, callback) =>
          callback(null,`${new Date().getTime()}-${warrentyProof.originalname}`)
      })
    })
  )
  @Post()
  async create( @Body() createDeviceDto: CreateDeviceDto, 
                @Res() res , 
                @UploadedFile() warrentyProof:Express.Multer.File) {
    try {
          createDeviceDto.warrentyProof=warrentyProof.filename
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

  @ApiBody({
    schema:{
      type:'object',
      properties: {
        serialeNumber:{type:"string"},
        warrentyProof : {type:"string" , format:"binary"},
        purchaseDate: {type :"Date"}
      }
    }
    
  })
  @ApiConsumes("multipart/form-data")
  // configuration Multer
  @UseInterceptors(
    FileInterceptor('warrentyProof', {
      storage : diskStorage({
        destination:"./upload/devices",
        filename:(_request, warrentyProof, callback) =>
          callback(null,`${new Date().getTime()}-${warrentyProof.originalname}`)
      })
    })
  )
  @Patch(':id')
  async update( @Param('id') id: number, 
                @Body() updateDeviceDto: UpdateDeviceDto, 
                @Res() res , 
                @UploadedFile() warrentyProof:Express.Multer.File) {

    try {
      updateDeviceDto.warrentyProof=warrentyProof?.filename
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
        warrentyProof : {type:"string" , format:"binary"},
        purchaseDate: {type :"Date"},
        model: {type: "number"},
         
      },
      }
    })
    @ApiConsumes("multipart/form-data")
  // configuration Multer
  @UseInterceptors(
    FileInterceptor('warrentyProof', {
      storage : diskStorage({
        destination:"./upload/devices",
        filename:(_request, warrentyProof, callback) =>
          callback(null,`${new Date().getTime()}-${warrentyProof.originalname}`)
      })
    })
  )
   @Post('Device')
   async checkDevice (@Body() body:{
    serialenumber:string,
    purchaseDate:string,
     
    model:number
   }, @Res() res, @UploadedFile() file:Express.Multer.File){

    
    try {
      const {serialenumber, purchaseDate,  model } = body;
      const warrentyProof=file?.filename
      const find = await this.devicesService.chekDevice(serialenumber, purchaseDate, warrentyProof, model)
      return res.status(HttpStatus.OK).json({
        message:"Founded Successfuly !",
        status:HttpStatus.OK,
        data:find })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null })
    }

   }

   
  
  }
 
