import { ReferencesService } from './references.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
export declare class ReferencesController {
    private readonly referencesService;
    constructor(referencesService: ReferencesService);
    create(createReferenceDto: CreateReferenceDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateReferenceDto: UpdateReferenceDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getCompatibleReferences(modelId: number, partId: number, res: any): Promise<any>;
    getByMaterialCode(materialCode: string, res: any): Promise<any>;
}
