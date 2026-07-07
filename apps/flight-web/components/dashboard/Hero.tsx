import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Good morning, Renan
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Everything is under control.
            </h2>
          </div>

          <p className="mt-4 max-w-2xl text-slate-600">
            Your Hunter checked 76 fares overnight. No action required right now.
          </p>
        </div>

        <Button className="rounded-xl px-5 py-6">
          Monitor New Trip
        </Button>
      </div>
    </section>
  );
}
