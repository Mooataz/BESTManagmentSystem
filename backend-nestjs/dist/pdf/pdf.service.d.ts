import { Repair } from '../repair/entities/repair.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { Branch } from 'src/branches/entities/branch.entity';
export declare class PdfService {
    private readonly companyRepository;
    private readonly legislationRepository;
    private readonly branchRepository;
    constructor(companyRepository: Repository<Company>, legislationRepository: Repository<Legislation>, branchRepository: Repository<Branch>);
    generatRepairPdf(repair: Repair): Promise<Buffer>;
    private drawTwoColumnBox;
}
