import { Branch } from 'src/branches/entities/branch.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { OutputList } from 'src/output-list/entities/output-list.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
export declare class User {
    id: number;
    name: string;
    phone: number;
    password: string;
    createdDate: Date;
    status: string;
    login: string;
    role: string[];
    branch: Branch;
    permissions: Permission[];
    repair: Repair[];
    tracability: Tracability[];
    outputList: OutputList[];
    invoice: Invoice[];
    sale: Sale[];
    refreshToken: string | null;
}
