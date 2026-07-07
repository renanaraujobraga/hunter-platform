import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Tone = "buy" | "wait" | "watch";

interface TripCardProps {
  route: string;
  dates: string;
  price: string;
  trend: string;
  recommendation: string;
  confidence: string;
  reason: string;
  tone: Tone;
}

const toneStyles = {
  buy: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  wait: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  watch: "bg-sky-100 text-sky-700 hover:bg-sky-100",
};

export function TripCard({
  route,
  dates,
  price,
  trend,
  recommendation,
  confidence,
  reason,
  tone,
}: TripCardProps) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold">{route}</h4>
            <p className="mt-1 text-sm text-slate-500">{dates}</p>
          </div>

          <Badge className={toneStyles[tone]}>{recommendation}</Badge>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-500">Current price</p>
          <p className="mt-1 text-3xl font-bold">{price}</p>
          <p className="mt-2 text-sm text-slate-600">{trend}</p>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Confidence</p>
            <p className="text-sm font-bold">{confidence}</p>
          </div>

          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: confidence }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-600">{reason}</p>
        </div>

        <Button variant="outline" className="mt-6 w-full rounded-xl">
          View Timeline
        </Button>
      </CardContent>
    </Card>
  );
}
