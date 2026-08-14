import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import {
  DashboardFeedIcon,
  DashboardFeedTone,
  DashboardMonitoredTrip,
  DashboardRecommendation,
  DashboardResponse,
} from './dashboard.types';

const CITY_BY_IATA: Record<string, string> = {
  LIS: 'Lisboa',
  REC: 'Recife',
  SCL: 'Santiago',
  FLN: 'Florianópolis',
  GRU: 'São Paulo',
  GIG: 'Rio de Janeiro',
  FOR: 'Fortaleza',
};

@Injectable()
export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getSummary(userId: string): Promise<DashboardResponse> {
    const since24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      user,
      monitoredHunters,
      allActiveHunters,
      activeHunters,
      unreadAlerts,
      pricesAnalyzed,
      alerts,
    ] = await Promise.all([
      this.repository.findUser(userId),
      this.repository.findActiveHunters(userId, 3),
      this.repository.findActiveHunters(userId),
      this.repository.countActiveHunters(userId),
      this.repository.countUnreadAlerts(userId),
      this.repository.countPricesAnalyzedSince(userId, since24Hours),
      this.repository.findRecentAlerts(userId, 3),
    ]);

    const estimatedSavings = allActiveHunters.reduce(
      (total, hunter) =>
        total + Math.max(0, (hunter.previousPrice ?? 0) - (hunter.currentPrice ?? 0)),
      0,
    );

    const annualTarget = 5000;
    const progressPercentage = Number(
      Math.min(100, (estimatedSavings / annualTarget) * 100).toFixed(1),
    );
    const expectedProgress = annualTarget * 0.3744;

    return {
      briefing: {
        greeting: this.getGreeting(),
        userName: this.getFirstName(user?.name),
        importantUpdates: alerts.length,
        messages: this.buildBriefingMessages(pricesAnalyzed, alerts),
      },
      metrics: {
        estimatedSavings: Math.round(estimatedSavings),
        savingsVariation: 18,
        activeHunters,
        pricesAnalyzedLast24h: pricesAnalyzed,
        criticalAlerts: unreadAlerts,
      },
      annualGoal: {
        target: annualTarget,
        saved: Math.round(estimatedSavings),
        progressPercentage,
        paceDifference: Math.round(estimatedSavings - expectedProgress),
      },
      intelligenceFeed: alerts.map((alert) => ({
        id: alert.id,
        icon: this.mapFeedIcon(alert.severity),
        title: alert.title,
        text: alert.message,
        tone: this.mapFeedTone(alert.severity),
      })),
      monitoredTrips: monitoredHunters.map((hunter) => this.mapTrip(hunter)),
      generatedAt: new Date().toISOString(),
    };
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  private getFirstName(name?: string | null): string {
    return name?.trim().split(/\s+/)[0] || 'Renan';
  }

  private buildBriefingMessages(
    pricesAnalyzed: number,
    alerts: Array<{ title: string }>,
  ): string[] {
    return [
      `Hunter analisou ${pricesAnalyzed.toLocaleString('pt-BR')} tarifas nas últimas 24 horas.`,
      'Cruzando histórico de preços, teto definido e variação recente.',
      alerts[0]?.title ?? 'Nenhuma mudança crítica detectada.',
      'Monitoramento automático ativo.',
    ];
  }

  private mapTrip(hunter: {
    id: string;
    origin: string;
    destination: string;
    name: string;
    currentPrice: number | null;
    previousPrice: number | null;
    maxPrice: number | null;
    score: number;
  }): DashboardMonitoredTrip {
    return {
      id: hunter.id,
      city: CITY_BY_IATA[hunter.destination] ?? hunter.destination,
      route: hunter.name || `${hunter.origin} → ${hunter.destination}`,
      currentPrice: Math.round(hunter.currentPrice ?? 0),
      recommendation: this.getRecommendation(hunter),
    };
  }

  private getRecommendation(hunter: {
    currentPrice: number | null;
    previousPrice: number | null;
    maxPrice: number | null;
    score: number;
  }): DashboardRecommendation {
    const current = hunter.currentPrice ?? 0;
    const previous = hunter.previousPrice ?? 0;

    if (hunter.score >= 90 || (hunter.maxPrice !== null && current <= hunter.maxPrice * 0.92)) {
      return 'COMPRAR AGORA';
    }

    if (previous > 0 && current < previous * 0.97) {
      return 'AGUARDAR';
    }

    return 'ACOMPANHAR';
  }

  private mapFeedIcon(severity: string): DashboardFeedIcon {
    if (severity === 'PROMOTION' || severity === 'GOOD_DEAL' || severity === 'RARE') {
      return 'trending';
    }
    if (severity === 'BUY_NOW') return 'plane';
    return 'shield';
  }

  private mapFeedTone(severity: string): DashboardFeedTone {
    if (severity === 'PROMOTION' || severity === 'GOOD_DEAL') return 'green';
    if (severity === 'BUY_NOW' || severity === 'RARE') return 'purple';
    return 'blue';
  }
}
