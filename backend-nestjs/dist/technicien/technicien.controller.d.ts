import { TechnicienService } from './technicien.service';
import { CreateTechnicienDto } from './dto/create-technicien.dto';
import { UpdateTechnicienDto } from './dto/update-technicien.dto';
export declare class TechnicienController {
    private readonly technicienService;
    constructor(technicienService: TechnicienService);
    create(createTechnicienDto: CreateTechnicienDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTechnicienDto: UpdateTechnicienDto): string;
    remove(id: string): string;
}
