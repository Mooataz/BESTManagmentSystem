import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOutputListDto } from './dto/create-output-list.dto';
import { UpdateOutputListDto } from './dto/update-output-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OutputList } from './entities/output-list.entity';
import { In, Repository } from 'typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OutputListService {
  constructor ( @InjectRepository(OutputList) private readonly  outputListRepositry:Repository<OutputList>,
                @InjectRepository(Repair) private readonly repairRepository: Repository<Repair> ,
                @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
                @InjectRepository(User) private readonly userRepository: Repository<User>
){}

async create(createOutputListDto: CreateOutputListDto): Promise<OutputList> {
  const repair = await this.repairRepository.find({
      where: { id: In(createOutputListDto.repairIds) }
  });

  if (!repair.length) {
      throw new NotFoundException('No repair data found');
  }

  // Récupérer `customer` et `user` à partir de la base de données
  const customer = await this.customerRepository.findOne({
      where: { id: createOutputListDto.customer }
  });

  if (!customer) {
      throw new NotFoundException('Customer not found');
  }

  const user = await this.userRepository.findOne({
      where: { id: createOutputListDto.user }
  });

  if (!user) {
      throw new NotFoundException('User not found');
  }

  // Création d'un nouvel objet avec des entités complètes
  const newCreate = this.outputListRepositry.create({
      ...createOutputListDto,
      repair,  // Tableau d'objets Repair[]
      customer, // Objet Customer
      user      // Objet User
  });

  return await this.outputListRepositry.save(newCreate);
}

  async findAll(): Promise<OutputList[]> {
    const allfind= await this.outputListRepositry.find()
    if ( !allfind || allfind.length === 0){
      throw new NotFoundException("There is no data Available")
    }
    return allfind  }

  async findOne(id: number): Promise<OutputList> {
    const Onefin= await this.outputListRepositry.findOne({ where: { id } })
    if ( !Onefin){
      throw new NotFoundException("There is no user data Available")
    }
    return Onefin  }

async findByBranchId(branchId: number): Promise<OutputList[]> {
  const findAll = await this.outputListRepositry
        .createQueryBuilder("outputList")
        .leftJoinAndSelect("outputList.user", "user")
        .where("user.branch = :branchId", { branchId })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
} 

async findByUserId(userId: number): Promise<OutputList[]> {
  const findAll = await this.outputListRepositry
        .createQueryBuilder("outputList")
        .leftJoinAndSelect("outputList.user", "user")
        .where("user.id = :userId", { userId })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
}

async findByCustomerId(customerId: number): Promise<OutputList[]> {
  const findAll = await this.outputListRepositry
        .createQueryBuilder("outputList")
        .leftJoinAndSelect("outputList.customer", "customer")
        .where("customer.id = :customerId", { customerId })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
}
  /* async update(id: number, updateOutputListDto: UpdateOutputListDto): Promise<OutputList> {
    await this.outputListRepositry.update(id,updateOutputListDto);
    const updatedata = await this.outputListRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata  } */
/*     async update(id: number, updateOutputListDto: UpdateOutputListDto): Promise<OutputList> {
      const outputList = await this.outputListRepositry.findOne({ where: { id } });
  
      if (!outputList) {
          throw new NotFoundException(`OutputList with id ${id} not found`);
      }
  
      // Vérifier si `customer` est fourni et récupérer son objet complet
      let customer = await this.customerRepository.findOne({ where: { id: updateOutputListDto.customer } });
if (!customer) {
    customer = undefined; // Évite l'erreur de type
}

      if (updateOutputListDto.customer) {
          customer = await this.customerRepository.findOne({
              where: { id: updateOutputListDto.customer }
          });
  
          if (!customer) {
              throw new NotFoundException(`Customer with id ${updateOutputListDto.customer} not found`);
          }
      }
  
      // Mettre à jour avec l'objet `customer`
      await this.outputListRepositry.update(id, {
          ...updateOutputListDto,
          customer  // Remplace l'ID par l'objet Customer
      });
  
      return this.outputListRepositry.findOne({ where: { id } });
  } */
  
  async remove(id: number): Promise<OutputList> {
    const deletedata = await this.outputListRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.outputListRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
