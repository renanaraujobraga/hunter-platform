import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
  }

  findActiveHunters(userId: string, limit?: number) {
    return this.prisma.hunter.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy: [{ score: 'desc' }, { updatedAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    });
  }

  countActiveHunters(userId: string) {
    return this.prisma.hunter.count({
      where: { userId, status: 'ACTIVE' },
    });
  }

  countUnreadAlerts(userId: string) {
    return this.prisma.alert.count({
      where: {
        isRead: false,
        hunter: { userId },
      },
    });
  }

  countPricesAnalyzedSince(userId: string, since: Date) {
    return this.prisma.priceRecord.count({
      where: {
        capturedAt: { gte: since },
        hunter: { userId },
      },
    });
  }

  findRecentAlerts(userId: string, limit = 3) {
    return this.prisma.alert.findMany({
      where: { hunter: { userId } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        hunter: {
          select: {
            destination: true,
            currentPrice: true,
            previousPrice: true,
            score: true,
          },
        },
      },
    });
  }
}
