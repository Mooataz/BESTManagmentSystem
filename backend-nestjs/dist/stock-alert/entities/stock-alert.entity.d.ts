export declare class StockAlert {
    id: number;
    branchId: number;
    type: string;
    report: Record<string, any>[];
    readBy: string[];
    createdAt: Date;
}
