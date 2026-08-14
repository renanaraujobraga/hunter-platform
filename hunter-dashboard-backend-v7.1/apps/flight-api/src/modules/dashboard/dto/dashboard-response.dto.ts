export interface DashboardBriefingDto {
  greeting: string;
  importantUpdates: number;
  headline: string;
  generatedAt: string;
}

export interface DashboardMetricsDto {
  estimatedSavings: number;
  activeHunters: number;
  pricesAnalyzed: number;
  criticalAlerts: number;
}

export interface DashboardAnnualGoalDto {
  target: number;
  saved: number;
  progressPercentage: number;
  paceDifference: number;
}

export type DashboardIntelligenceTone = 'OPPORTUNITY' | 'TREND' | 'INFO';

export interface DashboardIntelligenceItemDto {
  id: string;
  tone: DashboardIntelligenceTone;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  hunterId: string | null;
}

export interface DashboardMonitoredTripDto {
  id: string;
  name: string;
  origin: string;
  destination: string;
  status: string;
  currentPrice: number | null;
  previousPrice: number | null;
  savings: number;
  variationPercentage: number | null;
  updatedAt: string;
}

export interface DashboardResponseDto {
  briefing: DashboardBriefingDto;
  metrics: DashboardMetricsDto;
  annualGoal: DashboardAnnualGoalDto;
  intelligenceFeed: DashboardIntelligenceItemDto[];
  monitoredTrips: DashboardMonitoredTripDto[];
}
