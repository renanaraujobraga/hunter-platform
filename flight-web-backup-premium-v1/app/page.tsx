type Dashboard = {
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
    score: number;
  }>;
};

async function getDashboard(): Promise<Dashboard | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

  try {
    const response = await fetch(`${apiUrl}/dashboard`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json() as Promise<Dashboard>;
  } catch {
    return null;
  }
}

export default async function Home() {
  const dashboard = await getDashboard();

  return (
    <main>
      <p className="muted">Hunter Platform</p>
      <h1>Flight Hunter</h1>
      <p>Monitoramento inteligente de passagens em reais.</p>

      {!dashboard ? (
        <div className="card">
          <strong>API ainda não conectada.</strong>
          <p className="muted">Inicie o projeto com pnpm dev.</p>
        </div>
      ) : (
        <>
          <section className="grid">
            <div className="card">
              <span className="muted">Economia estimada</span>
              <div className="metric">R$ {dashboard.metrics.estimatedSavings.toFixed(2)}</div>
            </div>
            <div className="card">
              <span className="muted">Hunters ativos</span>
              <div className="metric">{dashboard.metrics.activeHunters}</div>
            </div>
            <div className="card">
              <span className="muted">Preços analisados</span>
              <div className="metric">{dashboard.metrics.pricesAnalyzed}</div>
            </div>
            <div className="card">
              <span className="muted">Alertas não lidos</span>
              <div className="metric">{dashboard.metrics.criticalAlerts}</div>
            </div>
          </section>

          <h2>Monitoramentos</h2>
          <section className="grid">
            {dashboard.hunters.map((hunter) => (
              <article className="card" key={hunter.id}>
                <strong>{hunter.name}</strong>
                <p>{hunter.origin} → {hunter.destination}</p>
                <p>Preço: {hunter.currentPrice ? `R$ ${hunter.currentPrice}` : 'Aguardando'}</p>
                <p>Score: {hunter.score}</p>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
