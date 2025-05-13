export declare class CreateRepairDto {
    warrenty?: boolean;
    approveRepair?: boolean;
    files?: string[];
    newSerialNumber?: string;
    advancePayment?: number;
    actuellyBranch: number;
    partsNeed?: number[];
    remark?: string;
    deviceStateReceive?: string;
    accessoryIds: number[];
    listFaultIds: number[];
    customerRequestIds: number[];
    notesCustomerIds: number[];
    expertiseReasonsIds: number[];
    repairActionIds: number[];
    device: number;
    user: number;
}
