import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class UsersService {
  constructor ( @InjectRepository(User) private readonly  userRepositry:Repository<User>,
                @InjectRepository(Permission) private readonly  permissionRepositry:Repository<Permission>,
                @InjectRepository(Branch) private readonly  branchRepositry:Repository<Branch>,
                private appService: AppService 
                )
                {}

  async create(createUserDto: CreateUserDto):Promise<User> {
    createUserDto.name =this.appService.cleanSpaces(createUserDto.name)
    createUserDto.login =this.appService.cleanSpaces(createUserDto.login)

    const branch = createUserDto.branch ? await this.branchRepositry.findOne({ where: { id: createUserDto.branch } }):undefined;
    if (!branch) { throw new NotFoundException("No valid branch found.");}

    const newCreate =  this.userRepositry.create( { ...createUserDto , branch: branch || undefined ,role: Array.isArray(createUserDto.role)
      ? createUserDto.role : [createUserDto.role], })
    return await this.userRepositry.save(newCreate);

    
  }
 

  async findAll():Promise<User[]> {
    const allUsers= await this.userRepositry.find({relations: ['branch'],})
      if ( !allUsers || allUsers.length === 0){
        throw new NotFoundException("There is no users data Available")
      }
      return allUsers
  }

  async findOne(id: number):Promise<User> {
    const OneUser= await this.userRepositry.findOne({ where: { id } })
    if ( !OneUser){
      throw new NotFoundException("There is no user data Available")
    }
    return OneUser
  }


async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  const { branch,  ...rest } = updateUserDto; // Exclure branch et permissionsIds de updateUserDto

  const updateData: Partial<User> = { ...rest,    role: rest.role ? (Array.isArray(rest.role) ? rest.role : [rest.role]) : undefined,
  };

  // Vérifier si une mise à jour de branch est nécessaire
  if (branch) {
      const branchEntity = await this.branchRepositry.findOne({ where: { id: branch } });
      if (!branchEntity) {
          throw new NotFoundException("Branch not found");
      }
      updateData.branch = branchEntity; // Assigner l'entité Branch
  }
 
   
  await this.userRepositry.update(id, updateData);

  const updatedUser = await this.userRepositry.findOne({ where: { id }, relations: ['branch'/* , 'permissions' */] });
  if (!updatedUser) {
      throw new NotFoundException('User not found after update');
  }

  return updatedUser;
}

  async remove(id: number):Promise<User> {
    const deletedata = await this.userRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('user Not found for delete = failed')
    }
    await this.userRepositry.delete(id)
    return deletedata;
  }

  async findByBranchId(branchId: number): Promise<User[]> {
    const findAll = await this.userRepositry
          .createQueryBuilder("User")
          .leftJoinAndSelect("User.branch", "branch")
          .where("branch.id = :branchId", { branchId })
          .getMany();
    if (!findAll || findAll.length === 0) {
          throw new NotFoundException("There is no data Available") }
      return findAll
  }

  async findByStatus(status: string): Promise<User[]> {
    const findAll = await this.userRepositry
          .createQueryBuilder("User")
          .where("status = :status", { status })
          .getMany();
    if (!findAll || findAll.length === 0) {
          throw new NotFoundException("There is no data Available") }
      return findAll
  }

  async findUserByLogin( login: string): Promise<User> {
    const userByLogin = await this.userRepositry.findOne({ where: {login}});
    if(!userByLogin) { throw new NotFoundException('User not found')};
    return userByLogin;
  }


  async getUsersByRole(role: string):Promise<User[]>{
    return this.userRepositry.find({ where: {role} });
  }

  async getAllUsersSortedByRole():Promise<User[]>{
    return this.userRepositry
      .createQueryBuilder('user')
      .orderBy('user.role','ASC')
      .addOrderBy('user.name','ASC')
      .getMany();
  }

}
