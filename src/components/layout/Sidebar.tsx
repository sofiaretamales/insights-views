import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Target,
  PackageSearch,
  BarChart3,
  Sparkles,
} from "lucide-react";

const items = [
  { to: "/", label: "Dashboard Ejecutivo", icon: LayoutDashboard, end: true },
  { to: "/ventas", label: "Dashboard de Ventas", icon: TrendingUp, end: false },
  { to: "/audiencias", label: "Dashboard de Audiencias", icon: Users, end: false },
  { to: "/segmentacion", label: "Segmentación", icon: Target, end: false, ai: true },
  { to: "/catalogo", label: "Calidad de Catálogo", icon: PackageSearch, end: false, ai: true },
  { to: "/competencia", label: "Posicionamiento Competitivo", icon: BarChart3, end: false },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-md bg-gradient-brand flex items-center justify-center shadow-elevated">
          <span className="text-primary-foreground font-bold text-sm">I</span>
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-sidebar-accent-foreground tracking-tight">Insights</div>
          <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">por AndesML</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-sidebar-foreground/50 font-medium">
          Analítica
        </div>
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium ring-1 ring-sidebar-primary/30"
          >
            <it.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{it.label}</span>
            {it.ai && (
              <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-sidebar-primary/15 text-sidebar-primary">
                <Sparkles className="h-2.5 w-2.5" /> IA
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="rounded-md bg-sidebar-accent/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60 mb-1">
            Fuente
          </div>
          <div className="text-xs text-sidebar-accent-foreground font-medium">
            BigQuery · TheLook eCommerce
          </div>
          <div className="text-[11px] text-sidebar-foreground/70 mt-1">
            6 materialized views activas
          </div>
        </div>
      </div>
    </aside>
  );
}
