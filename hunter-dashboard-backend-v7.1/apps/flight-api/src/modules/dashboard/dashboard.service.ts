import { Injectable } from '@nestjs/common';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { AnnualGoalProvider } from './providers/annual-goal.provider';
import { BriefingProvider } from './providers/briefing.provider';
import { IntelligenceProvider } from './providers/intelligence.provider';
import { MetricsProvider } from './providers/metrics.provider';
import { MonitoredTripsProvider } from './providers/monitored-trips.provider';

@Injectable()
export class DashboardService {
  constructor(
    private readonly metricsProvider: MetricsProvider,
    private readonly annualGoalProvider: AnnualGoalProvider,
    private readonly intelligenceProvider: IntelligenceProvider,
    private readonly monitoredTripsProvider: MonitoredTripsProvider,
    private readonly briefingProvider: BriefingProvider
  ) {}

  async getSummary(): Promise<DashboardResponseDto> {
    const [metrics, intelligenceFeed, monitoredTrips] = await Promise.all([
      this.metricsProvider.execute(),
      this.intelligenceProvider.execute(),
      this.monitoredTripsProvider.execute()
    ]);

    return {
      briefing: this.briefingProvider.execute(intelligenceFeed),
      metrics,
      annualGoal: this.annualGoalProvider.execute(metrics.estimatedSavings),
      intelligenceFeed,
      monitoredTrips
    };
  }
}
