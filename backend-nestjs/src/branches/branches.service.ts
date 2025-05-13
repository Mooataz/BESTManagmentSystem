import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class BranchesService {
  constructor ( @InjectRepository(Branch) private readonly  branchRepositry:Repository<Branch>,
                @InjectRepository(Company) private readonly  companyRepositry:Repository<Company>,
                private appService: AppService){}

  async create(createBranchDto: CreateBranchDto):Promise<Branch> {
    createBranchDto.name =this.appService.cleanSpaces(createBranchDto.name)
    createBranchDto.location =this.appService.cleanSpaces(createBranchDto.location)
    const company = await this.companyRepositry.findOne({ where: {id: createBranchDto.company}})
    if(!company) {throw new NotFoundException('Pas de relation société')}
    return await this.branchRepositry.save({ ...createBranchDto, company});
  }

  async findAll():Promise<Branch[]> {
    const allfind = await this.branchRepositry.find({
      relations: ['company', 'user', 'bin'],
    })

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ("There is no data available")
    }
    return allfind
  }

  async findOne(id: number):Promise<Branch> {
    const Onefind= await this.branchRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind
  }

  async update(id: number, updateBranchDto: UpdateBranchDto):Promise<Branch> {
    const existingBranch = await this.branchRepositry.findOne({ where: { id } });
    if (!existingBranch) { throw new NotFoundException('Repair not found'); }

    let company: Company | undefined = undefined;
        if (updateBranchDto.company !== undefined) {
          const foundCompany = await this.companyRepositry.findOne({ where: { id: updateBranchDto.company } });
          if (!foundCompany) { throw new NotFoundException('Company not found'); }
          company = foundCompany;
        }
    const updateData: Partial<Branch> = {
          ...updateBranchDto,
          company: company ?? existingBranch.company,
          
        };
        delete updateData.company;
        await this.branchRepositry.update(id, updateData);
        return this.branchRepositry.findOneOrFail({
          where: { id },
          relations: ['company'] // Include relations in the response
        });
 /*    await this.branchRepositry.update(id,updateBranchDto);
    
    const updatedata = await this.branchRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata */
  }

  async remove(id: number):Promise<Branch> {
    const deletedata = await this.branchRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.branchRepositry.delete({ id: deletedata.id })
    return deletedata;
  }
}
