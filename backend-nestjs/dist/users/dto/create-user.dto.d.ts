export declare class CreateUserDto {
    name: string;
    phone: number;
    login: string;
    password: string;
    createdDate: Date;
    status: string;
    role: string;
    permissionsIds: number[];
    branch?: number;
}
