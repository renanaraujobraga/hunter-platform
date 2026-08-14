export type DashboardFeedIcon = 'plane' | 'trending' | 'shield';
export type DashboardFeedTone = 'purple' | 'green' | 'blue';
export type DashboardRecommendation = 'COMPRAR AGORA' | 'AGUARDAR' | 'ACOMPANHAR';

export interface DashboardBriefing {
  greeting: string;
  userName: string;
  importantUpdates: number;
  messages: string[];
}

export interface DashboardMetrics {
  estimatedSavings: number;
  savingsVariation: number;
  activeHunters: number;
  pricesAnalyzedLast24h: number;
  criticalAlerts: number;
}

export interface DashboardAnnualGoal {
  target: number;
  saved: number;
  progressPercentage: number;
  paceDifference: number;
}

export interface DashboardIntelligenceItem {
  id: string;
  icon: DashboardFeedIcon;
  title: string;
  text: string;
  tone: DashboardFeedTone;
}

export interface DashboardMonitoredTrip {
  id: string;
  city: string;
  route: string;
  currentPrice: number;
  recommendation: DashboardRecommendation;
}

export interface DashboardResponse {
  briefing: DashboardBriefing;
  metrics: DashboardMetrics;
  annualGoal: DashboardAnnualGoal;
  intelligenceFeed: DashboardIntelligenceItem[];
  monitoredTrips: DashboardMonitoredTrip[];
  generatedAt: string;
}
