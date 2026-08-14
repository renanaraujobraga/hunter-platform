export type DashboardTone = "purple" | "green" | "blue" | "orange";
export type DashboardIcon = "plane" | "trending" | "shield";
export type DashboardRecommendation = "COMPRAR AGORA" | "AGUARDAR" | "ACOMPANHAR";

export interface DashboardResponse {
  briefing: {
    greeting: string;
    userName: string;
    importantUpdates: number;
    headline: string;
    liveMessages: string[];
  };
  metrics: {
    estimatedSavings: number;
    estimatedSavingsVariation: number;
    activeHunters: number;
    pricesAnalyzedLast24h: number;
    criticalAlerts: number;
  };
  annualGoal: {
    target: number;
    saved: number;
    progressPercentage: number;
    paceDifference: number;
  };
  intelligenceFeed: Array<{
    id: string;
    icon: DashboardIcon;
    title: string;
    text: string;
    tone: DashboardTone;
  }>;
  monitoredTrips: Array<{
    id: string;
    city: string;
    route: string;
    currentPrice: number;
    previousPrice: number | null;
    score: number;
    confidence: number;
    recommendation: DashboardRecommendation;
  }>;
  generatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await fetch(`${API_URL}/dashboard`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Dashboard API respondeu com status ${response.status}.`);
  }

  return response.json() as Promise<DashboardResponse>;
}
