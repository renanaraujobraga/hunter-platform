export type DashboardFeedIcon = "plane" | "trending" | "shield";
export type DashboardFeedTone = "purple" | "green" | "blue";
export type DashboardRecommendation = "COMPRAR AGORA" | "AGUARDAR" | "ACOMPANHAR";

export interface DashboardResponse {
  briefing: { greeting: string; userName: string; importantUpdates: number; messages: string[]; };
  metrics: { estimatedSavings: number; savingsVariation: number; activeHunters: number; pricesAnalyzedLast24h: number; criticalAlerts: number; };
  annualGoal: { target: number; saved: number; progressPercentage: number; paceDifference: number; };
  intelligenceFeed: Array<{ id: string; icon: DashboardFeedIcon; title: string; text: string; tone: DashboardFeedTone; }>;
  monitoredTrips: Array<{ id: string; city: string; route: string; currentPrice: number; recommendation: DashboardRecommendation; }>;
  generatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

export async function getDashboard(): Promise<DashboardResponse> {
  const token = typeof window === "undefined" ? null : localStorage.getItem("hunter_token");
  const response = await fetch(`${API_URL}/dashboard`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Dashboard API returned ${response.status}`);
  }

  return response.json() as Promise<DashboardResponse>;
}
