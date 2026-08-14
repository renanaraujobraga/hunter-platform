import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, PrimaryButton, Surface } from "@/components/design-system/ui";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-[1200px]">
        <PageHeader
          eyebrow="Preferências"
          title="Configurações"
          description="Personalize idioma, notificações e comportamento do Hunter."
        />

        <div className="stagger mt-7 space-y-5">
          <Surface className="p-6">
            <h2 className="text-lg font-bold">Perfil</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold">
                Nome
                <input defaultValue="Renan Braga" className="mt-2 h-12 w-full rounded-2xl border border-[#e5e9f2] bg-white px-4 font-normal outline-none transition focus:border-[#7a62ff] focus:shadow-[0_0_0_4px_rgba(122,98,255,.08)]" />
              </label>
              <label className="text-sm font-semibold">
                E-mail
                <input defaultValue="renan@hunter.ai" className="mt-2 h-12 w-full rounded-2xl border border-[#e5e9f2] bg-white px-4 font-normal outline-none transition focus:border-[#7a62ff] focus:shadow-[0_0_0_4px_rgba(122,98,255,.08)]" />
              </label>
            </div>
          </Surface>

          <Surface className="p-6">
            <h2 className="text-lg font-bold">Preferências</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold">
                Idioma
                <select className="mt-2 h-12 w-full rounded-2xl border border-[#e5e9f2] bg-white px-4 font-normal outline-none">
                  <option>Português (Brasil)</option>
                  <option>English</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Moeda
                <select className="mt-2 h-12 w-full rounded-2xl border border-[#e5e9f2] bg-white px-4 font-normal outline-none">
                  <option>Real brasileiro (BRL)</option>
                  <option>Dólar americano (USD)</option>
                </select>
              </label>
            </div>
          </Surface>

          <Surface className="p-6">
            <h2 className="text-lg font-bold">Notificações</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Alertas críticos", "Receber avisos quando o Hunter recomendar compra imediata."],
                ["Queda de preço", "Receber avisos quando uma rota cair mais de 5%."],
                ["Resumo semanal", "Receber uma síntese das viagens monitoradas."],
              ].map(([title, description]) => (
                <div key={title} className="flex items-center justify-between rounded-2xl bg-[#f8f9fd] p-4">
                  <div>
                    <p className="text-sm font-bold">{title}</p>
                    <p className="mt-1 text-xs text-[#7d89a2]">{description}</p>
                  </div>
                  <button className="relative h-7 w-12 rounded-full bg-[#6757ef]">
                    <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </div>
              ))}
            </div>
          </Surface>

          <div className="flex justify-end">
            <PrimaryButton>Salvar alterações</PrimaryButton>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
