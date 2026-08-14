'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreateHunterModal } from '../components/create-hunter-modal';
import { EmptyState } from '../components/empty-state';
import { HunterCard } from '../components/hunter-card';
import { ActivityIcon, ArrowUpIcon, BellIcon, ChartIcon, SparkIcon, TargetIcon, WalletIcon } from '../components/icons';
import { Sidebar } from '../components/sidebar';
import { StatCard } from '../components/stat-card';
import { Topbar } from '../components/topbar';
import { getDashboard } from '../lib/api';
import type { Dashboard } from '../lib/types';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const emptyMetrics = { estimatedSavings: 0, activeHunters: 0, pricesAnalyzed: 0, criticalAlerts: 0 };

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
      setApiError(false);
    } catch {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const metrics = dashboard?.metrics ?? emptyMetrics;
  const hunters = dashboard?.hunters ?? [];
  const bestHunter = useMemo(() => [...hunters].sort((a, b) => b.score - a.score)[0], [hunters]);

  async function handleCreated() {
    setToast('Hunter criado com sucesso. O monitoramento já está ativo.');
    await loadDashboard();
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />
        <div className="content">
          {apiError && (
            <div className="api-banner"><span className="api-dot" /><div><strong>API temporariamente indisponível</strong><p>Confirme se o backend está rodando na porta 3333 e tente novamente.</p></div><button onClick={() => void loadDashboard()}>Tentar novamente</button></div>
          )}

          <section className="hero-panel">
            <div className="hero-copy">
              <span className="hero-chip"><SparkIcon /> Inteligência ativa</span>
              <h2>Bom dia, Renan.</h2>
              <p>Seus Hunters continuam analisando o mercado. Encontramos <strong>{metrics.criticalAlerts} {metrics.criticalAlerts === 1 ? 'alerta novo' : 'alertas novos'}</strong> para você.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => setCreateOpen(true)}>+ Criar novo Hunter</button>
                <button className="ghost-button" onClick={() => document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth' })}>Ver resumo do dia</button>
              </div>
            </div>
            <div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="hero-plane">✈</span><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" /></div>
          </section>

          <section className="stats-grid">
            <StatCard label="Economia estimada" value={money.format(metrics.estimatedSavings)} helper="potencial acumulado" icon={<WalletIcon />} tone="purple" />
            <StatCard label="Hunters ativos" value={String(metrics.activeHunters)} helper="monitoramentos em execução" icon={<TargetIcon />} tone="blue" />
            <StatCard label="Preços analisados" value={metrics.pricesAnalyzed.toLocaleString('pt-BR')} helper="registros processados" icon={<ActivityIcon />} tone="green" />
            <StatCard label="Alertas não lidos" value={String(metrics.criticalAlerts)} helper="oportunidades aguardando" icon={<BellIcon />} tone="orange" />
          </section>

          <section className="dashboard-grid">
            <div className="section-card hunters-section">
              <div className="section-heading"><div><p className="eyebrow">MONITORAMENTOS</p><h3>Seus Hunters</h3></div><button className="text-action" onClick={() => setCreateOpen(true)}>Novo Hunter <span>＋</span></button></div>
              <div className="hunter-list">
                {loading ? <div className="skeleton-list"><div /><div /></div> : hunters.length ? hunters.map((hunter) => <HunterCard hunter={hunter} key={hunter.id} />) : <EmptyState />}
              </div>
            </div>

            <aside className="side-column">
              <div className="insight-card">
                <div className="insight-heading"><span><SparkIcon /></span><div><p>HUNTER INSIGHT</p><strong>Recomendação inteligente</strong></div></div>
                {bestHunter ? <><div className="insight-score"><span>{bestHunter.score}</span><small>/100</small><i>{bestHunter.score >= 90 ? 'Excelente' : bestHunter.score >= 75 ? 'Muito bom' : 'Acompanhar'}</i></div><p className="insight-text">A rota <strong>{bestHunter.origin} → {bestHunter.destination}</strong> apresenta o melhor score entre seus monitoramentos ativos.</p><div className="insight-route"><span>{bestHunter.origin}</span><i /><span>{bestHunter.destination}</span></div><button>Ver oportunidade <span>→</span></button></> : <p className="insight-text">Crie seu primeiro Hunter para receber recomendações inteligentes de compra.</p>}
              </div>

              <div className="activity-card" id="activity">
                <div className="section-heading compact"><div><p className="eyebrow">ATIVIDADE</p><h3>Resumo do dia</h3></div><ChartIcon /></div>
                <div className="activity-row"><span className="activity-icon purple"><ArrowUpIcon /></span><div><strong>{money.format(metrics.estimatedSavings)}</strong><p>Economia potencial identificada</p></div></div>
                <div className="activity-row"><span className="activity-icon green"><ActivityIcon /></span><div><strong>{metrics.pricesAnalyzed.toLocaleString('pt-BR')}</strong><p>Preços analisados pela plataforma</p></div></div>
                <div className="activity-row"><span className="activity-icon orange"><BellIcon /></span><div><strong>{metrics.criticalAlerts}</strong><p>Alertas aguardando sua atenção</p></div></div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <CreateHunterModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
      {toast && <div className="success-toast"><span>✓</span>{toast}</div>}
    </div>
  );
}
