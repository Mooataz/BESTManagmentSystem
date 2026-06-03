import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { TransfertService } from './transfert.service';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';

@Controller('transfert')
export class TransfertController {
  constructor(private readonly transfertService: TransfertService) { }

  @Post()
  async create(@Body() createTransfertDto: CreateTransfertDto,
    @Res() res: any) {
    try {
      const newDevice = await this.transfertService.create(createTransfertDto)
      return res.status(HttpStatus.CREATED).json({
        message: "Transfert created Successfuly !",
        status: HttpStatus.CREATED,
        data: newDevice
      })

    }   catch (error) {
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

  @Get('/findByState/:state')
  async getByState(@Param('state') state: string,
    @Res() res: any) {
    try {
      const allfind = await this.transfertService.findByState(state)
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind
      })
    }   catch (error) {
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

  @Get('/findFromBranchId/:branchId/:type')
  async getFromBranchId(@Param('branchId') branchId: number, @Param('type') type: string,
    @Res() res: any) {
    try {
      const allfind = await this.transfertService.getFromBranch(branchId, type)
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind
      })
    }   catch (error) {
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
  @Get('/pdf/:id')
  async getPdf(@Param('id') id: number, @Res() res: any) {
    try {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="transfert_${id}.pdf"`);
      await this.transfertService.generatePdf(id, res);
    } catch (error) {
      if (!res.headersSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erreur génération PDF', status: 500 });
      } else {
        res.end();
      }
    }
  }
  @Get('/findToBranchId/:branchId/:type/:state')
  async getByBranchId(@Param('branchId') branchId: number,
                      @Param('type') type: string,
                      @Param('state') state: string,
                      @Res() res: any) {
    try {
      const allfind = await this.transfertService.getToBranch(branchId, type, state)
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind
      })
    }   catch (error) {
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

  @Get('/repair/branch/:branchId')
  async findRepairTransfersByBranch(@Param('branchId') branchId: number, @Res() res: any) {
    try {
      const data = await this.transfertService.findRepairTransfersByBranch(branchId);
      return res.status(HttpStatus.OK).json({ message: 'Transferts trouvés', status: HttpStatus.OK, data });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.message, status: error.getStatus(), data: null });
      }
      throw error;
    }
  }

  @Patch('/repair/:id/accept')
  async acceptRepairTransfer(@Param('id') id: number, @Body('userId') userId: number, @Res() res: any) {
    try {
      const data = await this.transfertService.acceptRepairTransfer(id, userId);
      return res.status(HttpStatus.OK).json({ message: 'Transfert accepté', status: HttpStatus.OK, data });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.message, status: error.getStatus(), data: null });
      }
      throw error;
    }
  }

  @Patch('/repair/:id/refuse')
  async refuseRepairTransfer(@Param('id') id: number, @Body('userId') userId: number, @Res() res: any) {
    try {
      const data = await this.transfertService.refuseRepairTransfer(id, userId);
      return res.status(HttpStatus.OK).json({ message: 'Transfert refusé', status: HttpStatus.OK, data });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.message, status: error.getStatus(), data: null });
      }
      throw error;
    }
  }

  @Patch('/repair/:id/cancel')
  async cancelRepairTransfer(@Param('id') id: number, @Body('userId') userId: number, @Res() res: any) {
    try {
      const data = await this.transfertService.cancelRepairTransfer(id, userId);
      return res.status(HttpStatus.OK).json({ message: 'Transfert annulé', status: HttpStatus.OK, data });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.message, status: error.getStatus(), data: null });
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    try {
      const findAll = await this.transfertService.findAll()
      return res.status(HttpStatus.OK).json({
        message: "All transfert found successfuly !",
        status: HttpStatus.OK,
        data: findAll
      })
    }   catch (error) {
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
  async findOne(@Param('id') id: number,
    @Res() res: any) {
    try {
      const findOne = await this.transfertService.findOne(+id)
      return res.status(HttpStatus.OK).json({
        message: "One transfert found successfuly !",
        status: HttpStatus.OK,
        data: findOne
      })
    }  catch (error) {
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
  async update(@Param('id') id: number,
    @Body() updateTransfertDto: UpdateTransfertDto,
    @Res() res: any) {
    try {
      const updatedata = await this.transfertService.update(+id, updateTransfertDto)
      return res.status(HttpStatus.OK).json({
        message: "Transfert updated successfuly !",
        status: HttpStatus.OK,
        data: updatedata
      })
    }   catch (error) {
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
  async remove(@Param('id') id: number,
    @Res() res: any) {
    try {
      const deletedata = await this.transfertService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message: "Transfert deleted successfuly !",
        status: HttpStatus.OK,
        data: deletedata
      })
    }   catch (error) {
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
