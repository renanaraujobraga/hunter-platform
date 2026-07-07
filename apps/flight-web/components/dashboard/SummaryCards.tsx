import { Card, CardContent } from "@/components/ui/card";
import { Plane, TrendingDown, RefreshCw } from "lucide-react";

const summary = [
  {
    label: "Fares checked",
    value: "76",
    detail: "Since your last visit",
    icon: Plane,
  },
  {
    label: "Potential savings",
    value: "R$ 842",
    detail: "Based on current opportunities",
    icon: TrendingDown,
  },
  {
    label: "Recommendation updated",
    value: "1",
    detail: "Lisbon needs attention",
    icon: RefreshCw,
  },
];

export function SummaryCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {summary.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label} className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
