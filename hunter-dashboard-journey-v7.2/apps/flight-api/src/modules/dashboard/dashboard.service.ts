import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DashboardIcon,
  DashboardIntelligenceItemDto,
  DashboardMonitoredTripDto,
  DashboardRecommendation,
  DashboardResponseDto,
  DashboardTone
} from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<DashboardResponseDto> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [activeHunters, activeHunterCount, unreadAlerts, pricesAnalyzedLast24h, latestAlerts] =
      await Promise.all([
        this.prisma.hunter.findMany({
          where: { status: 'ACTIVE' },
          orderBy: [{ score: 'desc' }, { updatedAt: 'desc' }],
          take: 3
        }),
        this.prisma.hunter.count({ where: { status: 'ACTIVE' } }),
        this.prisma.alert.count({ where: { isRead: false } }),
        this.prisma.priceRecord.count({ where: { capturedAt: { gte: last24Hours } } }),
        this.prisma.alert.findMany({
          include: { hunter: true },
          orderBy: { createdAt: 'desc' },
          take: 3
        })
      ]);

    const estimatedSavings = activeHunters.reduce(
      (total, hunter) =>
        total + Math.max(0, (hunter.previousPrice ?? 0) - (hunter.currentPrice ?? 0)),
      0
    );

    const annualTarget = 5000;
    const progressPercentage = annualTarget > 0 ? (estimatedSavings / annualTarget) * 100 : 0;
    const expectedProgress = this.expectedAnnualProgress(now, annualTarget);
    const intelligenceFeed = this.buildIntelligenceFeed(latestAlerts, activeHunters);
    const importantUpdates = Math.max(unreadAlerts, intelligenceFeed.length);

    return {
      briefing: {
        greeting: this.getGreeting(now),
        userName: 'Renan',
        importantUpdates,
        headline:
          intelligenceFeed[0]?.title ??
          'Seus Hunters estão ativos e acompanhando novas oportunidades.',
        liveMessages: [
          `Hunter analisando ${pricesAnalyzedLast24h.toLocaleString('pt-BR')} tarifas nas últimas 24 horas...`,
          'Cruzando preços atuais com o histórico disponível...',
          intelligenceFeed[0]?.title ?? 'Monitoramentos atualizados há poucos segundos.',
          'Monitoramento atualizado há poucos segundos.'
        ]
      },
      metrics: {
        estimatedSavings: Math.round(estimatedSavings),
        estimatedSavingsVariation: 18,
        activeHunters: activeHunterCount,
        pricesAnalyzedLast24h,
        criticalAlerts: unreadAlerts
      },
      annualGoal: {
        target: annualTarget,
        saved: Math.round(estimatedSavings),
        progressPercentage: Number(progressPercentage.toFixed(1)),
        paceDifference: Math.round(estimatedSavings - expectedProgress)
      },
      intelligenceFeed,
      monitoredTrips: activeHunters.map((hunter) => this.mapHunter(hunter)),
      generatedAt: now.toISOString()
    };
  }

  private getGreeting(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  private expectedAnnualProgress(date: Date, target: number): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const end = new Date(date.getFullYear() + 1, 0, 1);
    const elapsed = date.getTime() - start.getTime();
    const total = end.getTime() - start.getTime();
    return target * Math.min(1, Math.max(0, elapsed / total));
  }

  private mapHunter(hunter: {
    id: string;
    name: string;
    origin: string;
    destination: string;
    currentPrice: number | null;
    previousPrice: number | null;
    score: number;
    confidence: number;
  }): DashboardMonitoredTripDto {
    return {
      id: hunter.id,
      city: this.destinationLabel(hunter.name, hunter.destination),
      route: `${hunter.origin} → ${hunter.destination}`,
      currentPrice: Math.round(hunter.currentPrice ?? 0),
      previousPrice: hunter.previousPrice == null ? null : Math.round(hunter.previousPrice),
      score: hunter.score,
      confidence: hunter.confidence,
      recommendation: this.recommendation(hunter.score)
    };
  }

  private destinationLabel(name: string, destination: string): string {
    const separators = ['→', '-', 'para'];
    for (const separator of separators) {
      if (name.includes(separator)) {
        const part = name.split(separator).at(-1)?.trim();
        if (part) return part;
      }
    }
    return name.trim() || destination;
  }

  private recommendation(score: number): DashboardRecommendation {
    if (score >= 90) return 'COMPRAR AGORA';
    if (score >= 70) return 'AGUARDAR';
    return 'ACOMPANHAR';
  }

  private buildIntelligenceFeed(
    alerts: Array<{
      id: string;
      title: string;
      message: string;
      severity: string;
      hunter: { score: number };
    }>,
    hunters: Array<{
      id: string;
      name: string;
      destination: string;
      currentPrice: number | null;
      previousPrice: number | null;
      score: number;
    }>
  ): DashboardIntelligenceItemDto[] {
    const fromAlerts = alerts.map((alert) => ({
      id: alert.id,
      icon: this.iconForSeverity(alert.severity),
      title: alert.title,
      text: alert.message,
      tone: this.toneForSeverity(alert.severity)
    }));

    if (fromAlerts.length >= 3) return fromAlerts.slice(0, 3);

    const usedIds = new Set(fromAlerts.map((item) => item.id));
    const derived = hunters
      .filter((hunter) => !usedIds.has(`hunter-${hunter.id}`))
      .map((hunter) => this.intelligenceFromHunter(hunter));

    return [...fromAlerts, ...derived].slice(0, 3);
  }

  private intelligenceFromHunter(hunter: {
    id: string;
    name: string;
    destination: string;
    currentPrice: number | null;
    previousPrice: number | null;
    score: number;
  }): DashboardIntelligenceItemDto {
    const destination = this.destinationLabel(hunter.name, hunter.destination);
    const current = hunter.currentPrice ?? 0;
    const previous = hunter.previousPrice ?? current;
    const difference = previous > 0 ? ((previous - current) / previous) * 100 : 0;

    if (hunter.score >= 90) {
      return {
        id: `hunter-${hunter.id}`,
        icon: 'plane',
        title: `Oportunidade encontrada para ${destination}`,
        text: `A tarifa atual recebeu score ${hunter.score} e merece sua atenção.`,
        tone: 'purple'
      };
    }

    if (difference > 0.5) {
      return {
        id: `hunter-${hunter.id}`,
        icon: 'trending',
        title: `${destination} apresentou queda`,
        text: `O preço está ${difference.toFixed(1).replace('.', ',')}% abaixo do registro anterior.`,
        tone: 'green'
      };
    }

    return {
      id: `hunter-${hunter.id}`,
      icon: 'shield',
      title: 'Nenhuma ação necessária',
      text: `${destination} permanece dentro da faixa esperada.`,
      tone: 'blue'
    };
  }

  private iconForSeverity(severity: string): DashboardIcon {
    if (['RARE', 'BUY_NOW', 'PROMOTION'].includes(severity)) return 'plane';
    if (severity === 'GOOD_DEAL') return 'trending';
    return 'shield';
  }

  private toneForSeverity(severity: string): DashboardTone {
    if (['RARE', 'BUY_NOW', 'PROMOTION'].includes(severity)) return 'purple';
    if (severity === 'GOOD_DEAL') return 'green';
    return 'blue';
  }
}
