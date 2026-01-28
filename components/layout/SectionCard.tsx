// Reusable section container for consistent layout grouping.
import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  status?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  subtitle,
  status = "Completed",
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="text-xs text-emerald-600">{status}</div>
      </div>
      {children}
    </section>
  );
}
