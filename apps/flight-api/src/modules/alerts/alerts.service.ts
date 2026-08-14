import { Alert } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { hunter: { userId } },
      orderBy: { createdAt: 'desc' },
      include: { hunter: true },
      take: 100,
    });
  }

  async markAsRead(id: string, userId: string): Promise<Alert> {
    const alert = await this.prisma.alert.findFirst({
      where: { id, hunter: { userId } },
    });

    if (!alert) throw new NotFoundException('Alerta não encontrado.');

    return this.prisma.alert.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.prisma.alert.updateMany({
      where: {
        isRead: false,
        hunter: { userId },
      },
      data: { isRead: true },
    });

    return { updated: result.count };
  }
}
