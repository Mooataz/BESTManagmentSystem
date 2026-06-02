import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
export declare class ReceptionistService {
    create(createReceptionistDto: CreateReceptionistDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateReceptionistDto: UpdateReceptionistDto): string;
    remove(id: number): string;
}
