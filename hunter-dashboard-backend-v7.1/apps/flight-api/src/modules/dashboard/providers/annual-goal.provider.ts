import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DashboardAnnualGoalDto } from '../dto/dashboard-response.dto';

@Injectable()
export class AnnualGoalProvider {
  constructor(private readonly config: ConfigService) {}

  execute(saved: number, now = new Date()): DashboardAnnualGoalDto {
    const configuredTarget = Number(this.config.get<string>('DASHBOARD_ANNUAL_GOAL') ?? 5000);
    const target = Number.isFinite(configuredTarget) && configuredTarget > 0 ? configuredTarget : 5000;
    const progressPercentage = Math.min(100, Number(((saved / target) * 100).toFixed(1)));

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const elapsed = now.getTime() - startOfYear.getTime();
    const total = endOfYear.getTime() - startOfYear.getTime();
    const expectedSaved = target * Math.min(1, Math.max(0, elapsed / total));

    return {
      target,
      saved,
      progressPercentage,
      paceDifference: Math.round(saved - expectedSaved)
    };
  }
}
