'use client';

import { FormEvent, useMemo, useState } from 'react';
import { createHunter } from '../lib/api';
import type { CreateHunterInput } from '../lib/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
};

const initialForm: CreateHunterInput = {
  name: '',
  origin: 'FLN',
  destination: '',
  departureFrom: '',
  departureTo: '',
  maxPrice: undefined
};

export function CreateHunterModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<CreateHunterInput>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const suggestedName = useMemo(() => {
    if (!form.origin || !form.destination) return '';
    return `${form.origin.toUpperCase()} → ${form.destination.toUpperCase()}`;
  }, [form.origin, form.destination]);

  if (!open) return null;

  function update<K extends keyof CreateHunterInput>(key: K, value: CreateHunterInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      await createHunter({
        ...form,
        name: form.name.trim() || suggestedName,
        origin: form.origin.trim().toUpperCase(),
        destination: form.destination.trim().toUpperCase(),
        maxPrice: form.maxPrice ? Number(form.maxPrice) : undefined
      });
      setForm(initialForm);
      await onCreated();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar o Hunter.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-hunter-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">NOVO MONITORAMENTO</p>
            <h2 id="create-hunter-title">Criar Flight Hunter</h2>
            <p>Defina a rota, o período e seu preço máximo.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <form onSubmit={submit} className="hunter-form">
          <label className="field field-full">
            <span>Nome do Hunter</span>
            <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder={suggestedName || 'Ex.: Férias em Fortaleza'} maxLength={80} />
            <small>Opcional. Usaremos a rota como nome se ficar em branco.</small>
          </label>

          <label className="field">
            <span>Aeroporto de origem</span>
            <input required value={form.origin} onChange={(event) => update('origin', event.target.value.toUpperCase().slice(0, 3))} placeholder="FLN" minLength={3} maxLength={3} />
          </label>

          <label className="field">
            <span>Aeroporto de destino</span>
            <input required value={form.destination} onChange={(event) => update('destination', event.target.value.toUpperCase().slice(0, 3))} placeholder="FOR" minLength={3} maxLength={3} />
          </label>

          <label className="field">
            <span>Data inicial</span>
            <input required type="date" value={form.departureFrom} onChange={(event) => update('departureFrom', event.target.value)} />
          </label>

          <label className="field">
            <span>Data final</span>
            <input required type="date" min={form.departureFrom || undefined} value={form.departureTo} onChange={(event) => update('departureTo', event.target.value)} />
          </label>

          <label className="field field-full">
            <span>Preço máximo desejado</span>
            <div className="money-input"><b>R$</b><input type="number" min="0" step="1" value={form.maxPrice ?? ''} onChange={(event) => update('maxPrice', event.target.value ? Number(event.target.value) : undefined)} placeholder="1.200" /></div>
          </label>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button className="cancel-button" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="save-button" type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar Hunter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
