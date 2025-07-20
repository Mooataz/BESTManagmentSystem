import { Repair } from '../repair/entities/repair.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Model } from 'src/models/entities/model.entity';
export declare class PdfService {
    private readonly companyRepository;
    private readonly legislationRepository;
    private readonly branchRepository;
    private readonly modelRepository;
    constructor(companyRepository: Repository<Company>, legislationRepository: Repository<Legislation>, branchRepository: Repository<Branch>, modelRepository: Repository<Model>);
    generatRepairPdf(repair: Repair): Promise<Buffer>;
    private drawTwoColumnBox;
    generatAddStockPdf(ids: number[]): Promise<Buffer>;
}
