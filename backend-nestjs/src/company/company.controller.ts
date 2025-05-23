import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @ApiBody({
    schema:{
      type:'object',
      properties: {
        name:{type:"string"},
        headquarterslocation : {type :"string"},
        taxRegisterNumber: {type :"string"},
        rib: {type :"BigInt"},
        logo : {type:"string" , format:"binary"},
        bank : { type : "string"},
        quantityAlertStock: {type: "number"}
      }
    }
    
  })
  @ApiConsumes("multipart/form-data")

  @UseInterceptors(
    FileInterceptor('logo', {
      storage : diskStorage({
        destination:"./upload/company",
        filename:(_request, logo, callback) =>
          callback(null,`${new Date().getTime()}-${logo.originalname}`)
      })
    })
  )
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto, @Res() res, @UploadedFile() logo:Express.Multer.File) {
    try {
      createCompanyDto.logo=logo.filename
      const newUser= await this.companyService.create(createCompanyDto)
      return res.status(HttpStatus.CREATED).json({
        message:"Company created Successfuly !",
        status:HttpStatus.CREATED,
        data:newUser
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
    //return this.companyService.findAll();
    try {
      const comp = await this.companyService.findAll()
      return res.status(HttpStatus.OK).json({
        message:"Company found successfuly !",
        status:HttpStatus.OK,
        data:comp
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
      const oneCompany = await this.companyService.findOne(+id)
       return res.status(HttpStatus.OK).json({
        message:"One brand found successfuly !",
        status:HttpStatus.OK,
        data:oneCompany
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
        headquarterslocation : {type :"string"},
        taxRegisterNumber: {type :"string"},
        rib: {type :"BigInt"},
        logo : {type:"string" , format:"binary"},
        bank : { type : "string"}
      }
    }
    
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor('logo', {
      storage : diskStorage({
        destination:"./upload/company",
        filename:(_request, logo, callback) =>
          callback(null,`${new Date().getTime()}-${logo.originalname}`)
      })
    })
  )
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompanyDto, @Res() res, @UploadedFile() logo:Express.Multer.File) {
    try {
       if (logo) {
      updateCompanyDto.logo = logo.filename;
    }
      const updatedata = await this.companyService.update(id,updateCompanyDto)
      return res.status(HttpStatus.OK).json({
        message:"Company updated successfuly !",
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
      const deletedata = await this.companyService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message:"Company deleted successfuly !",
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
