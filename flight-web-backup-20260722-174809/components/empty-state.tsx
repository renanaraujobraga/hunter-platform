import { TargetIcon } from './icons';

export function EmptyState() {
  return (
    <div className="empty-state">
      <span><TargetIcon /></span>
      <strong>Nenhum monitoramento ativo</strong>
      <p>Crie seu primeiro Hunter para acompanhar oportunidades de passagens.</p>
      <button>+ Novo Hunter</button>
    </div>
  );
}
