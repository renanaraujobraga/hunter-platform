export type Hunter = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  departureFrom?: string;
  departureTo?: string;
  currentPrice: number | null;
  previousPrice?: number | null;
  maxPrice?: number | null;
  score: number;
  status?: string;
  updatedAt?: string;
};

export type CreateHunterInput = {
  name: string;
  origin: string;
  destination: string;
  departureFrom: string;
  departureTo: string;
  maxPrice?: number;
};

export type IntelligenceAlert = {
  id: string;
  title?: string;
  message?: string;
  severity?: string;
  isRead?: boolean;
  createdAt?: string;
};

export type Dashboard = {
  metrics: {
    estimatedSavings: number;
    activeHunters: number;
    pricesAnalyzed: number;
    criticalAlerts: number;
  };
  hunters: Hunter[];
  intelligenceFeed?: IntelligenceAlert[];
};
