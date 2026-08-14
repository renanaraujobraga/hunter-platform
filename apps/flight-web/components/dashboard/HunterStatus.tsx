"use client";

import { useEffect, useState } from "react";
import { Activity, Plane, Sparkles } from "lucide-react";

interface HunterStatusProps {
  greeting: string;
  userName: string;
  importantUpdates: number;
  messages: string[];
}

export function HunterStatus({
  greeting,
  userName,
  importantUpdates,
  messages,
}: HunterStatusProps) {
  const safeMessages = messages.length > 0 ? messages : ["Monitoramento atualizado."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % safeMessages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [safeMessages.length]);

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#101a3a] via-[#17234c] to-[#432a87] p-7 text-white shadow-[0_28px_70px_rgba(35,41,91,0.24)] md:p-9">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#8266ff] opacity-35 blur-3xl" />
      <div className="absolute -bottom-20 left-[28%] h-52 w-52 rounded-full bg-[#2b7cff] opacity-25 blur-3xl" />

      <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#b9c5ff]">
            <Sparkles className="h-4 w-4" />
            Briefing inteligente
          </div>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-0.045em] md:text-[46px]">
            {greeting}, {userName}.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d9def7]">
            Encontrei {importantUpdates} {importantUpdates === 1 ? "informação importante" : "informações importantes"} enquanto você estava fora.
          </p>

          <div className="mt-6 flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 backdrop-blur-xl">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
              <Activity className="h-4 w-4 text-[#85f1bb]" />
              <span className="absolute inset-0 animate-ping rounded-xl border border-[#85f1bb]/25" />
            </span>
            <p key={index} className="animate-premium-in text-sm font-semibold text-white/90">
              {safeMessages[index]}
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl xl:mx-0">
          <div className="absolute inset-4 rounded-full border border-dashed border-white/20 animate-[spin_18s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#4f7dff] to-[#9c69ff] opacity-30 blur-xl" />
          <Plane className="relative h-16 w-16 -rotate-12 text-white drop-shadow-[0_15px_25px_rgba(255,255,255,0.28)]" />
        </div>
      </div>
    </div>
  );
}
