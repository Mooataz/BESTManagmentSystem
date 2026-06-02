export declare class CreateTransfertDto {
    delivredBy?: string;
    sendingDate?: Date;
    receivedDate?: Date;
    type?: string;
    frombranch?: number;
    sendUser?: number;
    receiveUser?: number;
    state?: string;
    remark?: string;
    repairIds?: number[];
    stockPartIds?: number[];
    tobranch?: number;
    typePart?: string;
}
