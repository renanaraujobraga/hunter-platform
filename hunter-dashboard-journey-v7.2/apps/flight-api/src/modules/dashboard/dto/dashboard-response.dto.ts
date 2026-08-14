export type DashboardTone = 'purple' | 'green' | 'blue' | 'orange';
export type DashboardIcon = 'plane' | 'trending' | 'shield';
export type DashboardRecommendation = 'COMPRAR AGORA' | 'AGUARDAR' | 'ACOMPANHAR';

export interface DashboardBriefingDto {
  greeting: string;
  userName: string;
  importantUpdates: number;
  headline: string;
  liveMessages: string[];
}

export interface DashboardMetricsDto {
  estimatedSavings: number;
  estimatedSavingsVariation: number;
  activeHunters: number;
  pricesAnalyzedLast24h: number;
  criticalAlerts: number;
}

export interface DashboardAnnualGoalDto {
  target: number;
  saved: number;
  progressPercentage: number;
  paceDifference: number;
}

export interface DashboardIntelligenceItemDto {
  id: string;
  icon: DashboardIcon;
  title: string;
  text: string;
  tone: DashboardTone;
}

export interface DashboardMonitoredTripDto {
  id: string;
  city: string;
  route: string;
  currentPrice: number;
  previousPrice: number | null;
  score: number;
  confidence: number;
  recommendation: DashboardRecommendation;
}

export interface DashboardResponseDto {
  briefing: DashboardBriefingDto;
  metrics: DashboardMetricsDto;
  annualGoal: DashboardAnnualGoalDto;
  intelligenceFeed: DashboardIntelligenceItemDto[];
  monitoredTrips: DashboardMonitoredTripDto[];
  generatedAt: string;
}
