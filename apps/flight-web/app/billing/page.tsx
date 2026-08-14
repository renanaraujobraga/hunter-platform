import { Check, Crown } from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { Badge, PageHeader, PrimaryButton, Surface } from "@/components/design-system/ui";

export default function BillingPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="Conta"
          title="Assinatura"
          description="Gerencie seu plano, Hunters ativos e cobrança."
        />

        <div className="mt-7 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
          <Surface className="bg-gradient-to-br from-white via-white to-[#f0edff] p-7">
            <div className="flex items-start justify-between">
              <div>
                <Badge tone="info">PLANO ATUAL</Badge>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7558ff] to-[#2e6dff] text-white shadow-lg">
                    <Crown className="h-5 w-5" />
                  </span>
                  <h2 className="text-3xl font-bold">Starter</h2>
                </div>
                <p className="mt-3 text-sm text-[#71809d]">Ideal para começar a monitorar suas viagens.</p>
              </div>
              <p className="text-3xl font-bold">R$ 29<span className="text-sm font-medium text-[#7b87a3]">/mês</span></p>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {["3 Hunters ativos", "Alertas em tempo real", "Histórico de preços", "Relatórios mensais"].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eafaf2] text-[#19aa64]">
                    <Check className="h-4 w-4" />
                  </span>
                  {feature}
                </div>
              ))}
            </div>

            <PrimaryButton className="mt-8">Fazer upgrade</PrimaryButton>
          </Surface>

          <Surface className="p-7">
            <h2 className="text-lg font-bold">Próxima cobrança</h2>
            <p className="mt-5 text-3xl font-bold">R$ 29,00</p>
            <p className="mt-2 text-sm text-[#71809d]">Em 21 de agosto de 2026</p>
            <div className="mt-6 rounded-2xl bg-[#f7f9fd] p-4">
              <p className="text-xs text-[#7b87a3]">Forma de pagamento</p>
              <p className="mt-2 text-sm font-bold">Visa final 4242</p>
            </div>
          </Surface>
        </div>
      </div>
    </AppLayout>
  );
}
