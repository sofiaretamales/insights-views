import { KpiCard } from "@/components/ui-extra/KpiCard";
import { Panel } from "@/components/ui-extra/Panel";
import { SectionHeader } from "@/components/ui-extra/SectionHeader";
import { Filters } from "@/components/ui-extra/Filters";
import { PageHeader } from "@/components/ui-extra/PageHeader";

import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { DollarSign, ShoppingBag, Package, Users, ReceiptText, AlertTriangle, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import {
  salesTrend, salesByCategory, fmtCurrency, fmtNumber, execInsights, audienceStates,
  competitivePosition, catalogProducts,
} from "@/lib/mockData";
import { NavLink } from "@/components/NavLink";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--popover-foreground))",
  boxShadow: "var(--shadow-elevated)",
};

export default function ExecutiveDashboard() {
  const totalRevenue = salesTrend.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = salesTrend.reduce((s, d) => s + d.orders, 0);
  const totalUnits = salesTrend.reduce((s, d) => s + d.units, 0);
  const aov = totalRevenue / totalOrders;
  const criticalCatalog = catalogProducts.filter((p) => p.score < 50).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visión ejecutiva del desempeño de tu marca dentro de TheLook eCommerce."
      />
      <Filters showGender showTraffic />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard label="Ventas totales" value={fmtCurrency(totalRevenue)} delta={11.2} hint="vs período anterior" icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Órdenes" value={fmtNumber(totalOrders)} delta={8.4} hint="30d" icon={<ShoppingBag className="h-4 w-4" />} />
        <KpiCard label="Unidades vendidas" value={fmtNumber(totalUnits)} delta={9.6} hint="30d" icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Clientes únicos" value={fmtNumber(18_240)} delta={4.1} hint="30d" icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Ticket promedio" value={fmtCurrency(aov)} delta={2.6} hint="vs período anterior" icon={<ReceiptText className="h-4 w-4" />} />
      </div>

      {/* Trend + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2" title="Tendencia de ventas" description="Revenue diario · últimos 30 días">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Revenue por categoría" description="Top categorías del período">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByCategory} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Module summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Panel
          title="Audiencias"
          description="Compradores activos del período"
          action={<NavLink to="/audiencias" className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">Ver módulo <ArrowRight className="h-3 w-3" /></NavLink>}
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Clientes únicos</span>
              <span className="text-lg font-semibold tabular">18,240</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Mayor estado</span>
              <span className="text-sm font-medium">{audienceStates[0].state}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Edad principal</span>
              <span className="text-sm font-medium">25-34 (32%)</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              Fuente: <span className="font-medium">mvAudienceProfile</span>
            </div>
          </div>
        </Panel>

        <Panel
          title="Calidad de catálogo"
          description="Quality score consolidado"
          action={<NavLink to="/catalogo" className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">Ver módulo <ArrowRight className="h-3 w-3" /></NavLink>}
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Score promedio</span>
              <span className="text-lg font-semibold tabular">71<span className="text-sm text-muted-foreground">/100</span></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Productos críticos</span>
              <span className="text-sm font-medium text-destructive">{criticalCatalog} productos</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Sell-through medio</span>
              <span className="text-sm font-medium">58%</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              Fuente: <span className="font-medium">mvCatalogQuality</span>
            </div>
          </div>
        </Panel>

        <Panel
          title="Posicionamiento competitivo"
          description="Share vs benchmark de categoría"
          action={<NavLink to="/competencia" className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">Ver módulo <ArrowRight className="h-3 w-3" /></NavLink>}
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Mayor share</span>
              <span className="text-sm font-medium">Outerwear · 13.0%</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Mejor crecimiento</span>
              <span className="text-sm font-medium text-success">Sweaters · +6.4 pts</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">A revisar</span>
              <span className="text-sm font-medium text-warning">Tops & Tees</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              Fuente: <span className="font-medium">mvCompetitivePosition</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Insights */}
      <Panel
        title="Insights destacados"
        description="Hallazgos derivados de reglas analíticas sobre las materialized views"
        action={<span className="chip"><Sparkles className="h-3 w-3 text-primary" /> redactado con IA</span>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {execInsights.map((it, i) => (
            <div key={i} className="rounded-lg border border-border p-4 bg-muted/20">
              <div className="flex items-start gap-3">
                <div className={
                  "h-8 w-8 rounded-md shrink-0 flex items-center justify-center " +
                  (it.type === "positive" ? "bg-success/10 text-success" :
                   it.type === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info")
                }>
                  {it.type === "positive" ? <TrendingUp className="h-4 w-4" /> :
                   it.type === "warning" ? <AlertTriangle className="h-4 w-4" /> :
                   <Sparkles className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{it.title}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{it.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
