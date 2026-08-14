import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';
import { AnnualGoalProvider } from './providers/annual-goal.provider';
import { BriefingProvider } from './providers/briefing.provider';
import { IntelligenceProvider } from './providers/intelligence.provider';
import { MetricsProvider } from './providers/metrics.provider';
import { MonitoredTripsProvider } from './providers/monitored-trips.provider';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardRepository,
    MetricsProvider,
    AnnualGoalProvider,
    IntelligenceProvider,
    MonitoredTripsProvider,
    BriefingProvider
  ]
})
export class DashboardModule {}
