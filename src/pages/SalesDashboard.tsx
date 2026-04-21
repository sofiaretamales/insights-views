import { SectionHeader } from "@/components/ui-extra/SectionHeader";
import { PageHeader } from "@/components/ui-extra/PageHeader";
import { Filters } from "@/components/ui-extra/Filters";
import { Panel } from "@/components/ui-extra/Panel";
import { KpiCard } from "@/components/ui-extra/KpiCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer, ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart,
} from "recharts";
import { salesTrend, salesByCategory, productsPerformance, fmtCurrency, fmtNumber } from "@/lib/mockData";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function SalesDashboard() {
  const [granularity, setGranularity] = useState("daily");
  const totalRevenue = salesTrend.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = salesTrend.reduce((s, d) => s + d.orders, 0);
  const totalUnits = salesTrend.reduce((s, d) => s + d.units, 0);
  const prevRevenue = salesTrend.reduce((s, d) => s + d.prev, 0);
  const aov = totalRevenue / totalOrders;
  const variation = ((totalRevenue - prevRevenue) / prevRevenue) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        subtitle="Análisis profundo de ventas con comparación contra el período anterior."
      />
      <Filters />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Ventas totales" value={fmtCurrency(totalRevenue)} delta={variation} hint="vs anterior" />
        <KpiCard label="Órdenes" value={fmtNumber(totalOrders)} delta={8.4} hint="período" />
        <KpiCard label="Unidades" value={fmtNumber(totalUnits)} delta={9.6} hint="período" />
        <KpiCard label="Ticket promedio" value={fmtCurrency(aov)} delta={2.6} hint="AOV" />
        <KpiCard label="Precio promedio" value={fmtCurrency(82)} delta={1.3} hint="ASP" />
        <KpiCard label="Variación período" value={`${variation > 0 ? "+" : ""}${variation.toFixed(1)}%`} hint="revenue" />
      </div>

      <Panel
        title="Ventas en el tiempo"
        description="Comparación con período anterior"
        action={
          <Tabs value={granularity} onValueChange={setGranularity}>
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs">Diario</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">Semanal</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Mensual</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesTrend} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area yAxisId="left" type="monotone" name="Revenue" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#rev)" />
              <Line yAxisId="left" type="monotone" name="Período anterior" dataKey="prev" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Bar yAxisId="right" name="Órdenes" dataKey="orders" fill="hsl(var(--chart-2))" opacity={0.5} barSize={10} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Performance por categoría" description="Revenue y unidades del período">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByCategory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={60} interval={0} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Variación por categoría" description="Crecimiento vs período anterior">
          <div className="space-y-2.5">
            {salesByCategory.map((c) => (
              <div key={c.category} className="flex items-center gap-3">
                <div className="w-32 text-sm text-foreground truncate">{c.category}</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className={c.growth >= 0 ? "h-full bg-success" : "h-full bg-destructive"}
                    style={{ width: `${Math.min(Math.abs(c.growth) * 4, 100)}%` }}
                  />
                </div>
                <div className={"w-16 text-right text-sm font-medium tabular " + (c.growth >= 0 ? "text-success" : "text-destructive")}>
                  {c.growth >= 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
                  {Math.abs(c.growth).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Performance por producto" description="Top productos del período">
        <div className="overflow-x-auto -mx-5">
          <table className="data-grid">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Unidades</th>
                <th className="text-right">Precio prom.</th>
                <th className="text-right">Sell-through</th>
              </tr>
            </thead>
            <tbody>
              {productsPerformance.map((p) => (
                <tr key={p.name}>
                  <td className="font-medium text-foreground">{p.name}</td>
                  <td className="text-muted-foreground">{p.category}</td>
                  <td className="text-right">{fmtCurrency(p.revenue)}</td>
                  <td className="text-right">{fmtNumber(p.units)}</td>
                  <td className="text-right">{fmtCurrency(p.avgPrice)}</td>
                  <td className="text-right">
                    <span className={
                      "chip " + (p.sellThrough >= 0.7 ? "text-success" : p.sellThrough >= 0.5 ? "text-warning" : "text-destructive")
                    }>
                      {(p.sellThrough * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
