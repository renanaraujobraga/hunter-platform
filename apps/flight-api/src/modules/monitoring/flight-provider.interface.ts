import { Hunter } from '@prisma/client';

export const FLIGHT_PROVIDER = 'FLIGHT_PROVIDER';

export interface FlightQuote {
  price: number;
  currency: string;
  source: string;
  capturedAt: Date;
}

export interface FlightProvider {
  getQuote(hunter: Hunter): Promise<FlightQuote>;
}
