"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-[#f5f7ff] text-[#0b1536]">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #f5f7ff;
        }

        ::selection {
          background: rgba(111, 85, 255, 0.18);
        }

        @keyframes premiumIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatPlane {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-3px) rotate(-7deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-140%) skewX(-18deg); }
          100% { transform: translateX(280%) skewX(-18deg); }
        }

        @keyframes pulseSoft {
          0%, 100% { opacity: .55; transform: scale(1); }
          50% { opacity: .85; transform: scale(1.08); }
        }

        .animate-premium-in {
          animation: premiumIn .55s cubic-bezier(.22,.9,.25,1) both;
        }

        .premium-logo-plane {
          animation: floatPlane 3.4s ease-in-out infinite;
        }

        .premium-surface {
          transition:
            transform .32s cubic-bezier(.2,.8,.2,1),
            box-shadow .32s cubic-bezier(.2,.8,.2,1),
            border-color .32s ease;
        }

        .premium-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 28px 70px rgba(53, 68, 120, 0.13);
          border-color: rgba(255,255,255,1);
        }

        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(16,26,58,.22);
        }

        .premium-button:active {
          transform: translateY(0) scale(.98);
        }

        .premium-shine::after {
          content: "";
          position: absolute;
          inset: -30% auto -30% -35%;
          width: 30%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 4.6s ease-in-out infinite;
        }

        .premium-orb {
          animation: pulseSoft 7s ease-in-out infinite;
        }

        .premium-grid {
          background-image:
            linear-gradient(rgba(115, 130, 170, .055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(115, 130, 170, .055) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, black 0%, transparent 92%);
        }

        .stagger > * {
          animation: premiumIn .58s cubic-bezier(.22,.9,.25,1) both;
        }

        .stagger > *:nth-child(2) { animation-delay: .06s; }
        .stagger > *:nth-child(3) { animation-delay: .12s; }
        .stagger > *:nth-child(4) { animation-delay: .18s; }
        .stagger > *:nth-child(5) { animation-delay: .24s; }
        .stagger > *:nth-child(6) { animation-delay: .30s; }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="premium-orb absolute left-[16%] top-[-240px] h-[600px] w-[600px] rounded-full bg-[#dce6ff] opacity-75 blur-[130px]" />
        <div className="premium-orb absolute right-[-190px] top-[120px] h-[540px] w-[540px] rounded-full bg-[#eee4ff] opacity-65 blur-[140px]" />
        <div className="premium-grid absolute inset-0 opacity-60" />
      </div>

      <Sidebar />

      <section className="relative min-h-screen px-5 py-6 lg:ml-[256px] lg:px-9">
        <Topbar />
        {children}
      </section>
    </main>
  );
}
