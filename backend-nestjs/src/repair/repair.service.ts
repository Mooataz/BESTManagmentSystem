import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair } from './entities/repair.entity';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { ListFault } from 'src/list-fault/entities/list-fault.entity';
import { CreateListFaultDto } from 'src/list-fault/dto/create-list-fault.dto';
import { CustomerRequest } from 'src/customer-request/entities/customer-request.entity';
import { NotesCustomer } from 'src/notes-customer/entities/notes-customer.entity';
import { ExpertiseReason } from 'src/expertise-reasons/entities/expertise-reason.entity';
import { RepairAction } from 'src/repair-action/entities/repair-action.entity';
import { AppService } from 'src/app.service';
import { Device } from 'src/devices/entities/device.entity';
import { User } from 'src/users/entities/user.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { SelectQueryBuilder } from 'typeorm';
@Injectable()
export class RepairService {

  constructor(@InjectRepository(Repair) private readonly repairRepositry: Repository<Repair>,
    @InjectRepository(Accessory) private readonly accessoryRepositry: Repository<Accessory>,
    @InjectRepository(ListFault) private readonly listFaultRepositry: Repository<ListFault>,
    @InjectRepository(CustomerRequest) private readonly customerRequestRepositry: Repository<CustomerRequest>,
    @InjectRepository(NotesCustomer) private readonly notesCustomerRepositry: Repository<NotesCustomer>,
    @InjectRepository(ExpertiseReason) private readonly expertiseReasonRepositry: Repository<ExpertiseReason>,
    @InjectRepository(RepairAction) private readonly repairActionRepositry: Repository<RepairAction>,
    @InjectRepository(Device) private readonly deviceRepositry: Repository<Device>,
    @InjectRepository(User) private readonly userRepositry: Repository<User>,
    @InjectRepository(StockPart) private readonly stockPartRepositry: Repository<StockPart>,
    @InjectRepository(ApproveStock) private readonly approveStockRepositry: Repository<ApproveStock>,
    @InjectRepository(Customer) private readonly customerRepositry: Repository<Customer>,
    @InjectRepository(HistoryRepair) private readonly historyRepairRepositry: Repository<HistoryRepair>,
    @InjectRepository(Tracability) private readonly tracabilityRepositry: Repository<Tracability>,




  ) { }
  async create(createRepairDto: CreateRepairDto, userId: number): Promise<Repair> {

    const accessory = await this.accessoryRepositry.find({
      where: { id: In(createRepairDto.accessoryIds ?? []) }
    });
    const listFault = await this.listFaultRepositry.find({
      where: { id: In(createRepairDto.listFaultIds ?? []) }
    });
    const customerRequest = await this.customerRequestRepositry.find({
      where: { id: In(createRepairDto.customerRequestIds ?? []) }
    });

    // Fetch single entities (not arrays)
    const device = await this.deviceRepositry.findOne({
      where: { id: createRepairDto.device }
    });
    const customer = await this.customerRepositry.findOne({
      where: { id: createRepairDto.customer }
    })

    if (!listFault.length) throw new NotFoundException('No Fault found');
    if (!device) throw new NotFoundException('Device not found');

 
    // Create the repair entity with required fields
    const repairData = {
      actuellyBranch: createRepairDto.actuellybranch,
      remark: createRepairDto.remark,
      deviceStateReceive: createRepairDto.deviceStateReceive,
      accessory,
      listFault,
      customerRequest,
      device: { id: createRepairDto.device },
      customer: { id: createRepairDto.customer },

    };


    const newCreate = this.repairRepositry.create(repairData);
    const savedRepair = await this.repairRepositry.save(newCreate);


    // 2. Créer l'historique
    const history = this.historyRepairRepositry.create({
      date: new Date(),
      step: 'Création',
      repair: { id: savedRepair.id },
    });
    const savedHistory = await this.historyRepairRepositry.save(history);

    // 3. Créer la traçabilité
    const tracability = this.tracabilityRepositry.create({
      historyRepair: { id: savedHistory.id },
      user: { id: userId },
    });
    await this.tracabilityRepositry.save(tracability);
    return savedRepair
  }


  async findAll(): Promise<Repair[]> {
    const allfind = await this.repairRepositry.find({
    relations: ['device','device.model', 'device.model.brand', 'customer'], // 👈 ajoute les relations nécessaires ici
  })
  
    if (!allfind || allfind.length === 0) {
      throw new NotFoundException('There is no data available')
    }
    return allfind;
  }

  async findOne(id: number): Promise<Repair> {
    const onefind = await this.repairRepositry.findOne({
      where: { id },
      relations: ['customer', 'customer.distributer',
                  'device','device.model', 'device.model.brand',
                  'accessory',
                  'listFault',
                  'customerRequest',
                  'historyRepair', 'historyRepair.tracability', 'historyRepair.tracability.user','historyRepair.tracability.user.branch','historyRepair.tracability.user.branch.company'],
    })
    if (!onefind) {
      throw new NotFoundException('No data available')
    }
    return onefind;
  }


  async update(id: number, updateRepairDto: UpdateRepairDto): Promise<Repair> {
    const existingRepair = await this.repairRepositry.findOne({ where: { id }, });
    if (!existingRepair) { throw new NotFoundException('Repair not found'); }

    // Handle device relation
    let device: Device | undefined = undefined;
    if (updateRepairDto.device !== undefined) {
      const foundDevice = await this.deviceRepositry.findOne({ where: { id: updateRepairDto.device } });
      if (!foundDevice) { throw new NotFoundException('Device not found'); }
      device = foundDevice;
    }

    // Handle user relation
    let user: User | undefined = undefined;
    if (updateRepairDto.user !== undefined) {
      const foundUser = await this.userRepositry.findOne({ where: { id: updateRepairDto.user } });
      if (!foundUser) { throw new NotFoundException('User not found'); }
      user = foundUser;
    }
    let customer: Customer | undefined = undefined;
    if (updateRepairDto.customer !== undefined) {
      const foundCustomer = await this.customerRepositry.findOne({ where: { id: updateRepairDto.customer } });
      if (!foundCustomer) { throw new NotFoundException('Customer not found'); }
      customer = foundCustomer;
    }
    // Prepare the update data
    const updateData: Partial<Repair> = {
      ...updateRepairDto,
      device: device ?? existingRepair.device,
      user: user ?? existingRepair.user,
      customer: customer ?? existingRepair.customer
    };

    // Remove the ID fields if they exist in the DTO

    delete (updateData as any).deviceId;
    delete (updateData as any).userId;
    delete (updateData as any).customerId;

    await this.repairRepositry.update(id, updateData);

    return this.repairRepositry.findOneOrFail({
      where: { id },
      relations: ['device', 'user'] // Include relations in the response
    });
  }


  async remove(id: number): Promise<Repair> {
    const deletedata = await this.repairRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete')
    }
    await this.repairRepositry.delete({ id: deletedata.id })
    return deletedata;
  }


  async filterRepairByDevice(deviceId: number): Promise<Repair[]> {
    return this.repairRepositry
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.device', 'device')
      .where('device.id = :deviceId', { deviceId })
      .getMany();
  }

  async filterRepairByUser(userId: number): Promise<Repair[]> {
    return this.repairRepositry
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async filterByNewSerialNumber(newSerialNumber: number): Promise<Repair[]> {
    const findAll = await this.repairRepositry
      .createQueryBuilder('repair')
      .where('newSerialNumber = :newSerialNumber', { newSerialNumber })
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }

    async filterByActuellyBranch(actuellyBranch: number): Promise<Repair[]> {
    const findAll = await this.repairRepositry.find({
    where: {
      actuellybranch: actuellyBranch,
       
    },
    relations: [
      'customer', 'customer.distributer',
      'device', 'device.model', 'device.model.brand',
      'accessory',
      'listFault',
      'customerRequest',
      'historyRepair',
      'historyRepair.tracability',
      'historyRepair.tracability.user',
      'historyRepair.tracability.user.branch',
      'historyRepair.tracability.user.branch.company'
    ],  order: {
      id: 'DESC' 
    }
  });
       
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }
  
async findByBranchAndStep(branchId: number, step: string): Promise<Repair[]> {
  const allRepairs = await this.repairRepositry.find({
    where: {
      actuellybranch: branchId
    },
    relations: [
      'customer', 'customer.distributer',
      'device', 'device.model', 'device.model.brand',
      'accessory',
      'listFault',
      'customerRequest',
      'historyRepair',
      'historyRepair.tracability',
      'historyRepair.tracability.user',
      'historyRepair.tracability.user.branch',
      'historyRepair.tracability.user.branch.company',
      'user'
    ],
    order: {
      historyRepair: {
        date: 'DESC' // pour que le dernier soit en premier
      }
    }
  });

  // Filtrer en mémoire : garder seulement ceux dont le dernier step correspond
  const filtered = allRepairs.filter(repair => {
    const history = repair.historyRepair;
    if (!history || history.length === 0) return false;

    const lastStep = history[0].step; // grâce au tri DESC
    return lastStep === step;
  });

  return filtered;
}


  async updateRepairWithParts(
    repairId: number,
    updateData: UpdateRepairDto, // <-- Garde bien ici le type UpdateRepairDto
  ): Promise<Repair> {
    const repair = await this.repairRepositry.findOne({
      where: { id: repairId },
      relations: ['approveStock'],
    });

    if (!repair) {
      throw new NotFoundException('Repair not found');
    }

    // Gérer les relations ManyToOne
    if (updateData.device && typeof updateData.device === 'number') {
      const device = await this.deviceRepositry.findOneBy({ id: updateData.device });
      if (!device) throw new NotFoundException('Device not found');
      repair.device = device;
    }

    if (updateData.user && typeof updateData.user === 'number') {
      const user = await this.userRepositry.findOneBy({ id: updateData.user });
      if (!user) throw new NotFoundException('User not found');
      repair.user = user;
    }

    const addedParts = repair.partsNeed || [];
    //const addedParts = updateData.partsNeed || [];

    // Filtrer les nouvelles pièces
    //const addedParts = newParts.filter(p => !previousParts.includes(p));

    // Supprimer `device` et `user` du DTO pour éviter la collision de type
    const { device, user, ...restData } = updateData;

    // Mise à jour des autres champs
    Object.assign(repair, restData);

    const updatedRepair = await this.repairRepositry.save(repair);

    if (repair.approveRepair === true) {
      // Ajout des nouveaux éléments dans ApproveStock
      for (const partId of addedParts) {
        const stockPart = await this.stockPartRepositry.findOneBy({ id: partId });
        if (!stockPart) continue;

        const approveStock = this.approveStockRepositry.create({
          type: 'Repair',
          date: new Date(),
          state: 'pending',
          idPartRepair: partId,
          //stockPart,
          repair: updatedRepair,
        });
        await this.approveStockRepositry.save(approveStock);
      }
    }


    return updatedRepair;
  }
async FiltreByUserStep (userId: number, steps: string): Promise<Repair[]> {

  const filtreuserId = await this.repairRepositry.find({
    where: {
      user: { id: userId},
      

    },
    relations: [
      'customer', 'customer.distributer',
      'device', 'device.model', 'device.model.brand',
      'accessory',
      'listFault',
      'customerRequest',
      'historyRepair',
      'historyRepair.tracability',
      'historyRepair.tracability.user',
      'historyRepair.tracability.user.branch',
      'historyRepair.tracability.user.branch.company',
      'user'
    ],
    order: {
      historyRepair: {
        date: 'DESC' // pour que le dernier soit en premier
      }
    }
  })
  // Filtrer en mémoire : garder seulement ceux dont le dernier step correspond
  const filtered = filtreuserId.filter(repair => {
    const history = repair.historyRepair;
    if (!history || history.length === 0) return false;

    const lastStep = history[0].step; // grâce au tri DESC
    return lastStep === steps;
  });
  return filtered
}
}
