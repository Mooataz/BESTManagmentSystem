import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFiles, UseGuards, Req, Query } from '@nestjs/common';
import { RepairService } from './repair.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
 import { AuthGuard } from '@nestjs/passport';
@Controller('repair')
export class RepairController {
  constructor(private readonly repairService: RepairService) { }
  @Post()
 @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        /* warrenty: { type: 'boolean' },
        approveRepair: { type: 'boolean' },
        newSerialNumber: { type: 'number' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        advancePayment: { type: 'number' }, */
        actuellyBranch: { type: 'number' },
        remark: { type: 'string' },
        deviceStateReceive: { type: 'string' },
        device: { type: 'number' },
       /*  user: { type: 'number' }, */
        /* 'partsNeed[0]':{ type: 'number' }, */
        /* 'accessoryIds[0]': {
          type: 'number',
          description: 'First permission',
          example: 1,
        }, */
        'listFaultIds[0]': {
          type: 'number',
          description: 'First permission',
          example: 1,
        },
        
       /*  'customerRequestIds[0]': {
          type: 'number',
          description: 'First permission',
          example: 1,
        }, */
       
        /* 'notesCustomerIds[0]': {
          type: 'number',
          description: 'First permission',
          example: 1,
        }, */
        
       /*  'expertiseReasonsIds[0]': {
          type: 'number',
          description: 'First permission',
          example: 1,
        },
        
        'repairActionIds[0]': {
          type: 'number',
          description: 'First permission',
          example: 1,
        }, */
        
      },
    },
  })
/*   @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './upload/repairs',
        filename: (_request, file, callback) =>
          callback(null, `${new Date().getTime()}-${file.originalname}`),
      }),
    }),
  ) */
   
  async create(  
    @Body()  body: any, createRepairDto:   CreateRepairDto  ,  
    //@UploadedFiles() files: Express.Multer.File[],
    @Res() res,
  ) {
    try {
       
           const {userId, ...createRepairDto} = body; 
      //createRepairDto.files = files?.map((file) => file.filename) || [];
       //const userId = req.user.id; 
      const newCreate = await this.repairService.create(createRepairDto  ,userId );
      return res.status(HttpStatus.CREATED).json({
        message: 'Created Successfully!',
        status: HttpStatus.CREATED,
        data: newCreate,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }
  }
@Get('byBranchAndStep')
async findByBranchAndStep(
   @Query('branchId') branchId: number,
  @Query('step') step: string,   
  @Res() res
) {
  
try {
      const allfind = await  this.repairService.findByBranchAndStep(branchId, step);
       
      return res.status(HttpStatus.OK).json({
        message:" founded Successfuly !",
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
  @Get()
  async findAll(@Res() res) {
    try {
      const allfind = await  this.repairService.findAll()
      return res.status(HttpStatus.OK).json({
        message:" founded Successfuly !",
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
      const onefind = await this.repairService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message:"One  founded Successfuly !",
        status:HttpStatus.OK,
        data:onefind
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:error.message,
        status:HttpStatus.BAD_REQUEST,
        data:null
      })
    }
  }
/*   @Patch('updatePartRepair/:id')
  async updateRepair(
    @Param('id') id: number,
    @Body() updateRepairDto: UpdateRepairDto
  ) {
    const updatedRepair = await this.repairService.updateRepairWithParts(+id, updateRepairDto);
    return {
      message: 'Repair updated successfully',
      data: updatedRepair,
    };
  } */
    @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updateRepairDto: UpdateRepairDto,
    @Res() res) {
    try {
      const updatedata = await this.repairService.update(+id, updateRepairDto)
      return res.status(HttpStatus.OK).json({
        message:" updated Successfuly !",
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
  async remove(@Param('id') id: number,
    @Res() res) {
    try {
      const deletedata = await this.repairService.remove(+id)
      return res.status(HttpStatus.OK).json({
        message:" deleted Successfuly !",
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

  @Get('filter-by-device/:deviceId')
  async getRepairByDevice(@Param('deviceId') deviceId: string, @Res() res) {
    try {
      const id = parseInt(deviceId, 10);
      if (isNaN(id)) {
        throw new Error('Invalid deviceId');
      }
  
      const devices = await this.repairService.filterRepairByDevice(id);
      return res.status(HttpStatus.OK).json({
        message: 'Repairs found successfully!',
        status: HttpStatus.OK,
        data: devices,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }
  }

  @Get('/findByNewSerialNumber/:branchId')
  async getByNewSerialNumber(@Param('newSerialNumber') newSerialNumber: number,
                      @Res() res) {
    try {
      const allfind = await this.repairService.filterByNewSerialNumber(newSerialNumber)
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


  @Get('/findByActuellyBranch/:actuellyBranch')
  async getByActuellyBranch(@Param('actuellyBranch') actuellyBranch: number,
                      @Res() res) {
    try {
      const allfind = await this.repairService.filterByActuellyBranch(actuellyBranch)
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

  @Get('filter-by-user/:userId')
  async getRepairByUser(@Param('userId') userId: string, @Res() res) {
    try {
      const id = parseInt(userId, 10);
      if (isNaN(id)) {
        throw new Error('Invalid userId');
      }
  
      const user = await this.repairService.filterRepairByUser(id);
      return res.status(HttpStatus.OK).json({
        message: 'Repairs found successfully!',
        status: HttpStatus.OK,
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
    }
  }

  @Get('FilterByUserStep')
  async getByUserStep ( @Param() userId: number,
                        @Param() steps: string,
                        @Res() res){
      try {
        const user = await this.repairService.FiltreByUserStep(userId,steps);
      return res.status(HttpStatus.OK).json({
        message: 'Repairs found successfully!',
        status: HttpStatus.OK,
        data: user,
      });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        data: null,
      });
      }
  }
}
