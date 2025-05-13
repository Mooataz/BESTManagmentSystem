import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class BinService {
  constructor ( @InjectRepository(Bin) private readonly  binRepositry:Repository<Bin>,
                @InjectRepository(Branch) private readonly  branchRepositry:Repository<Branch>,
                private appService: AppService){}

  async create(createBinDto: CreateBinDto):Promise<Bin> {
    createBinDto.name =this.appService.cleanSpaces(createBinDto.name)
    const branch = await this.branchRepositry.findOne({ where: { id: createBinDto.branch}})
    if (!branch) {throw new NotFoundException('No branch')};
    
    const newCreate = this.binRepositry.create({ ...createBinDto, branch})

    return await this.binRepositry.save(newCreate);
  }

  async findAll():Promise<Bin[]> {
    const findAll = await this.binRepositry.find()
    if (!findAll || findAll.length === 0){
      throw new NotFoundException('No Bin model found')
    }
    return findAll;  }

  async findOne(id: number):Promise<Bin> {
    const findOne = await this.binRepositry.findOne({ where : { id } })
    if (!findOne){
      throw new NotFoundException('No Bin available')
    }
    return findOne;  }

  async update(id: number, updateBinDto: UpdateBinDto):Promise<Bin> {
    
    const { branch , ...rest} = updateBinDto;
    let updateData: Partial<Bin> = { ...rest };

    if (updateBinDto.branch !== undefined) {
      const branch = await this.branchRepositry.findOne({ where: { id: updateBinDto.branch } });
      if (!branch) { throw new NotFoundException('No branch found'); }
      updateData.branch = branch; 
  }
  await this.binRepositry.update(id, updateData);
  const updatedBin = await this.binRepositry.findOne({ where: { id }, relations: ['branch'] });

    if (!updatedBin) {
        throw new NotFoundException('Reference not found to update');
    }

    return updatedBin;
  }

  async remove(id: number):Promise<Bin> {
    const deletedata = await this.binRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Bin not found for delete')
    }
    await this.binRepositry.delete({ id: deletedata.id })
    return deletedata;   }


    async findByBranchId(branchId: number): Promise<Bin[]> {
      return this.binRepositry
          .createQueryBuilder('bin')
          .leftJoinAndSelect('bin.branch', 'branch')
          .where('branch.id = :branchId', { branchId }) 
          .getMany();
  }

  async findByBranchIdAndType(branchId: number, type: string): Promise<Bin[]> {
    return this.binRepositry
        .createQueryBuilder('bin')
        .leftJoinAndSelect('bin.branch', 'branch')
        .where('branch.id = :branchId', { branchId }) 
        .andWhere('bin.type = :type', { type })
        .getMany();
}
}
