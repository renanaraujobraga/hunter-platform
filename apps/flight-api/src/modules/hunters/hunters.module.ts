import { Module } from '@nestjs/common';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { HuntersController } from './hunters.controller';
import { HuntersService } from './hunters.service';

@Module({
  imports: [MonitoringModule],
  controllers: [HuntersController],
  providers: [HuntersService],
})
export class HuntersModule {}
