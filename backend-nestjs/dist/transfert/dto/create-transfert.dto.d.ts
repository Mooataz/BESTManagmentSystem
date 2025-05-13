export declare class CreateTransfertDto {
    delivredBy: string;
    sendingDate: Date;
    receivedDate: Date;
    type: string;
    state: string;
    remark: string;
    repairIds: number[];
    stockPartIds: number[];
    toBranch: number;
}
