import { Injectable } from '@nestjs/common';
import { DashboardBriefingDto, DashboardIntelligenceItemDto } from '../dto/dashboard-response.dto';

@Injectable()
export class BriefingProvider {
  execute(feed: DashboardIntelligenceItemDto[], now = new Date()): DashboardBriefingDto {
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
    const unreadItems = feed.filter((item) => !item.isRead);
    const headline = unreadItems[0]?.description ?? feed[0]?.description ?? 'Seus Hunters seguem monitorando o mercado.';

    return {
      greeting,
      importantUpdates: unreadItems.length,
      headline,
      generatedAt: now.toISOString()
    };
  }
}
