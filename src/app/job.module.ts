import { Global, Module } from '@nestjs/common';

import { JobService } from './job.service';
import { DatabaseModule } from '../database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [JobService],
})
export class JobModule {}
