import { CreateRepairDto } from './create-repair.dto';
declare const UpdateRepairDto_base: import("@nestjs/common").Type<Partial<CreateRepairDto>>;
export declare class UpdateRepairDto extends UpdateRepairDto_base {
    device?: number;
    user?: number;
}
export {};
