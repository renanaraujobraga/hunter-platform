import { Injectable } from '@nestjs/common';
import { DashboardMonitoredTripDto } from '../dto/dashboard-response.dto';
import { DashboardRepository } from '../dashboard.repository';

@Injectable()
export class MonitoredTripsProvider {
  constructor(private readonly repository: DashboardRepository) {}

  async execute(): Promise<DashboardMonitoredTripDto[]> {
    const hunters = await this.repository.findActiveHunters(6);

    return hunters.map((hunter) => {
      const currentPrice = hunter.currentPrice ?? null;
      const previousPrice = hunter.previousPrice ?? null;
      const savings = Math.max(0, (previousPrice ?? 0) - (currentPrice ?? 0));
      const variationPercentage =
        previousPrice && currentPrice
          ? Number((((currentPrice - previousPrice) / previousPrice) * 100).toFixed(1))
          : null;

      return {
        id: hunter.id,
        name: hunter.name,
        origin: hunter.origin,
        destination: hunter.destination,
        status: hunter.status,
        currentPrice,
        previousPrice,
        savings: Math.round(savings),
        variationPercentage,
        updatedAt: hunter.updatedAt.toISOString()
      };
    });
  }
}
