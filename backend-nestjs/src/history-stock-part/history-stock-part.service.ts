import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoryStockPartDto } from './dto/create-history-stock-part.dto';
import { UpdateHistoryStockPartDto } from './dto/update-history-stock-part.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryStockPart } from './entities/history-stock-part.entity';
import { User } from 'src/users/entities/user.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';

@Injectable()
export class HistoryStockPartService {
  constructor ( @InjectRepository(HistoryStockPart) private readonly  historyStockPartRepositry:Repository<HistoryStockPart>,
                @InjectRepository(User) private readonly userRepositry:Repository<User>,
              @InjectRepository(Tracability) private readonly tracabilityRepositry:Repository<Tracability>,
            @InjectRepository(StockPart) private readonly stockPartRepositry:Repository<StockPart>,){}

  async create(/* createHistoryStockPartDto: CreateHistoryStockPartDto */ data:any):Promise<HistoryStockPart> {
    const stockPart = await this.stockPartRepositry.findOne({ where: {id: data.stockPart}});
    if (!stockPart) throw new NotFoundException('stockPart not found');
     
    const user = await this.userRepositry.findOne({ where: { id: data.user?.id } }); // ⬅️ AJOUTER CECI
  if (!user) throw new NotFoundException('user not found');
   
  const createHistoryStockPartDto ={
      step: data.step,
      date: data.date,
      stockPart: data.stockPart
   }
   const newCreate  = this.historyStockPartRepositry.create(createHistoryStockPartDto)

   const saveHist = await this.historyStockPartRepositry.save(newCreate);
    const tracData ={
      user: user,
      stockPart:saveHist
    }
    const newTrac =  await this.tracabilityRepositry.create(tracData)
    await this.tracabilityRepositry.save(newTrac);
    return saveHist 

  }

  async findAll():Promise<HistoryStockPart[]> {
    const allfind = await this.historyStockPartRepositry.find()

    if (!allfind || allfind.length === 0) { throw new NotFoundException ("There is no data available") }
    return allfind  }

  async findOne(id: number):Promise<HistoryStockPart> {
    const Onefind= await this.historyStockPartRepositry.findOne({ where: { id } })

    if ( !Onefind) { throw new NotFoundException("There is no data Available")}
    return Onefind  }

  async update(id: number, updateHistoryStockPartDto: UpdateHistoryStockPartDto):Promise<HistoryStockPart> {
    await this.historyStockPartRepositry.update(id,updateHistoryStockPartDto);
    const updatedata = await this.historyStockPartRepositry.findOne({where :{ id }})
    if (!updatedata) { throw new NotFoundException('data Not found for update = failed')}

    return updatedata  }

  async remove(id: number):Promise<HistoryStockPart> {
    const deletedata = await this.historyStockPartRepositry.findOne ({where: {id}});
    if (!deletedata) { throw new NotFoundException('data Not found for delete = failed')}
    
    await this.historyStockPartRepositry.delete({ id: deletedata.id })
    return deletedata;  }

  async findByStockPartId(stockPartId: number): Promise<HistoryStockPart[]> {
    return this.historyStockPartRepositry
            .createQueryBuilder('historyStockPart')
            .leftJoinAndSelect('historyStockPart.stockPart', 'stockPart')
            .where('stockPart.id = :stockPartId', { stockPartId }) // Filtre sur l'ID de repair
            .getMany();
    }
      
}
