"use client";

import { ReactNode, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="animate-premium-in flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#785ee8]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-[34px] font-bold tracking-[-0.045em] text-[#0d1738] md:text-[40px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71809d]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function Surface({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <section
      className={[
        "premium-surface relative overflow-hidden rounded-[28px] border border-white/90 bg-white/78 shadow-[0_20px_60px_rgba(53,68,120,0.08)] backdrop-blur-xl",
        hover ? "premium-hover" : "",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
      {children}
    </section>
  );
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 700,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    const run = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <>
      {prefix}
      {current.toLocaleString("pt-BR")}
      {suffix}
    </>
  );
}

export function StatCard({
  label,
  value,
  helper,
  accent = "purple",
}: {
  label: string;
  value: string;
  helper: string;
  accent?: "purple" | "green" | "blue" | "orange";
}) {
  const accents = {
    purple: "from-[#7357ff]/14 to-[#bc9fff]/5",
    green: "from-[#27c979]/14 to-[#8ff0bd]/5",
    blue: "from-[#266dff]/14 to-[#92b4ff]/5",
    orange: "from-[#ff9b35]/14 to-[#ffd49d]/5",
  };

  return (
    <Surface className={`bg-gradient-to-br ${accents[accent]} p-5`}>
      <p className="text-xs font-semibold text-[#7a87a3]">{label}</p>
      <p className="mt-3 text-[30px] font-bold tracking-[-0.04em] text-[#101a3a]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[#8a95ad]">{helper}</p>
    </Surface>
  );
}

export function PrimaryButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`premium-button premium-shine relative overflow-hidden rounded-2xl bg-[#101a3a] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_25px_rgba(16,26,58,0.18)] transition ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function SecondaryButton({ children }: { children: ReactNode }) {
  return (
    <button className="premium-button rounded-2xl border border-white bg-white/75 px-5 py-3 text-sm font-bold text-[#36425f] shadow-sm transition">
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "danger" | "warning" | "info";
}) {
  const tones = {
    neutral: "bg-[#f1f3f8] text-[#61708f]",
    success: "bg-[#eafaf2] text-[#19a960]",
    danger: "bg-[#fff0f2] text-[#ff4b62]",
    warning: "bg-[#fff7e7] text-[#d88a00]",
    info: "bg-[#eef3ff] text-[#326ee9]",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function PremiumLink({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-bold text-[#1557ff]">
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </span>
  );
}
