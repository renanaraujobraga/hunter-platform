import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class HunterSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HunterSchedulerService.name);
  private timer?: NodeJS.Timeout;
  private bootstrapTimer?: NodeJS.Timeout;

  constructor(
    private readonly monitoring: MonitoringService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    const enabled =
      (this.config.get<string>('HUNTER_SCHEDULER_ENABLED') ?? 'true').toLowerCase() !==
      'false';

    if (!enabled) {
      this.logger.log('Hunter scheduler desabilitado.');
      return;
    }

    const minutes = Number(this.config.get<string>('HUNTER_SCAN_INTERVAL_MINUTES') ?? 15);
    const intervalMs = minutes * 60 * 1000;

    this.bootstrapTimer = setTimeout(() => {
      void this.execute();
    }, 3000);

    this.timer = setInterval(() => {
      void this.execute();
    }, intervalMs);

    this.logger.log(`Hunter scheduler ativo a cada ${minutes} minuto(s).`);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.bootstrapTimer) clearTimeout(this.bootstrapTimer);
  }

  private async execute(): Promise<void> {
    try {
      const result = await this.monitoring.runAllActive();
      this.logger.log(`Scan finalizado: ${result.processed} Hunter(s) processado(s).`);
    } catch (error) {
      this.logger.error(
        'Falha no scan automático.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
