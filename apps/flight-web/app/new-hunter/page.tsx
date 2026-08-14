"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, PlaneTakeoff, SlidersHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, PrimaryButton, SecondaryButton, Surface } from "@/components/design-system/ui";
import { api } from "@/lib/api";

export default function NewHunterPage() {
  const router = useRouter(); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  const [form,setForm]=useState({name:"",origin:"FLN",destination:"",departureFrom:"",departureTo:"",returnFrom:"",returnTo:"",maxPrice:""});
  const set=(k:string,v:string)=>setForm(p=>({...p,[k]:v}));
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError("");try{const h=await api.createHunter({...form,maxPrice:Number(form.maxPrice)});router.push(`/trips/${h.id}`);router.refresh();}catch(err){setError(err instanceof Error?err.message:"Erro ao criar Hunter");}finally{setLoading(false)}}
  const input="mt-2 h-12 w-full rounded-2xl border border-[#e5e9f2] bg-white px-4 font-normal outline-none transition focus:border-[#7a62ff] focus:shadow-[0_0_0_4px_rgba(122,98,255,.08)]";
  return <AppLayout><div className="mx-auto max-w-[1000px]"><PageHeader eyebrow="Novo monitoramento" title="Criar Flight Hunter" description="Defina rota, período e teto de preço. O Hunter fará o resto." />
    <div className="mt-7 grid gap-4 md:grid-cols-3">{[[PlaneTakeoff,"1. Rota","Origem e destino"],[MapPin,"2. Período","Datas da viagem"],[SlidersHorizontal,"3. Preferências","Preço máximo"]].map(([Icon,t,d],i)=>{const C=Icon as typeof PlaneTakeoff;return <Surface key={String(t)} className={`p-4 ${i===0?"ring-2 ring-[#7158f3]/20":""}`}><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#5e55e8]"><C className="h-4 w-4"/></span><div><p className="text-sm font-bold">{String(t)}</p><p className="text-[11px] text-[#8290aa]">{String(d)}</p></div></div></Surface>})}</div>
    <form onSubmit={submit}><Surface className="mt-5 p-7"><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold">Nome do Hunter<input required value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Florianópolis → Lisboa" className={input}/></label>
      <label className="text-sm font-semibold">Valor máximo (R$)<input required type="number" min="1" value={form.maxPrice} onChange={e=>set("maxPrice",e.target.value)} placeholder="5000" className={input}/></label>
      <label className="text-sm font-semibold">Origem (IATA)<input required maxLength={3} value={form.origin} onChange={e=>set("origin",e.target.value.toUpperCase())} placeholder="FLN" className={input}/></label>
      <label className="text-sm font-semibold">Destino (IATA)<input required maxLength={3} value={form.destination} onChange={e=>set("destination",e.target.value.toUpperCase())} placeholder="LIS" className={input}/></label>
      <label className="text-sm font-semibold">Ida — início<input required type="date" value={form.departureFrom} onChange={e=>set("departureFrom",e.target.value)} className={input}/></label>
      <label className="text-sm font-semibold">Ida — fim<input type="date" value={form.departureTo} onChange={e=>set("departureTo",e.target.value)} className={input}/></label>
      <label className="text-sm font-semibold">Volta — início<input type="date" value={form.returnFrom} onChange={e=>set("returnFrom",e.target.value)} className={input}/></label>
      <label className="text-sm font-semibold">Volta — fim<input type="date" value={form.returnTo} onChange={e=>set("returnTo",e.target.value)} className={input}/></label>
    </div>{error&&<p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<div className="mt-7 flex justify-end gap-3"><span onClick={()=>router.back()}><SecondaryButton>Cancelar</SecondaryButton></span><PrimaryButton className={loading?"opacity-60":""}>{loading?"Criando...":"Criar Hunter"}</PrimaryButton></div></Surface></form>
  </div></AppLayout>;
}
