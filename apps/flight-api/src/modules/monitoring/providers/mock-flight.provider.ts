import { Hunter } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { FlightProvider, FlightQuote } from '../flight-provider.interface';

@Injectable()
export class MockFlightProvider implements FlightProvider {
  getQuote(hunter: Hunter): Promise<FlightQuote> {
    const reference = hunter.maxPrice ?? hunter.currentPrice ?? 1200;
    const routeSeed = this.hash(`${hunter.origin}-${hunter.destination}`);
    const timeBucket = Math.floor(Date.now() / (15 * 60 * 1000));
    const oscillation = ((routeSeed + timeBucket * 17) % 241) - 120;
    const multiplier = 1 + oscillation / 1000;
    const price = Math.max(99, Math.round(reference * multiplier * 100) / 100);

    return Promise.resolve({
      price,
      currency: 'BRL',
      source: 'mock-mvp',
      capturedAt: new Date(),
    });
  }

  private hash(value: string): number {
    return [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 10000, 7);
  }
}

