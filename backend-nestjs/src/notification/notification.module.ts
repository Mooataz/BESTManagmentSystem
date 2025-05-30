import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeModel } from 'src/type-model/entities/type-model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './Entity/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
