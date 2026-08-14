import { Module } from '@nestjs/common';
import { FLIGHT_PROVIDER } from './flight-provider.interface';
import { HunterSchedulerService } from './hunter-scheduler.service';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { MockFlightProvider } from './providers/mock-flight.provider';
import { ScoreEngineService } from './score-engine.service';

@Module({
  controllers: [MonitoringController],
  providers: [
    ScoreEngineService,
    MockFlightProvider,
    {
      provide: FLIGHT_PROVIDER,
      useExisting: MockFlightProvider,
    },
    MonitoringService,
    HunterSchedulerService,
  ],
  exports: [MonitoringService, ScoreEngineService],
})
export class MonitoringModule {}
