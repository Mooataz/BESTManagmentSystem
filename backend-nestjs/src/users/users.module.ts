import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';


@Module({
  imports: [TypeOrmModule.forFeature([User,Permission ,Branch ])],
  controllers: [UsersController],
  providers: [UsersService,AppService],
  exports:[UsersService]
})
export class UsersModule {}
