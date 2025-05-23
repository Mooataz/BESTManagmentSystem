import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}
  @ApiBody({
    schema:{
      type:'object',
      properties: {
        name:{type:"string"},
        logo : {type:"string" , format:"binary"},
        status: {type :"string"}
      }
    }
    
  })
  @ApiConsumes("multipart/form-data")
  // configuration Multer
  @UseInterceptors(
    FileInterceptor('logo', {
      storage : diskStorage({
        destination:"./upload/brands",
        filename:(_request, logo, callback) =>
          callback(null,`${new Date().getTime()}-${logo.originalname}`)
      })
    })
  )
  @Post()
  async create( @Body() createBrandDto: CreateBrandDto, 
                @Res() res , 
                @UploadedFile() logo:Express.Multer.File) {
    console.log('REÇU', createBrandDto, logo);
    try {
      createBrandDto.logo=logo.filename
      const newBrand= await this.brandsService.create(createBrandDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Brand created Successfuly !",
        status:HttpStatus.CREATED,
        data:newBrand
      })

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }

  @Get('/findStatus/:status')
  async getBySaleId(@Param('status') status: string,
                      @Res() res) {
    try {
      const allfind = await this.brandsService.findByStatus(status)
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
      const allBrands= await this.brandsService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"All Brands found successfuly !",
        status:HttpStatus.OK,
        data:allBrands
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
      const findOne = await this.brandsService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One brand found successfuly !",
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
          name:{type:"string"},
          logo : {type:"string" , format:"binary"},
        }
      }
      
    })
    @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor('logo', {
      storage : diskStorage({
        destination:"./upload/brands",
        filename:(_request, logo, callback) =>
          callback(null,`${new Date().getTime()}-${logo.originalname}`)
      })
    })
  )
 
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBrandDto: UpdateBrandDto, @Res() res, @UploadedFile() logo:Express.Multer.File) {
    
    try {
        updateBrandDto.logo=logo?.filename
      const updatedata = await this.brandsService.update(id,updateBrandDto)
      return res.status(HttpStatus.OK).json({
        message:"Brand updates successfuly !",
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
      const deletedata = await this.brandsService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"Brand deleted successfuly !",
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
