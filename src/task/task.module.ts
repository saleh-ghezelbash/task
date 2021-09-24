import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
