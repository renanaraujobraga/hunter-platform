import Link from "next/link";
import { ArrowRight, Plane, RefreshCw, ShieldCheck, TrendingDown } from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { HunterStatus } from "@/components/dashboard/HunterStatus";
import { AnimatedNumber, Badge, PremiumLink, StatCard, Surface } from "@/components/design-system/ui";
import { getDashboard } from "@/lib/dashboard-api";

const iconMap = {
  plane: Plane,
  trending: TrendingDown,
  shield: ShieldCheck,
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat("pt-BR");

export default async function HomePage() {
  try {
    const dashboard = await getDashboard();
    const { briefing, metrics, annualGoal, intelligenceFeed, monitoredTrips } = dashboard;
    const progressWidth = Math.min(100, Math.max(0, annualGoal.progressPercentage));

    return (
      <AppLayout>
        <div className="mx-auto max-w-[1500px]">
          <HunterStatus
            greeting={briefing.greeting}
            userName={briefing.userName}
            importantUpdates={briefing.importantUpdates}
            liveMessages={briefing.liveMessages}
          />

          <div className="stagger mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Economia estimada"
              value={money.format(metrics.estimatedSavings)}
              helper={`+${metrics.estimatedSavingsVariation}% nos últimos 30 dias`}
              accent="green"
            />
            <StatCard
              label="Hunters ativos"
              value={integer.format(metrics.activeHunters)}
              helper={metrics.activeHunters === 1 ? "Monitoramento em execução" : "Todos operando normalmente"}
              accent="purple"
            />
            <StatCard
              label="Tarifas analisadas"
              value={integer.format(metrics.pricesAnalyzedLast24h)}
              helper="Últimas 24 horas"
              accent="blue"
            />
            <StatCard
              label="Alertas críticos"
              value={integer.format(metrics.criticalAlerts)}
              helper={metrics.criticalAlerts > 0 ? "Requer sua atenção" : "Nenhuma ação necessária"}
              accent="orange"
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.42fr_1fr]">
            <Surface className="p-6 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7a65e8]">Inteligência</p>
                  <h2 className="mt-2 text-xl font-bold text-[#101a3a]">O que mudou hoje</h2>
                </div>
                <Link href="/alerts"><PremiumLink>Ver alertas</PremiumLink></Link>
              </div>

              <div className="stagger mt-6 space-y-3">
                {intelligenceFeed.length === 0 ? (
                  <div className="rounded-3xl border border-[#edf0f7] bg-[#fbfcff] p-6 text-sm text-[#75819c]">
                    Nenhuma mudança relevante encontrada hoje.
                  </div>
                ) : intelligenceFeed.map((item) => {
                  const Icon = iconMap[item.icon];
                  const tone =
                    item.tone === "purple"
                      ? "from-[#7558ff] to-[#ad86ff]"
                      : item.tone === "green"
                      ? "from-[#23bf72] to-[#68dfa2]"
                      : "from-[#2c6cff] to-[#6d9cff]";
                  return (
                    <div key={item.id} className="group flex gap-4 rounded-3xl border border-[#edf0f7] bg-[#fbfcff] p-4 transition hover:translate-x-1 hover:bg-white">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#182241]">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-[#75819c]">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Surface>

            <Surface className="p-6 md:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7a65e8]">Meta anual</p>
              <h2 className="mt-2 text-xl font-bold">Economizar {money.format(annualGoal.target)}</h2>
              <div className="mt-7 flex items-end justify-between">
                <p className="text-[42px] font-bold tracking-[-0.05em] text-[#101a3a]">
                  R$ <AnimatedNumber value={annualGoal.saved} />
                </p>
                <Badge tone="success">{annualGoal.progressPercentage.toLocaleString("pt-BR")}%</Badge>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#edf0f7]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#27c979] to-[#6b78ff] shadow-[0_0_20px_rgba(39,201,121,0.35)]"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-[#75819c]">
                Você está {money.format(Math.abs(annualGoal.paceDifference))} {annualGoal.paceDifference >= 0 ? "acima" : "abaixo"} do ritmo esperado para este período.
              </p>
            </Surface>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7a65e8]">Flight Hunters</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em]">Viagens monitoradas</h2>
            </div>
            <Link href="/trips"><PremiumLink>Ver todas</PremiumLink></Link>
          </div>

          <div className="stagger mt-5 grid gap-4 xl:grid-cols-3">
            {monitoredTrips.length === 0 ? (
              <Surface className="xl:col-span-3 p-8 text-center">
                <p className="font-bold text-[#111b3b]">Nenhum Hunter ativo ainda</p>
                <p className="mt-2 text-sm text-[#7c88a3]">Crie seu primeiro monitoramento para acompanhar oportunidades.</p>
                <Link className="mt-5 inline-flex" href="/new-hunter"><PremiumLink>Criar Hunter</PremiumLink></Link>
              </Surface>
            ) : monitoredTrips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Surface className="h-full p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#111b3b]">{trip.city}</p>
                      <p className="mt-1 text-xs text-[#7c88a3]">{trip.route}</p>
                    </div>
                    <Badge tone={trip.recommendation === "COMPRAR AGORA" ? "danger" : trip.recommendation === "AGUARDAR" ? "warning" : "info"}>
                      {trip.recommendation}
                    </Badge>
                  </div>
                  <div className="mt-7 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-[#8b96ad]">Tarifa atual</p>
                      <p className="mt-1 text-2xl font-bold">{money.format(trip.currentPrice)}</p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eff3ff] text-[#1557ff] transition group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Surface>
              </Link>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha desconhecida.";
    return (
      <AppLayout>
        <div className="mx-auto max-w-[1500px]">
          <Surface className="p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1ed] text-[#e86f45]">
              <RefreshCw className="h-6 w-6" />
            </span>
            <h1 className="mt-5 text-2xl font-bold text-[#101a3a]">Não foi possível carregar o Dashboard</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#75819c]">
              Confirme se o backend está rodando em http://localhost:3333 e atualize esta página.
            </p>
            <p className="mt-2 text-xs text-[#a0a9bd]">{message}</p>
            <Link href="/" className="mt-6 inline-flex rounded-2xl bg-[#101a3a] px-5 py-3 text-sm font-bold text-white">
              Tentar novamente
            </Link>
          </Surface>
        </div>
      </AppLayout>
    );
  }
}
