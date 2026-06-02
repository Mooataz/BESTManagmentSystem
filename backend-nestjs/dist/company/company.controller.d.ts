import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(createCompanyDto: CreateCompanyDto, res: any, logo: Express.Multer.File): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateCompanyDto: UpdateCompanyDto, res: any, logo: Express.Multer.File): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
