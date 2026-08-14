import { Injectable } from '@nestjs/common';
import { DashboardMetricsDto } from '../dto/dashboard-response.dto';
import { DashboardRepository } from '../dashboard.repository';

@Injectable()
export class MetricsProvider {
  constructor(private readonly repository: DashboardRepository) {}

  async execute(): Promise<DashboardMetricsDto> {
    const [hunters, activeHunters, criticalAlerts, pricesAnalyzed] = await Promise.all([
      this.repository.findActiveHunters(100),
      this.repository.countActiveHunters(),
      this.repository.countUnreadAlerts(),
      this.repository.countAnalyzedPrices()
    ]);

    const estimatedSavings = hunters.reduce(
      (total, hunter) =>
        total + Math.max(0, (hunter.previousPrice ?? 0) - (hunter.currentPrice ?? 0)),
      0
    );

    return {
      estimatedSavings: Math.round(estimatedSavings),
      activeHunters,
      pricesAnalyzed,
      criticalAlerts
    };
  }
}
