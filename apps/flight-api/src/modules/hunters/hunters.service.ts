import { Hunter, HunterStatus, PriceRecord } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { CreateHunterDto } from './dto/create-hunter.dto';
import { UpdateHunterDto } from './dto/update-hunter.dto';

@Injectable()
export class HuntersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly monitoring: MonitoringService,
  ) {}

  list(userId: string): Promise<Hunter[]> {
    return this.prisma.hunter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<Hunter> {
    const hunter = await this.prisma.hunter.findFirst({
      where: { id, userId },
    });

    if (!hunter) throw new NotFoundException('Hunter não encontrado.');
    return hunter;
  }

  async create(dto: CreateHunterDto, userId: string): Promise<Hunter> {
    const hunter = await this.prisma.hunter.create({
      data: {
        name: dto.name.trim(),
        origin: dto.origin.toUpperCase(),
        destination: dto.destination.toUpperCase(),
        departureFrom: new Date(dto.departureFrom),
        departureTo: new Date(dto.departureTo),
        returnFrom: dto.returnFrom ? new Date(dto.returnFrom) : null,
        returnTo: dto.returnTo ? new Date(dto.returnTo) : null,
        maxPrice: dto.maxPrice,
        userId,
      },
    });

    await this.monitoring.runHunter(hunter.id, userId);
    return this.findById(hunter.id, userId);
  }

  async update(id: string, dto: UpdateHunterDto, userId: string): Promise<Hunter> {
    await this.findById(id, userId);

    return this.prisma.hunter.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.origin !== undefined ? { origin: dto.origin.toUpperCase() } : {}),
        ...(dto.destination !== undefined
          ? { destination: dto.destination.toUpperCase() }
          : {}),
        ...(dto.departureFrom !== undefined
          ? { departureFrom: new Date(dto.departureFrom) }
          : {}),
        ...(dto.departureTo !== undefined ? { departureTo: new Date(dto.departureTo) } : {}),
        ...(dto.returnFrom !== undefined
          ? { returnFrom: dto.returnFrom ? new Date(dto.returnFrom) : null }
          : {}),
        ...(dto.returnTo !== undefined
          ? { returnTo: dto.returnTo ? new Date(dto.returnTo) : null }
          : {}),
        ...(dto.maxPrice !== undefined ? { maxPrice: dto.maxPrice } : {}),
      },
    });
  }

  async setStatus(id: string, status: HunterStatus, userId: string): Promise<Hunter> {
    await this.findById(id, userId);

    return this.prisma.hunter.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string, userId: string): Promise<{ success: true }> {
    await this.findById(id, userId);
    await this.prisma.hunter.delete({ where: { id } });
    return { success: true };
  }

  async history(id: string, userId: string): Promise<PriceRecord[]> {
    await this.findById(id, userId);

    return this.prisma.priceRecord.findMany({
      where: { hunterId: id },
      orderBy: { capturedAt: 'desc' },
      take: 100,
    });
  }

  run(id: string, userId: string) {
    return this.monitoring.runHunter(id, userId);
  }
}
