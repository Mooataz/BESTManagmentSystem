import { CreateTechnicienDto } from './dto/create-technicien.dto';
import { UpdateTechnicienDto } from './dto/update-technicien.dto';
export declare class TechnicienService {
    create(createTechnicienDto: CreateTechnicienDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTechnicienDto: UpdateTechnicienDto): string;
    remove(id: number): string;
}
