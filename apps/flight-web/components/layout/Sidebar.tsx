import { Bell, CreditCard, Home, Plane, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Trips", icon: Plane },
  { label: "Notifications", icon: Bell },
  { label: "Billing", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white p-6 lg:flex lg:flex-col">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Hunter AI</h1>
        <p className="mt-1 text-sm text-slate-500">Flight Hunter</p>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-800">Hunter Online</p>
        <p className="mt-1 text-xs text-blue-600">Last sync 2 min ago</p>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                item.active
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold">Starter Plan</p>
        <p className="mt-1 text-xs text-slate-500">3 monitored trips active</p>
        <Button className="mt-4 w-full" size="sm">
          Upgrade
        </Button>
      </div>
    </aside>
  );
}
