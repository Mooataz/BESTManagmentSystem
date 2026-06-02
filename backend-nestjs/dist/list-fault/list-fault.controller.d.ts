import { ListFaultService } from './list-fault.service';
import { CreateListFaultDto } from './dto/create-list-fault.dto';
import { UpdateListFaultDto } from './dto/update-list-fault.dto';
export declare class ListFaultController {
    private readonly listFaultService;
    constructor(listFaultService: ListFaultService);
    create(createListFaultDto: CreateListFaultDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateListFaultDto: UpdateListFaultDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
