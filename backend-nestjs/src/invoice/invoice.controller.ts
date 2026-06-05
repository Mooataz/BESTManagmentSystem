import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Res() res: any) {
    try {
      const newcreate = await this.invoiceService.create(createInvoiceDto);
      return res.status(HttpStatus.CREATED).json({
        message: "Created Successfuly !",
        status: HttpStatus.CREATED,
        data: newcreate,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get('/eligible-repairs/:branchId')
  async getEligibleRepairs(@Param('branchId') branchId: number, @Res() res: any) {
    try {
      const repairs = await this.invoiceService.getEligibleRepairs(branchId);
      return res.status(HttpStatus.OK).json({
        message: "Repairs found",
        status: HttpStatus.OK,
        data: repairs,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get('/repair-details/:repairId')
  async getRepairInvoiceDetails(@Param('repairId') repairId: number, @Res() res: any) {
    try {
      const details = await this.invoiceService.getRepairInvoiceDetails(repairId);
      return res.status(HttpStatus.OK).json({
        message: "Details found",
        status: HttpStatus.OK,
        data: details,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get('/authorized-costs')
  async getAuthorizedCosts(@Res() res: any) {
    try {
      const costs = await this.invoiceService.getAuthorizedOtherCosts();
      return res.status(HttpStatus.OK).json({
        message: "Costs found",
        status: HttpStatus.OK,
        data: costs,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get('/pdf/:id')
  async getPdf(@Param('id') id: number, @Res() res: any) {
    try {
      await this.invoiceService.generatePdf(id, res);
    } catch (error) {
      if (!res.headersSent) {
        if (error instanceof HttpException) {
          return res.status(error.getStatus()).json({
            message: error.message,
            status: error.getStatus(),
            data: null,
          });
        }
        const err = error as Error;
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: err.message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        });
      }
    }
  }

  @Get('/findByBranchId/:branchId')
  async getByranchId(@Param('branchId') branchId: number, @Res() res: any) {
    try {
      const allfind = await this.invoiceService.findByBranchId(branchId);
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get('/findByUserId/:userId')
  async getByUserId(@Param('userId') userId: number, @Res() res: any) {
    try {
      const allfind = await this.invoiceService.findByUserId(userId);
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get('/findByRepairId/:repairId')
  async getByRepairId(@Param('repairId') repairId: number, @Res() res: any) {
    try {
      const allfind = await this.invoiceService.findByRepairId(repairId);
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get('/findByState/:state')
  async getByState(@Param('state') state: string, @Res() res: any) {
    try {
      const allfind = await this.invoiceService.findByState(state);
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    try {
      const allfind = await this.invoiceService.findAll();
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: allfind,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: any) {
    try {
      const onefind = await this.invoiceService.findOne(+id);
      return res.status(HttpStatus.OK).json({
        message: "Founded Successfuly !",
        status: HttpStatus.OK,
        data: onefind,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Patch('validate/:id')
  async validate(@Param('id') id: number, @Body('adminId') adminId: number, @Res() res: any) {
    try {
      const data = await this.invoiceService.validate(+id, +adminId);
      return res.status(HttpStatus.OK).json({
        message: "Facture validée avec succès",
        status: HttpStatus.OK,
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateInvoiceDto: UpdateInvoiceDto, @Res() res: any) {
    try {
      const updatedata = await this.invoiceService.update(+id, updateInvoiceDto);
      return res.status(HttpStatus.OK).json({
        message: "Updated Successfuly !",
        status: HttpStatus.OK,
        data: updatedata,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: any) {
    try {
      const deletedata = await this.invoiceService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: "Deleted Successfuly !",
        status: HttpStatus.OK,
        data: deletedata,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
          status: error.getStatus(),
          data: null,
        });
      }
      throw error;
    }
  }
}
