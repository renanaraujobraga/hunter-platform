import { TripCard } from "@/components/cards/TripCard";

const trips = [
  {
    route: "São Paulo → Lisbon",
    dates: "May 04 - May 18",
    price: "R$ 4,820",
    trend: "12% below historical average",
    recommendation: "BUY NOW",
    confidence: "94%",
    reason: "Demand is increasing and prices are still below average.",
    tone: "buy" as const,
  },
  {
    route: "Florianópolis → Recife",
    dates: "Sep 12 - Sep 20",
    price: "R$ 1,148",
    trend: "Down 8% in the last 10 days",
    recommendation: "WAIT",
    confidence: "92%",
    reason: "Prices are still falling and your dates are flexible.",
    tone: "wait" as const,
  },
  {
    route: "Florianópolis → Santiago",
    dates: "Oct 02 - Oct 09",
    price: "R$ 1,390",
    trend: "Stable this week",
    recommendation: "WATCH",
    confidence: "78%",
    reason: "Price is fair, but better opportunities may appear.",
    tone: "watch" as const,
  },
];

export function TripsGrid() {
  return (
    <section>
      <div>
        <h3 className="text-2xl font-bold">Priority trips</h3>
        <p className="mt-1 text-sm text-slate-500">
          Your Hunter is continuously watching these routes.
        </p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.route} {...trip} />
        ))}
      </div>
    </section>
  );
}
