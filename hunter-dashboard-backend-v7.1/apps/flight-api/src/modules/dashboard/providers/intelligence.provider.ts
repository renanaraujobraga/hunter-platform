import { Injectable } from '@nestjs/common';
import {
  DashboardIntelligenceItemDto,
  DashboardIntelligenceTone
} from '../dto/dashboard-response.dto';
import { DashboardRepository } from '../dashboard.repository';

@Injectable()
export class IntelligenceProvider {
  constructor(private readonly repository: DashboardRepository) {}

  async execute(): Promise<DashboardIntelligenceItemDto[]> {
    const alerts = await this.repository.findLatestAlerts(3);

    return alerts.map((alert) => {
      const hunter = alert.hunter;
      const currentPrice = hunter?.currentPrice ?? null;
      const previousPrice = hunter?.previousPrice ?? null;
      const hasPriceDrop =
        currentPrice !== null && previousPrice !== null && currentPrice < previousPrice;

      const tone: DashboardIntelligenceTone = hasPriceDrop ? 'OPPORTUNITY' : 'INFO';
      const route = hunter ? `${hunter.origin} → ${hunter.destination}` : 'monitoramento';
      const drop = hasPriceDrop ? Math.round(previousPrice - currentPrice) : 0;

      return {
        id: alert.id,
        tone,
        title: hasPriceDrop ? 'Oportunidade encontrada' : 'Atualização do Hunter',
        description: hasPriceDrop
          ? `${route} caiu R$ ${drop} em relação ao preço anterior.`
          : `${route} recebeu uma nova atualização.`,
        isRead: alert.isRead,
        createdAt: alert.createdAt.toISOString(),
        hunterId: hunter?.id ?? null
      };
    });
  }
}
