import { AlertSeverity, PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureHunter(
  userId: string,
  data: {
    name: string;
    origin: string;
    destination: string;
    departureFrom: Date;
    departureTo: Date;
    maxPrice: number;
    currentPrice: number;
    previousPrice: number;
    score: number;
    confidence: number;
  },
): Promise<void> {
  const existing = await prisma.hunter.findFirst({
    where: {
      userId,
      origin: data.origin,
      destination: data.destination,
    },
  });

  if (existing) return;

  const hunter = await prisma.hunter.create({
    data: {
      ...data,
      userId,
    },
  });

  await prisma.priceRecord.createMany({
    data: [
      {
        hunterId: hunter.id,
        price: data.previousPrice,
        source: 'seed',
        capturedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
      {
        hunterId: hunter.id,
        price: (data.previousPrice + data.currentPrice) / 2,
        source: 'seed',
        capturedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        hunterId: hunter.id,
        price: data.currentPrice,
        source: 'seed',
      },
    ],
  });

  await prisma.alert.create({
    data: {
      hunterId: hunter.id,
      title: data.score >= 90 ? '🚨 Comprar agora' : '🟢 Boa oportunidade',
      message: `${data.origin} → ${data.destination}: R$ ${data.currentPrice.toFixed(
        2,
      )}, score ${data.score}.`,
      severity: data.score >= 90 ? AlertSeverity.BUY_NOW : AlertSeverity.GOOD_DEAL,
    },
  });
}

async function main(): Promise<void> {
  const passwordHash = await hash('Hunter@123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'renan@hunter.ai' },
    update: {},
    create: {
      name: 'Renan Braga',
      email: 'renan@hunter.ai',
      passwordHash,
    },
  });

  await ensureHunter(user.id, {
    name: 'Florianópolis → Fortaleza',
    origin: 'FLN',
    destination: 'FOR',
    departureFrom: new Date('2026-08-01T00:00:00.000Z'),
    departureTo: new Date('2026-10-31T23:59:59.000Z'),
    maxPrice: 1200,
    currentPrice: 980,
    previousPrice: 1140,
    score: 96,
    confidence: 88,
  });

  await ensureHunter(user.id, {
    name: 'Florianópolis → Rio de Janeiro',
    origin: 'FLN',
    destination: 'GIG',
    departureFrom: new Date('2026-08-01T00:00:00.000Z'),
    departureTo: new Date('2026-12-31T23:59:59.000Z'),
    maxPrice: 700,
    currentPrice: 590,
    previousPrice: 680,
    score: 92,
    confidence: 84,
  });

  await ensureHunter(user.id, {
    name: 'Florianópolis → Santiago',
    origin: 'FLN',
    destination: 'SCL',
    departureFrom: new Date('2026-09-01T00:00:00.000Z'),
    departureTo: new Date('2026-11-30T23:59:59.000Z'),
    maxPrice: 1500,
    currentPrice: 1390,
    previousPrice: 1460,
    score: 81,
    confidence: 79,
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
