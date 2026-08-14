import { AlertSeverity } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export type HunterRecommendation = 'COMPRAR AGORA' | 'BOA OPORTUNIDADE' | 'ACOMPANHAR';

export interface ScoreInput {
  price: number;
  previousPrice?: number | null;
  maxPrice?: number | null;
  historyPrices?: number[];
}

export interface ScoreResult {
  score: number;
  confidence: number;
  recommendation: HunterRecommendation;
  severity: AlertSeverity;
  reasons: string[];
}

@Injectable()
export class ScoreEngineService {
  evaluate(input: ScoreInput): ScoreResult {
    let score = 50;
    const reasons: string[] = [];
    const history = input.historyPrices ?? [];

    if (input.maxPrice && input.maxPrice > 0) {
      const ratio = input.price / input.maxPrice;

      if (ratio <= 0.8) {
        score += 35;
        reasons.push('Preço pelo menos 20% abaixo do teto definido.');
      } else if (ratio <= 0.9) {
        score += 28;
        reasons.push('Preço pelo menos 10% abaixo do teto definido.');
      } else if (ratio <= 1) {
        score += 20;
        reasons.push('Preço dentro do teto definido.');
      } else if (ratio <= 1.1) {
        score += 5;
        reasons.push('Preço pouco acima do teto definido.');
      } else {
        score -= Math.min(25, Math.round((ratio - 1) * 60));
        reasons.push('Preço acima do teto definido.');
      }
    }

    if (input.previousPrice && input.previousPrice > 0) {
      const variation = (input.previousPrice - input.price) / input.previousPrice;
      const points = Math.round(variation * 100);
      score += Math.max(-15, Math.min(20, points));

      if (variation >= 0.05) reasons.push('Queda relevante em relação ao preço anterior.');
      if (variation <= -0.05) reasons.push('Preço subiu em relação à última captura.');
    }

    if (history.length > 0) {
      const average = history.reduce((sum, value) => sum + value, 0) / history.length;
      if (average > 0) {
        const belowAverage = (average - input.price) / average;
        score += Math.max(-10, Math.min(20, Math.round(belowAverage * 120)));

        if (belowAverage >= 0.08) {
          reasons.push('Preço significativamente abaixo da média recente.');
        }
      }
    }

    score = Math.max(0, Math.min(100, score));

    const confidence = Math.max(
      55,
      Math.min(
        98,
        58 +
          Math.min(25, history.length * 4) +
          (input.maxPrice ? 8 : 0) +
          (input.previousPrice ? 7 : 0),
      ),
    );

    const recommendation: HunterRecommendation =
      score >= 90 ? 'COMPRAR AGORA' : score >= 75 ? 'BOA OPORTUNIDADE' : 'ACOMPANHAR';

    const severity =
      score >= 97
        ? AlertSeverity.RARE
        : score >= 90
          ? AlertSeverity.BUY_NOW
          : score >= 82
            ? AlertSeverity.PROMOTION
            : score >= 75
              ? AlertSeverity.GOOD_DEAL
              : AlertSeverity.INFO;

    return {
      score,
      confidence,
      recommendation,
      severity,
      reasons: reasons.length > 0 ? reasons : ['Nenhum sinal forte detectado nesta captura.'],
    };
  }
}
