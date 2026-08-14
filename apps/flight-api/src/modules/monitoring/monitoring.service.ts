import { AlertSeverity } from '@prisma/client';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  FLIGHT_PROVIDER,
  FlightProvider,
} from './flight-provider.interface';
import { ScoreEngineService } from './score-engine.service';

@Injectable()
export class MonitoringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoreEngine: ScoreEngineService,
    @Inject(FLIGHT_PROVIDER) private readonly provider: FlightProvider,
  ) {}

  async runHunter(hunterId: string, userId?: string) {
    const hunter = await this.prisma.hunter.findFirst({
      where: {
        id: hunterId,
        ...(userId ? { userId } : {}),
      },
    });

    if (!hunter) throw new NotFoundException('Hunter não encontrado.');

    const history = await this.prisma.priceRecord.findMany({
      where: { hunterId },
      orderBy: { capturedAt: 'desc' },
      take: 20,
      select: { price: true },
    });

    const quote = await this.provider.getQuote(hunter);
    const result = this.scoreEngine.evaluate({
      price: quote.price,
      previousPrice: hunter.currentPrice ?? hunter.previousPrice,
      maxPrice: hunter.maxPrice,
      historyPrices: history.map((item) => item.price),
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.priceRecord.create({
        data: {
          hunterId,
          price: quote.price,
          currency: quote.currency,
          source: quote.source,
          capturedAt: quote.capturedAt,
        },
      });

      await tx.hunter.update({
        where: { id: hunterId },
        data: {
          previousPrice: hunter.currentPrice ?? hunter.previousPrice,
          currentPrice: quote.price,
          score: result.score,
          confidence: result.confidence,
        },
      });

      if (result.score >= 75) {
        const recentAlert = await tx.alert.findFirst({
          where: {
            hunterId,
            isRead: false,
            severity: result.severity,
            createdAt: {
              gte: new Date(Date.now() - 6 * 60 * 60 * 1000),
            },
          },
          select: { id: true },
        });

        if (!recentAlert) {
          await tx.alert.create({
            data: {
              hunterId,
              title: this.getAlertTitle(result.severity),
              message: `${hunter.origin} → ${hunter.destination}: R$ ${quote.price.toFixed(
                2,
              )}, score ${result.score}. ${result.reasons[0]}`,
              severity: result.severity,
            },
          });
        }
      }
    });

    return {
      hunterId,
      quote,
      ...result,
    };
  }

  async runAllActive() {
    const hunters = await this.prisma.hunter.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });

    const results = [];
    for (const hunter of hunters) {
      try {
        results.push(await this.runHunter(hunter.id));
      } catch (error) {
        results.push({
          hunterId: hunter.id,
          error: error instanceof Error ? error.message : 'Falha desconhecida',
        });
      }
    }

    return {
      processed: hunters.length,
      results,
      generatedAt: new Date().toISOString(),
    };
  }

  private getAlertTitle(severity: AlertSeverity): string {
    if (severity === AlertSeverity.RARE) return '💎 Oferta rara detectada';
    if (severity === AlertSeverity.BUY_NOW) return '🚨 Comprar agora';
    if (severity === AlertSeverity.PROMOTION) return '🔥 Promoção encontrada';
    if (severity === AlertSeverity.GOOD_DEAL) return '🟢 Boa oportunidade';
    return 'Atualização do Hunter';
  }
}
