import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UserContextService } from '../auth/user-context.service';
import { AlertsService } from './alerts.service';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
    private readonly userContext: UserContextService,
  ) {}

  @Get()
  async list(@CurrentUser() user?: JwtPayload) {
    return this.alertsService.list(await this.userContext.resolveUserId(user));
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user?: JwtPayload) {
    return this.alertsService.markAllAsRead(await this.userContext.resolveUserId(user));
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user?: JwtPayload) {
    return this.alertsService.markAsRead(id, await this.userContext.resolveUserId(user));
  }
}
