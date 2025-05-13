import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistributeurDto } from './dto/create-distributeur.dto';
import { UpdateDistributeurDto } from './dto/update-distributeur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Distributeur } from './entities/distributeur.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class DistributeurService {
  constructor ( @InjectRepository(Distributeur) private readonly  distributeurRepositry:Repository<Distributeur>,
                  private appService: AppService ){}

 async  create(createDistributeurDto: CreateDistributeurDto):Promise<Distributeur> {
  
        createDistributeurDto.name =this.appService.cleanSpaces(createDistributeurDto.name)
        createDistributeurDto.taxRegisterNumber =this.appService.cleanSpaces(createDistributeurDto.taxRegisterNumber)
        createDistributeurDto.location =this.appService.cleanSpaces(createDistributeurDto.location)

        const distributeur = this.distributeurRepositry.create(createDistributeurDto);
        return await this.distributeurRepositry.save(distributeur);
  }

  async  findAll():Promise<Distributeur[]> {
    const allDistributeurs= await this.distributeurRepositry.find()
      if ( !allDistributeurs || allDistributeurs.length === 0){
        throw new NotFoundException("There is no distributeurs data Available")
      }
      return allDistributeurs
  }

  async  findOne(id: number):Promise<Distributeur> {
    const OneDistributeur= await this.distributeurRepositry.findOne({ where: { id } })
    if ( !OneDistributeur){
      throw new NotFoundException("There is no distributeur data Available")
    }
    return OneDistributeur
  }

  async  update(id: number, updateDistributeurDto: UpdateDistributeurDto):Promise<Distributeur> {
    await this.distributeurRepositry.update(id,updateDistributeurDto);
    const updatedata = await this.distributeurRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('Distributeur Not found for update = failed')
    }

    return updatedata
  }

  async  remove(id: number):Promise<Distributeur> {
    const deletedata = await this.distributeurRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Distributeur Not found for delete = failed')
    }
    await this.distributeurRepositry.delete({ id: deletedata.id })
    return deletedata;
  }
}
