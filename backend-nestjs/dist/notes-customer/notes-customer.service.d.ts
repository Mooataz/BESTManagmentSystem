import { CreateNotesCustomerDto } from './dto/create-notes-customer.dto';
import { UpdateNotesCustomerDto } from './dto/update-notes-customer.dto';
import { NotesCustomer } from './entities/notes-customer.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class NotesCustomerService {
    private readonly notesCustomerRepositry;
    private appService;
    constructor(notesCustomerRepositry: Repository<NotesCustomer>, appService: AppService);
    create(createNotesCustomerDto: CreateNotesCustomerDto): Promise<NotesCustomer>;
    findAll(): Promise<NotesCustomer[]>;
    findOne(id: number): Promise<NotesCustomer>;
    update(id: number, updateNotesCustomerDto: UpdateNotesCustomerDto): Promise<NotesCustomer>;
    remove(id: number): Promise<NotesCustomer>;
}
