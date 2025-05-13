import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class CompanyService {

  constructor ( @InjectRepository(Company) private readonly  companyRepositry:Repository<Company>,
                  private appService: AppService ){}


  async create(createCompanyDto: CreateCompanyDto):Promise<Company> {
    createCompanyDto.name =this.appService.cleanSpaces(createCompanyDto.name)
    createCompanyDto.bank =this.appService.cleanSpaces(createCompanyDto.bank)
    createCompanyDto.headquarterslocation =this.appService.cleanSpaces(createCompanyDto.headquarterslocation)
    createCompanyDto.taxRegisterNumber =this.appService.cleanSpaces(createCompanyDto.taxRegisterNumber)
    return await this.companyRepositry.save(createCompanyDto);
  }

  async findAll():Promise<Company[]> {
    const comp= await this.companyRepositry.find()
    if ( !comp || comp.length === 0){
      throw new NotFoundException("There is no user sata Available")
    }
    return comp
  }

  async findOne(id: number):Promise<Company> {
    const OneBrand= await this.companyRepositry.findOne({ where: { id } })
    if ( !OneBrand){
      throw new NotFoundException("There is no brand data Available")
    }
    return OneBrand
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto):Promise<Company> {
    await this.companyRepositry.update(id,updateCompanyDto);
    const updatedata = await this.companyRepositry.findOne({where : {id}})

    if (!updatedata) {
      throw new NotFoundException('Company not found for update')
    }

    return updatedata
  }
 async remove(id: number):Promise<Company> {
    const deletedata = await this.companyRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Brand Not found for delete = failed')
    }
    await this.companyRepositry.delete({ id: deletedata.id })
    return deletedata;
  }
  
}
