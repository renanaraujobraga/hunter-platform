import type { Hunter } from '../lib/types';
import { ChevronIcon, ClockIcon, PlaneIcon } from './icons';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function scoreClass(score: number) {
  if (score >= 95) return 'excellent';
  if (score >= 80) return 'good';
  return 'watch';
}

export function HunterCard({ hunter }: { hunter: Hunter }) {
  const price = hunter.currentPrice == null ? 'Aguardando' : money.format(hunter.currentPrice);
  const difference = hunter.previousPrice && hunter.currentPrice
    ? Math.max(0, Math.round(((hunter.previousPrice - hunter.currentPrice) / hunter.previousPrice) * 100))
    : 0;

  return (
    <article className="hunter-card">
      <div className="hunter-card-top">
        <span className="route-icon"><PlaneIcon /></span>
        <div className="route-title">
          <div><strong>{hunter.origin}</strong><span className="route-line"><i /><PlaneIcon /><i /></span><strong>{hunter.destination}</strong></div>
          <p>{hunter.name}</p>
        </div>
        <span className={`score-pill ${scoreClass(hunter.score)}`}>{hunter.score} score</span>
      </div>
      <div className="hunter-price-row">
        <div><small>Menor preço encontrado</small><strong>{price}</strong></div>
        {difference > 0 ? <span className="price-drop">↓ {difference}%</span> : <span className="monitoring">Monitorando</span>}
      </div>
      <div className="hunter-footer">
        <span><ClockIcon />Atualizado recentemente</span>
        <button aria-label={`Abrir ${hunter.name}`}><ChevronIcon /></button>
      </div>
    </article>
  );
}
