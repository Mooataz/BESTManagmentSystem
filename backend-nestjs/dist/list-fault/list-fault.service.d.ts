import { CreateListFaultDto } from './dto/create-list-fault.dto';
import { UpdateListFaultDto } from './dto/update-list-fault.dto';
import { ListFault } from './entities/list-fault.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class ListFaultService {
    private readonly listFaultRepositry;
    private appService;
    constructor(listFaultRepositry: Repository<ListFault>, appService: AppService);
    create(createListFaultDto: CreateListFaultDto): Promise<ListFault>;
    findAll(): Promise<ListFault[]>;
    findOne(id: number): Promise<ListFault>;
    update(id: number, updateListFaultDto: UpdateListFaultDto): Promise<ListFault>;
    remove(id: number): Promise<ListFault>;
}
