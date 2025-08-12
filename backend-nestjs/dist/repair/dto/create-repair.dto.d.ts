export declare class CreateRepairDto {
    actuellybranch: number;
    customer: number;
    device: number;
    remark: string;
    deviceStateReceive: string;
    accessoryIds: number[];
    listFaultIds: number[];
    customerRequestIds: number[];
    files: string[];
    notesCustomerIds: number[];
    expertiseReasonsIds: number[];
    repairActionIds: number[];
    warrenty?: boolean;
    approveRepair: boolean;
    newSerialNumber: string;
    advancePayment: number;
    user: number;
    partsNeed: number[];
}
