import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CON } from './config/constants';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [MongooseModule.forRoot(MONGO_CON),TaskModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
