import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFiles, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { RepairService } from './repair.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
 import { AuthGuard } from '@nestjs/passport';
 import { Response } from 'express';
@Controller('repair')
export class RepairController {
  constructor(private readonly repairService: RepairService) { }
  @Post()
 //@ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        /* warrenty: { type: 'boolean' },
        approveRepair: { type: 'boolean' },
        newSerialNumber: { type: 'number' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        advancePayment: { type: 'number' }, */
        actuellybranch: { type: 'number' },
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
    @Body()  body: any, /* createRepairDto:   CreateRepairDto */     
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

@UseInterceptors(
  FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: './upload/repairs',
      filename: (_req, file, cb) =>
        cb(null, `${Date.now()}-${file.originalname}`),
    }),
  }),
)
 @ApiConsumes("multipart/form-data")
@Patch('updateWithPartsFiles/:id')
async updateWithPartsFiles(
  @Param('id') id: number,
  @Body() updateRepairDto: UpdateRepairDto,
  //@UploadedFiles() files: Express.Multer.File[],
  @Res() res: Response
) {
  // Validate files before processing

/* const filePaths = (files || [])
  .filter(file => file && typeof file.filename === 'string' && file.filename.trim() !== '')
  .map(file => {
    if (!file.filename.match(/^[a-zA-Z0-9\-._]+$/)) {
      throw new BadRequestException(...'');
    }
    return file.filename;
  }); */
 
  const updatedRepair = await this.repairService.updateRepairWithParts(
    +id, 
    updateRepairDto, 
   /*  filePaths */
  );

  return res.status(HttpStatus.OK).json({
    message: "Mise à jour réussie!",
    status: HttpStatus.OK,
    data: updatedRepair,
  });
}
 @Patch(':id')
  async update(@Param('id') id: number,
    @Body() body: any,
    //@UploadedFiles() files: Express.Multer.File[],
    @Res() res) {
    try {
      const updateRepairDto = {
      ...body,
      accessoryIds: body.accessoryIds ? JSON.parse(body.accessoryIds) : undefined,
      listFaultIds: body.listFaultIds ? JSON.parse(body.listFaultIds) : undefined,
      // ... répéter pour tous les champs array ou objets
    };

      /*  if (files.length > 0) {
      updateRepairDto.files = files.map(f => f.path);
    } */
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

 @Get('FilterUserStep/:branchId/:userId/:steps')
async getByUserStep(
  @Param('branchId') branchId: string,
  @Param('userId') userId: string,
  @Param('steps') steps: string,
  @Res() res
) {
  try {
    const numericBranchId = Number(branchId);
    const numericUserId = Number(userId);

    const result = await this.repairService.findByBranchAndStep(numericBranchId, steps);

    const filterResult = result.filter(repair => repair.user?.id === numericUserId);

    return res.status(HttpStatus.OK).json({
      message: 'Réparations récupérées avec succès',
      status: HttpStatus.OK,
      data: filterResult,
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
