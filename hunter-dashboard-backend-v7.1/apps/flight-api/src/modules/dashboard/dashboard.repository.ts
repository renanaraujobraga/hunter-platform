import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveHunters(limit = 6) {
    return this.prisma.hunter.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });
  }

  countActiveHunters() {
    return this.prisma.hunter.count({ where: { status: 'ACTIVE' } });
  }

  countUnreadAlerts() {
    return this.prisma.alert.count({ where: { isRead: false } });
  }

  countAnalyzedPrices() {
    return this.prisma.priceRecord.count();
  }

  findLatestAlerts(limit = 3) {
    return this.prisma.alert.findMany({
      include: { hunter: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
