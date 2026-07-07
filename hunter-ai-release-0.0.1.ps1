# Hunter AI - Release 0.0.1
# Hunter Home Foundation
# Run this script from any PowerShell window.
# It will create/overwrite the initial componentized Hunter Home files.

$ProjectRoot = "C:\hunter-platform\apps\flight-web"

if (!(Test-Path $ProjectRoot)) {
  Write-Error "Project path not found: $ProjectRoot"
  exit 1
}

$dirs = @(
  "components",
  "components\ui",
  "components\layout",
  "components\dashboard",
  "components\cards",
  "components\shared",
  "constants",
  "types",
  "lib",
  "hooks",
  "services",
  "styles",
  "assets"
)

foreach ($dir in $dirs) {
  $path = Join-Path $ProjectRoot $dir
  if (!(Test-Path $path)) {
    New-Item -ItemType Directory -Path $path | Out-Null
  }
}

function Write-HunterFile {
  param (
    [string]$RelativePath,
    [string]$Content
  )

  $filePath = Join-Path $ProjectRoot $RelativePath
  $parent = Split-Path $filePath -Parent

  if (!(Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent | Out-Null
  }

  Set-Content -Path $filePath -Value $Content -Encoding UTF8
}

Write-HunterFile "constants\theme.ts" @'
export const colors = {
  primary: "#2563EB",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  subtitle: "#64748B",
};

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "20px",
  xl: "28px",
};

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

export const shadow = {
  card: "0 6px 24px rgba(15,23,42,.06)",
};
'@

Write-HunterFile "types\trip.ts" @'
export type RecommendationTone = "buy" | "wait" | "watch";

export interface Trip {
  route: string;
  dates: string;
  price: string;
  trend: string;
  recommendation: string;
  confidence: string;
  reason: string;
  tone: RecommendationTone;
}
'@

Write-HunterFile "components\ui\Button.tsx" @'
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles = {
    primary: "bg-blue-700 text-white hover:bg-blue-800",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      {...props}
      className={`rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
'@

Write-HunterFile "components\ui\Card.tsx" @'
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
'@

Write-HunterFile "components\ui\Badge.tsx" @'
import type { RecommendationTone } from "@/types/trip";

interface BadgeProps {
  label: string;
  variant: RecommendationTone | "neutral";
}

const variants = {
  buy: "bg-emerald-100 text-emerald-700",
  wait: "bg-amber-100 text-amber-700",
  watch: "bg-sky-100 text-sky-700",
  neutral: "bg-slate-100 text-slate-600",
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}>
      {label}
    </span>
  );
}
'@

Write-HunterFile "components\layout\Sidebar.tsx" @'
import Badge from "@/components/ui/Badge";

const navItems = ["Home", "Trips", "Notifications", "Billing", "Settings"];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Hunter AI</h1>
        <p className="mt-1 text-sm text-slate-500">Flight Hunter</p>
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-950">Hunter Online</p>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
        <p className="mt-1 text-xs text-blue-700">Last sync 2 min ago</p>
      </div>

      <nav className="mt-8 space-y-2 text-sm">
        {navItems.map((item) => (
          <div
            key={item}
            className={`rounded-xl px-4 py-3 ${
              item === "Home"
                ? "bg-blue-50 font-semibold text-blue-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </div>
        ))}
      </nav>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Starter Plan</p>
          <Badge label="3 active" variant="neutral" />
        </div>
        <button className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Upgrade
        </button>
      </div>
    </aside>
  );
}
'@

Write-HunterFile "components\dashboard\Hero.tsx" @'
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <header className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-8 shadow-sm lg:p-10">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">Good morning, Renan</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
            Everything is under control.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Your Hunter checked 76 fares overnight. No action required right now.
          </p>
        </div>

        <Button>Monitor New Trip</Button>
      </div>
    </header>
  );
}
'@

Write-HunterFile "components\dashboard\SummaryCards.tsx" @'
import Card from "@/components/ui/Card";

const summary = [
  {
    label: "Fares checked",
    value: "76",
    description: "Since your last visit",
  },
  {
    label: "Potential savings",
    value: "R$ 842",
    description: "Based on current opportunities",
  },
  {
    label: "Recommendation updated",
    value: "1",
    description: "Lisbon needs attention",
  },
];

export default function SummaryCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {summary.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{item.value}</p>
          <p className="mt-1 text-sm text-slate-500">{item.description}</p>
        </Card>
      ))}
    </section>
  );
}
'@

Write-HunterFile "components\dashboard\InsightCard.tsx" @'
import Card from "@/components/ui/Card";

export default function InsightCard() {
  return (
    <Card className="border-blue-100">
      <p className="text-sm font-semibold text-blue-700">Today&apos;s Insight</p>
      <h3 className="mt-2 text-xl font-bold tracking-tight">
        Flights to Europe usually rise 45 days before departure.
      </h3>
      <p className="mt-2 max-w-3xl leading-7 text-slate-600">
        Your Lisbon trip is still below the historical average, but demand is increasing.
        That is why your Hunter recommends buying now.
      </p>
    </Card>
  );
}
'@

Write-HunterFile "components\cards\TripCard.tsx" @'
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { Trip } from "@/types/trip";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold tracking-tight">{trip.route}</h4>
          <p className="mt-1 text-sm text-slate-500">{trip.dates}</p>
        </div>
        <Badge label={trip.recommendation} variant={trip.tone} />
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-500">Current price</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{trip.price}</p>
        <p className="mt-2 text-sm text-slate-600">{trip.trend}</p>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Confidence</p>
          <p className="text-sm font-bold">{trip.confidence}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{trip.reason}</p>
      </div>

      <Button variant="secondary" className="mt-6 w-full">
        View Timeline
      </Button>
    </Card>
  );
}
'@

Write-HunterFile "components\dashboard\TripsGrid.tsx" @'
import TripCard from "@/components/cards/TripCard";
import type { Trip } from "@/types/trip";

const trips: Trip[] = [
  {
    route: "São Paulo → Lisbon",
    dates: "May 04 - May 18",
    price: "R$ 4,820",
    trend: "12% below historical average",
    recommendation: "BUY NOW",
    confidence: "94%",
    reason: "Demand is increasing and prices are still below average.",
    tone: "buy",
  },
  {
    route: "Florianópolis → Recife",
    dates: "Sep 12 - Sep 20",
    price: "R$ 1,148",
    trend: "Down 8% in the last 10 days",
    recommendation: "WAIT",
    confidence: "92%",
    reason: "Prices are still falling and your dates are flexible.",
    tone: "wait",
  },
  {
    route: "Florianópolis → Santiago",
    dates: "Oct 02 - Oct 09",
    price: "R$ 1,390",
    trend: "Stable this week",
    recommendation: "WATCH",
    confidence: "78%",
    reason: "Price is fair, but better opportunities may appear.",
    tone: "watch",
  },
];

export default function TripsGrid() {
  return (
    <section>
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Priority trips</h3>
        <p className="mt-1 text-sm text-slate-500">
          Your Hunter is continuously watching these routes.
        </p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.route} trip={trip} />
        ))}
      </div>
    </section>
  );
}
'@

Write-HunterFile "app\page.tsx" @'
import Hero from "@/components/dashboard/Hero";
import InsightCard from "@/components/dashboard/InsightCard";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TripsGrid from "@/components/dashboard/TripsGrid";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 lg:p-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <Hero />
            <SummaryCards />
            <InsightCard />
            <TripsGrid />
          </div>
        </section>
      </div>
    </main>
  );
}
'@

Write-Host ""
Write-Host "Hunter AI Release 0.0.1 files were generated successfully." -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. cd C:\hunter-platform\apps\flight-web"
Write-Host "2. pnpm dev"
