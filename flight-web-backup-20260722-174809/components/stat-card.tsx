import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone: 'purple' | 'blue' | 'green' | 'orange';
};

export function StatCard({ label, value, helper, icon, tone }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-copy">
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{helper}</span>
      </div>
      <div className={`mini-chart ${tone}`} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    </article>
  );
}
