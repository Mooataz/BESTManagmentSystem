import { ReceptionistService } from './receptionist.service';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
export declare class ReceptionistController {
    private readonly receptionistService;
    constructor(receptionistService: ReceptionistService);
    create(createReceptionistDto: CreateReceptionistDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateReceptionistDto: UpdateReceptionistDto): string;
    remove(id: string): string;
}
