"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BarChart3,
  Bell,
  CreditCard,
  Home,
  Plane,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/trips", label: "Viagens", icon: Plane },
  { href: "/alerts", label: "Alertas", icon: Bell },
  { href: "/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/billing", label: "Assinatura", icon: CreditCard },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);
  const [activeHunters, setActiveHunters] = useState(0);
  useEffect(() => {
    void Promise.all([api.alerts(), api.hunters()]).then(([alerts, hunters]) => {
      setUnread(alerts.filter((a) => !a.isRead).length);
      setActiveHunters(hunters.filter((h) => h.status === "ACTIVE").length);
    }).catch(() => undefined);
  }, [pathname]);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-[256px] flex-col border-r border-white/70 bg-white/70 px-5 py-6 shadow-[8px_0_40px_rgba(47,64,120,0.05)] backdrop-blur-2xl lg:flex">
      <Link href="/" className="group flex items-center gap-3 px-1">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1557ff] to-[#7b4dff] text-white shadow-[0_10px_25px_rgba(62,80,255,0.28)]">
          <Plane className="premium-logo-plane h-6 w-6 -rotate-12" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#4be08c] shadow-[0_0_16px_rgba(75,224,140,0.9)]" />
        </div>
        <div>
          <h1 className="text-[21px] font-bold tracking-[-0.04em] text-[#0a1434]">
            Hunter AI
          </h1>
          <p className="text-xs font-medium text-[#7080a5]">
            Inteligência de viagens
          </p>
        </div>
      </Link>

      <Link
        href="/new-hunter"
        className="premium-shine relative mt-6 flex h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#101a3a] text-sm font-bold text-white shadow-[0_12px_30px_rgba(16,26,58,0.16)] transition hover:-translate-y-0.5"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Hunter
        </span>
      </Link>

      <nav className="mt-5 space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold transition duration-300",
                active
                  ? "bg-gradient-to-r from-[#edf2ff] to-[#f3efff] text-[#1557ff] shadow-[0_8px_24px_rgba(65,87,170,0.08)]"
                  : "text-[#506082] hover:translate-x-1 hover:bg-white/85 hover:text-[#1557ff]",
              ].join(" ")}
            >
              <span className="flex items-center gap-3.5">
                <Icon className="h-[18px] w-[18px] transition group-hover:scale-110" />
                {item.label}
              </span>

              {item.href === "/alerts" && unread > 0 ? (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#1557ff] px-1.5 text-[11px] font-bold text-white shadow-[0_0_18px_rgba(21,87,255,0.35)]">
                  {unread}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-3xl border border-white bg-white/85 p-4 shadow-[0_16px_45px_rgba(50,68,120,0.08)]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e9fbf2]">
              <span className="h-3 w-3 rounded-full bg-[#2bc979]" />
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#2bc979] opacity-30" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#15203f]">
                Hunter online
              </p>
              <p className="text-[11px] text-[#75819f]">
                Sincronizado há 2 min
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white to-[#f2f5ff] p-4 shadow-[0_16px_45px_rgba(50,68,120,0.08)]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6c4dff] to-[#9d7cff] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#15203f]">
                Plano Starter
              </p>
              <p className="text-[11px] text-[#75819f]">
                {activeHunters} Hunters ativos
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
