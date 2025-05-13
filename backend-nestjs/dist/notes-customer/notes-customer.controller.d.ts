import { NotesCustomerService } from './notes-customer.service';
import { CreateNotesCustomerDto } from './dto/create-notes-customer.dto';
import { UpdateNotesCustomerDto } from './dto/update-notes-customer.dto';
export declare class NotesCustomerController {
    private readonly notesCustomerService;
    constructor(notesCustomerService: NotesCustomerService);
    create(createNotesCustomerDto: CreateNotesCustomerDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateNotesCustomerDto: UpdateNotesCustomerDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
