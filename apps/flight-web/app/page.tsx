import { Hero } from "@/components/dashboard/Hero";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TripsGrid } from "@/components/dashboard/TripsGrid";
import { AppLayout } from "@/components/layout/AppLayout";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <Hero />
        <SummaryCards />
        <InsightCard />
        <TripsGrid />
      </div>
    </AppLayout>
  );
}
