import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeModel } from 'src/type-model/entities/type-model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './Entity/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Branch])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
