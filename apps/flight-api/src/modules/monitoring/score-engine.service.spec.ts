import { ScoreEngineService } from './score-engine.service';

describe('ScoreEngineService', () => {
  const service = new ScoreEngineService();

  it('recomenda comprar quando preço está muito abaixo do teto e histórico', () => {
    const result = service.evaluate({
      price: 800,
      maxPrice: 1200,
      previousPrice: 1000,
      historyPrices: [1150, 1100, 1080, 1020],
    });

    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.recommendation).toBe('COMPRAR AGORA');
    expect(result.confidence).toBeGreaterThan(70);
  });

  it('mantém acompanhamento quando não existe sinal forte', () => {
    const result = service.evaluate({
      price: 1400,
      maxPrice: 1000,
      previousPrice: 1300,
      historyPrices: [1100, 1150, 1200],
    });

    expect(result.score).toBeLessThan(75);
    expect(result.recommendation).toBe('ACOMPANHAR');
  });

  it('sempre limita score entre 0 e 100', () => {
    const great = service.evaluate({
      price: 100,
      maxPrice: 2000,
      previousPrice: 1900,
      historyPrices: [2000, 1800, 1700],
    });

    const bad = service.evaluate({
      price: 5000,
      maxPrice: 500,
      previousPrice: 500,
      historyPrices: [400, 450, 500],
    });

    expect(great.score).toBeLessThanOrEqual(100);
    expect(bad.score).toBeGreaterThanOrEqual(0);
  });
});
