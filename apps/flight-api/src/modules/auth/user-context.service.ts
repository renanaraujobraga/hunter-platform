import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class UserContextService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async resolveUserId(user?: JwtPayload): Promise<string> {
    if (user?.sub) return user.sub;

    const demoMode = (this.config.get<string>('DEMO_MODE') ?? 'true').toLowerCase() !== 'false';
    if (!demoMode) throw new UnauthorizedException('Autenticação obrigatória.');

    const demoUser = await this.prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    if (!demoUser) {
      throw new NotFoundException('Usuário demo não encontrado. Execute pnpm db:seed.');
    }

    return demoUser.id;
  }
}
