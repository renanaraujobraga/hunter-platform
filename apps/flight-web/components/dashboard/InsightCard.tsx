import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function InsightCard() {
  return (
    <Card className="rounded-3xl border-blue-100 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-700">
              Today&apos;s Insight
            </p>

            <h3 className="mt-2 text-xl font-bold">
              Flights to Europe usually rise 45 days before departure.
            </h3>

            <p className="mt-2 max-w-3xl text-slate-600">
              Your Lisbon trip is still below the historical average, but demand
              is increasing. That is why your Hunter recommends buying now.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
