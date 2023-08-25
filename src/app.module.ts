import { Module } from '@nestjs/common';
import { OrderSyncerController } from './api/orderSyncer.controller';
import { OrderSyncerService } from './api/orderSyncer.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './database/database.module';
import { getMongoConfig } from './configs/mongoConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './app/job.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JobModule,
  ],
  controllers: [OrderSyncerController],
  providers: [OrderSyncerService],
})
export class AppModule {}

