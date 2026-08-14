# Hunter Platform Premium UI v1
# Applies the approved premium dashboard to hunter-platform-clean.
# Run in PowerShell. The script creates a backup before changing files.

$ErrorActionPreference = "Stop"
$ProjectRoot = "C:\hunter-platform-clean\apps\flight-web"
$BackupRoot = "C:\hunter-platform-clean\apps\flight-web-backup-premium-v1"

if (!(Test-Path $ProjectRoot)) {
  Write-Error "Project path not found: $ProjectRoot"
  exit 1
}

if (!(Test-Path $BackupRoot)) {
  Copy-Item $ProjectRoot $BackupRoot -Recurse
  Write-Host "Backup created at $BackupRoot" -ForegroundColor DarkGray
}

$utf8 = New-Object System.Text.UTF8Encoding($false)

function Write-HunterFile {
  param([string]$RelativePath, [string]$Content)
  $filePath = Join-Path $ProjectRoot $RelativePath
  $parent = Split-Path $filePath -Parent
  if (!(Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  [System.IO.File]::WriteAllText($filePath, $Content, $utf8)
}

Write-HunterFile "app\layout.tsx" @'
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hunter Platform | Flight Hunter",
  description: "Monitoramento inteligente de passagens aéreas",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
'@

Write-HunterFile "lib\dashboard.ts" @'
export type DashboardData = {
  greeting?: string;
  briefing?: string;
  metrics: {
    estimatedSavings: number;
    activeHunters: number;
    pricesAnalyzed: number;
    criticalAlerts: number;
  };
  hunters: Array<{
    id: string;
    name: string;
    origin: string;
    destination: string;
    currentPrice: number | null;
    previousPrice?: number | null;
    score: number;
    confidence?: number;
    status?: string;
    updatedAt?: string;
  }>;
  intelligenceFeed?: Array<{
    id: string;
    title?: string;
    message?: string;
    severity?: string;
    createdAt?: string;
  }>;
};

export async function getDashboard(): Promise<DashboardData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";
  try {
    const response = await fetch(`${apiUrl}/dashboard`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as DashboardData;
  } catch {
    return null;
  }
}

export function money(value: number | null | undefined) {
  if (value === null || value === undefined) return "Aguardando";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}
'@

Write-HunterFile "components\Sidebar.tsx" @'
const items = [
  ["⌂", "Visão geral", true],
  ["✈", "Meus Hunters", false],
  ["⌁", "Alertas", false],
  ["◷", "Histórico", false],
  ["▥", "Relatórios", false],
  ["⚙", "Configurações", false],
] as const;

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">H</div>
        <div><strong>Hunter Platform</strong><span>Flight Hunter</span></div>
      </div>

      <div className="statusCard">
        <div><span className="statusDot" /> Hunter online</div>
        <small>Monitorando oportunidades</small>
      </div>

      <nav>
        {items.map(([icon, label, active]) => (
          <a className={active ? "navItem active" : "navItem"} href="#" key={label}>
            <span>{icon}</span>{label}
          </a>
        ))}
      </nav>

      <div className="sidebarBottom">
        <div className="planTop"><span>Plano Starter</span><b>3 ativos</b></div>
        <div className="planBar"><span /></div>
        <button>Conhecer o plano Pro</button>
        <div className="profile"><div className="avatar">RB</div><div><strong>Renan Braga</strong><span>Administrador</span></div></div>
      </div>
    </aside>
  );
}
'@

Write-HunterFile "components\Topbar.tsx" @'
export default function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p>HUNTER PLATFORM</p>
        <h1>Visão geral</h1>
      </div>
      <div className="topActions">
        <div className="search">⌕ <span>Buscar voos, rotas ou alertas</span><kbd>⌘ K</kbd></div>
        <button className="iconButton" aria-label="Notificações">♢<i /></button>
        <button className="primaryButton">＋ Novo Hunter</button>
      </div>
    </header>
  );
}
'@

Write-HunterFile "components\MetricCards.tsx" @'
import { money, type DashboardData } from "@/lib/dashboard";

export default function MetricCards({ metrics }: { metrics: DashboardData["metrics"] }) {
  const cards = [
    { label: "Economia potencial", value: money(metrics.estimatedSavings), note: "Oportunidades atuais", icon: "↘" },
    { label: "Hunters ativos", value: String(metrics.activeHunters), note: "Monitoramentos em execução", icon: "✦" },
    { label: "Preços analisados", value: metrics.pricesAnalyzed.toLocaleString("pt-BR"), note: "Desde o início", icon: "⌁" },
    { label: "Alertas importantes", value: String(metrics.criticalAlerts), note: "Precisam de atenção", icon: "!" },
  ];
  return <section className="metricsGrid">{cards.map((card) => <article className="metricCard" key={card.label}><div className="metricHeader"><span>{card.label}</span><i>{card.icon}</i></div><strong>{card.value}</strong><small>{card.note}</small></article>)}</section>;
}
'@

Write-HunterFile "components\HunterCards.tsx" @'
import { money, type DashboardData } from "@/lib/dashboard";

function recommendation(score: number) {
  if (score >= 95) return ["Comprar agora", "buy"] as const;
  if (score >= 80) return ["Boa oportunidade", "watch"] as const;
  return ["Continuar monitorando", "wait"] as const;
}

export default function HunterCards({ hunters }: { hunters: DashboardData["hunters"] }) {
  return (
    <section className="huntersSection">
      <div className="sectionTitle"><div><p>MONITORAMENTOS PRIORITÁRIOS</p><h2>Seus Hunters</h2></div><a href="#">Ver todos →</a></div>
      {hunters.length === 0 ? <div className="emptyState"><b>Nenhum Hunter cadastrado ainda.</b><span>Crie seu primeiro monitoramento para começar.</span></div> :
      <div className="huntersGrid">{hunters.map((hunter) => {
        const [label, tone] = recommendation(hunter.score);
        const saving = Math.max(0, (hunter.previousPrice ?? hunter.currentPrice ?? 0) - (hunter.currentPrice ?? 0));
        return <article className="hunterCard" key={hunter.id}>
          <div className="hunterTop"><div className="routeIcon">✈</div><div><span>{hunter.name}</span><h3>{hunter.origin} <i>→</i> {hunter.destination}</h3></div><b className={`pill ${tone}`}>{label}</b></div>
          <div className="priceRow"><div><small>Melhor preço atual</small><strong>{money(hunter.currentPrice)}</strong></div><div className="score"><small>Score Hunter</small><strong>{hunter.score}</strong><span>/100</span></div></div>
          <div className="progress"><span style={{ width: `${Math.min(100, Math.max(4, hunter.score))}%` }} /></div>
          <div className="hunterMeta"><span>Economia estimada <b>{money(saving)}</b></span><span>Confiança <b>{hunter.confidence ?? hunter.score}%</b></span></div>
          <button className="secondaryButton">Ver análise completa</button>
        </article>;
      })}</div>}
    </section>
  );
}
'@

Write-HunterFile "components\InsightPanel.tsx" @'
import type { DashboardData } from "@/lib/dashboard";

export default function InsightPanel({ data }: { data: DashboardData }) {
  const best = [...data.hunters].sort((a, b) => b.score - a.score)[0];
  return (
    <section className="bottomGrid">
      <article className="insightCard">
        <div className="eyebrow"><span>✦</span> INSIGHT DO HUNTER</div>
        <h2>{best ? `${best.origin} → ${best.destination} é sua melhor oportunidade agora.` : "Seu Hunter está pronto para analisar novas rotas."}</h2>
        <p>{best ? `O monitoramento atingiu score ${best.score}. Quanto maior o score, mais favorável é o momento de compra.` : "Cadastre uma rota para receber recomendações baseadas em preço, histórico e confiança."}</p>
        <a href="#">Entender esta recomendação →</a>
      </article>
      <article className="activityCard">
        <div className="sectionTitle compact"><div><p>ATIVIDADE RECENTE</p><h2>Central de inteligência</h2></div><span className="live"><i /> AO VIVO</span></div>
        <ul>
          <li><i>✓</i><div><b>API conectada</b><span>Dados atualizados em tempo real</span></div></li>
          <li><i>↻</i><div><b>{data.metrics.pricesAnalyzed} preços analisados</b><span>Base histórica em crescimento</span></div></li>
          <li><i>!</i><div><b>{data.metrics.criticalAlerts} alertas aguardando</b><span>Revise oportunidades importantes</span></div></li>
        </ul>
      </article>
    </section>
  );
}
'@

Write-HunterFile "app\page.tsx" @'
import HunterCards from "@/components/HunterCards";
import InsightPanel from "@/components/InsightPanel";
import MetricCards from "@/components/MetricCards";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getDashboard } from "@/lib/dashboard";

export default async function Home() {
  const dashboard = await getDashboard();
  return (
    <div className="appShell">
      <Sidebar />
      <main className="mainContent">
        <Topbar />
        {!dashboard ? <section className="apiError"><div>!</div><h2>Não foi possível conectar à API</h2><p>Confirme que o comando <code>pnpm dev</code> está rodando e tente atualizar a página.</p></section> : <>
          <section className="hero">
            <div><span className="heroBadge">✦ INTELIGÊNCIA ATIVA</span><h2>Boa tarde, Renan.</h2><p>Seus Hunters continuam trabalhando. Veja as oportunidades que merecem sua atenção hoje.</p></div>
            <div className="heroVisual"><div className="radar"><i /><i /><i /><b>✈</b></div><small>ANALISANDO MERCADO</small></div>
          </section>
          <MetricCards metrics={dashboard.metrics} />
          <HunterCards hunters={dashboard.hunters} />
          <InsightPanel data={dashboard} />
        </>}
      </main>
    </div>
  );
}
'@

Write-HunterFile "app\globals.css" @'
:root{--navy:#07152f;--blue:#2563eb;--blue2:#3977ef;--ink:#111b2e;--muted:#718096;--line:#e6eaf1;--bg:#f5f7fb;--white:#fff;--green:#19a974;--amber:#e7a42f}*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,a{font:inherit}.appShell{min-height:100vh;display:flex}.sidebar{position:fixed;inset:0 auto 0 0;width:268px;background:linear-gradient(180deg,#07152f,#061126);color:white;padding:28px 20px;display:flex;flex-direction:column;z-index:5}.brand{display:flex;gap:12px;align-items:center;padding:0 8px}.brandMark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-weight:900;background:linear-gradient(145deg,#4f8cff,#2255d7);box-shadow:0 8px 24px #1747c777}.brand strong,.brand span{display:block}.brand strong{font-size:15px}.brand span{font-size:12px;color:#91a2c3;margin-top:3px}.statusCard{margin:28px 0 20px;padding:14px 16px;border:1px solid #203254;border-radius:14px;background:#0d2040}.statusCard div{font-size:13px;font-weight:700}.statusCard small{display:block;color:#7f94ba;margin-top:6px}.statusDot{display:inline-block;width:8px;height:8px;border-radius:99px;background:#25d28f;box-shadow:0 0 0 5px #25d28f1c;margin-right:8px}.sidebar nav{display:grid;gap:7px}.navItem{color:#90a1c0;text-decoration:none;padding:12px 14px;border-radius:12px;font-size:13px;font-weight:650}.navItem span{display:inline-block;width:27px}.navItem:hover,.navItem.active{background:#183462;color:white}.navItem.active{box-shadow:inset 3px 0 #4b83ff}.sidebarBottom{margin-top:auto}.planTop{display:flex;justify-content:space-between;font-size:11px;color:#9aabc8}.planTop b{color:#d4dceb}.planBar{height:5px;background:#1c3152;border-radius:9px;margin:10px 0 13px;overflow:hidden}.planBar span{display:block;width:58%;height:100%;background:#4f83ff}.sidebarBottom button{width:100%;border:1px solid #29436b;background:#102746;color:#dce6f7;border-radius:10px;padding:10px;font-size:12px;font-weight:700}.profile{display:flex;align-items:center;gap:10px;border-top:1px solid #1b2c49;margin-top:18px;padding:18px 5px 0}.avatar{width:34px;height:34px;border-radius:50%;background:#e8efff;color:#254fbd;display:grid;place-items:center;font-size:11px;font-weight:800}.profile strong,.profile span{display:block}.profile strong{font-size:12px}.profile span{font-size:10px;color:#8193b2;margin-top:2px}.mainContent{width:calc(100% - 268px);margin-left:268px;padding:25px 34px 50px}.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px}.topbar p,.sectionTitle p{margin:0;color:#8b95a7;letter-spacing:.16em;font-size:9px;font-weight:800}.topbar h1{font-size:21px;margin:5px 0 0}.topActions{display:flex;gap:10px;align-items:center}.search{height:39px;width:280px;border:1px solid var(--line);border-radius:11px;background:white;display:flex;align-items:center;gap:10px;color:#a1a9b7;padding:0 11px;font-size:11px}.search span{flex:1}.search kbd{background:#f0f2f6;border:1px solid #e0e4eb;padding:3px 6px;border-radius:6px;font-size:9px}.iconButton{position:relative;width:39px;height:39px;border:1px solid var(--line);border-radius:11px;background:white}.iconButton i{position:absolute;width:6px;height:6px;background:#ef5f6c;border-radius:50%;right:8px;top:8px}.primaryButton{height:39px;border:0;border-radius:11px;background:#2865df;color:white;padding:0 16px;font-size:11px;font-weight:750;box-shadow:0 8px 20px #2865df2b}.hero{min-height:205px;display:flex;align-items:center;justify-content:space-between;padding:34px 43px;border-radius:20px;color:white;overflow:hidden;background:radial-gradient(circle at 70% 30%,#2f61be 0,#173d83 27%,#0a2452 65%,#081a39 100%);box-shadow:0 15px 40px #102b5d26}.heroBadge{font-size:9px;font-weight:800;letter-spacing:.14em;color:#a9c4ff;background:#ffffff0f;border:1px solid #ffffff1d;padding:7px 10px;border-radius:99px}.hero h2{font-size:34px;margin:17px 0 7px;letter-spacing:-.035em}.hero p{max-width:540px;color:#b8c8e4;font-size:13px;line-height:1.7;margin:0}.heroVisual{width:250px;text-align:center}.radar{position:relative;width:132px;height:132px;margin:auto;border-radius:50%;border:1px solid #9ac2ff2c;display:grid;place-items:center;background:radial-gradient(circle,#3875e280 0 3%,transparent 4%)}.radar:before,.radar:after,.radar i{content:"";position:absolute;border:1px solid #90b7ff31;border-radius:50%}.radar:before{inset:22px}.radar:after{inset:44px}.radar i:nth-child(1){width:5px;height:5px;background:#68a6ff;border:0;left:24px;top:42px;box-shadow:0 0 13px #68a6ff}.radar i:nth-child(2){width:5px;height:5px;background:#68a6ff;border:0;right:30px;bottom:34px;box-shadow:0 0 13px #68a6ff}.radar i:nth-child(3){inset:0;border-left-color:#75a9ff99;transform:rotate(35deg)}.radar b{font-size:25px;color:#d9e7ff;z-index:2}.heroVisual small{display:block;color:#7fa5df;font-size:8px;letter-spacing:.18em;margin-top:10px}.metricsGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:16px 0 31px}.metricCard{background:white;border:1px solid var(--line);border-radius:15px;padding:18px 20px;box-shadow:0 5px 20px #1423440a}.metricHeader{display:flex;justify-content:space-between;color:#7d8798;font-size:10px}.metricHeader i{width:24px;height:24px;border-radius:8px;background:#eef4ff;color:#3870df;display:grid;place-items:center;font-style:normal;font-weight:900}.metricCard>strong{display:block;font-size:24px;margin-top:5px;letter-spacing:-.04em}.metricCard>small{font-size:9px;color:#9aa3b2}.sectionTitle{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:14px}.sectionTitle h2{font-size:19px;margin:5px 0 0}.sectionTitle a,.insightCard a{color:#356bd6;text-decoration:none;font-size:10px;font-weight:800}.huntersGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.hunterCard,.activityCard,.insightCard,.emptyState{background:white;border:1px solid var(--line);border-radius:16px;padding:19px;box-shadow:0 5px 20px #14234408}.hunterTop{display:flex;align-items:center;gap:10px}.routeIcon{width:34px;height:34px;background:#edf3ff;color:#3970df;border-radius:10px;display:grid;place-items:center}.hunterTop>div:nth-child(2){flex:1}.hunterTop span{font-size:9px;color:#929bad}.hunterTop h3{margin:3px 0 0;font-size:13px}.hunterTop h3 i{font-style:normal;color:#4777df;margin:0 4px}.pill{font-size:7px;letter-spacing:.07em;text-transform:uppercase;border-radius:99px;padding:6px 8px}.pill.buy{background:#e7f8f0;color:#14835d}.pill.watch{background:#edf3ff;color:#315fc4}.pill.wait{background:#fff4dd;color:#a66b09}.priceRow{display:flex;justify-content:space-between;align-items:end;margin-top:21px}.priceRow small,.score small{display:block;color:#929bad;font-size:8px}.priceRow>div>strong{display:block;font-size:22px;margin-top:3px}.score{text-align:right}.score strong{font-size:17px;color:#2f65d1}.score span{font-size:8px;color:#9aa4b3}.progress{height:4px;border-radius:9px;background:#edf0f4;margin:13px 0;overflow:hidden}.progress span{display:block;height:100%;background:linear-gradient(90deg,#4d83f1,#1fb98b);border-radius:9px}.hunterMeta{display:flex;justify-content:space-between;color:#8d97a7;font-size:8px}.hunterMeta b{color:#46536a;margin-left:3px}.secondaryButton{width:100%;border:1px solid #dde3ed;background:white;color:#3e4d65;border-radius:9px;padding:9px;margin-top:16px;font-size:9px;font-weight:800}.bottomGrid{display:grid;grid-template-columns:1.25fr 1fr;gap:14px;margin-top:28px}.insightCard{padding:25px;background:linear-gradient(135deg,#f9fbff,#eef4ff);border-color:#dce7fb}.eyebrow{font-size:8px;letter-spacing:.14em;font-weight:900;color:#4771c7}.eyebrow span{display:inline-grid;place-items:center;width:23px;height:23px;border-radius:8px;background:#2e68d8;color:white;margin-right:8px}.insightCard h2{font-size:19px;max-width:540px;margin:15px 0 8px}.insightCard p{font-size:10px;line-height:1.7;color:#6f7b8e;max-width:570px}.insightCard a{display:inline-block;margin-top:7px}.sectionTitle.compact{align-items:center}.live{font-size:7px;color:#8692a4;background:#f4f6f9;padding:6px 8px;border-radius:99px}.live i{display:inline-block;width:5px;height:5px;border-radius:50%;background:#1db780;margin-right:4px}.activityCard ul{list-style:none;padding:0;margin:8px 0 0}.activityCard li{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid #eef0f4}.activityCard li>i{width:27px;height:27px;border-radius:8px;background:#edf4ff;color:#3470dc;display:grid;place-items:center;font-style:normal;font-size:10px}.activityCard li b,.activityCard li span{display:block}.activityCard li b{font-size:9px}.activityCard li span{font-size:8px;color:#929cab;margin-top:3px}.emptyState{text-align:center;padding:35px}.emptyState b,.emptyState span{display:block}.emptyState span{font-size:11px;color:#8994a6;margin-top:7px}.apiError{background:white;border:1px solid #f2d9dc;border-radius:18px;padding:50px;text-align:center}.apiError>div{width:50px;height:50px;border-radius:50%;background:#fff0f1;color:#dc5361;display:grid;place-items:center;margin:auto;font-weight:900}.apiError h2{margin:15px 0 8px}.apiError p{color:#7b8596;font-size:13px}.apiError code{background:#f1f3f6;padding:3px 6px;border-radius:5px}@media(max-width:1050px){.search{display:none}.metricsGrid{grid-template-columns:repeat(2,1fr)}.huntersGrid{grid-template-columns:1fr}.heroVisual{display:none}.bottomGrid{grid-template-columns:1fr}}@media(max-width:760px){.sidebar{position:static;width:100%;height:auto;padding:18px}.sidebar nav,.statusCard,.sidebarBottom{display:none}.appShell{display:block}.mainContent{width:100%;margin:0;padding:18px}.topbar{align-items:flex-start}.topActions .iconButton{display:none}.primaryButton{padding:0 11px}.hero{padding:28px 23px}.hero h2{font-size:28px}.metricsGrid{grid-template-columns:1fr 1fr}.topbar p{display:none}}@media(max-width:480px){.metricsGrid{grid-template-columns:1fr}.topbar h1{font-size:18px}.primaryButton{font-size:10px}.hero p{font-size:12px}}
'@

Write-Host ""
Write-Host "Premium UI applied successfully." -ForegroundColor Green
Write-Host "Backup: $BackupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "  cd C:\hunter-platform-clean"
Write-Host "  pnpm dev"
Write-Host ""
Write-Host "Open http://localhost:3000" -ForegroundColor Cyan
