import { PageHeader } from "@/components/ui-extra/PageHeader";
import { Filters } from "@/components/ui-extra/Filters";
import { KpiCard } from "@/components/ui-extra/KpiCard";
import { ChartCard } from "@/components/ui-extra/ChartCard";
import { brandKpis, demoByAge, demoByCountry, demoByGender, rfScatter, trafficSources } from "@/lib/mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { Panel } from "@/components/ui-extra/Panel";
import { audienceAge, audienceGender, audienceStates, trafficFunnel, fmtNumber, aiSegmentSuggestions } from "@/lib/mockData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Users, Repeat, Clock, Receipt, MapPin, Crown, TrendingDown } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function Audiencias() {
  const ordersPerCustomer = (brandKpis.orders / brandKpis.uniqueCustomers).toFixed(2);
  const ticketPerCustomer = brandKpis.totalSales / brandKpis.uniqueCustomers;
  const totalAggrPurchases = trafficFunnel.reduce((s, t) => s + t.purchases, 0);
  const totalAggrViews = trafficFunnel.reduce((s, t) => s + t.visits, 0);

  return (
    <div>
      <PageHeader
        title="Audiencias"
        subtitle="Quién compra tu marca en TheLook. Datos agregados, sin información personal identificable."
      />
      <Filters showGender showTraffic />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Clientes únicos" value={fmtNum(brandKpis.uniqueCustomers)} delta={brandKpis.deltas.uniqueCustomers} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Órdenes / cliente" value={ordersPerCustomer} icon={<Repeat className="h-4 w-4" />} hint="Frecuencia" />
        <KpiCard label="Recencia promedio" value="42 d" icon={<Clock className="h-4 w-4" />} hint="Días desde última compra" />
        <KpiCard label="Ticket / cliente" value={fmtMoney(ticketPerCustomer)} icon={<Receipt className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ChartCard title="Por gender" subtitle="users.gender">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={demoByGender} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {demoByGender.map((_, i) => (
                  <Cell key={i} fill={`hsl(var(--chart-${i + 1}))`} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs mt-2">
            {demoByGender.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: `hsl(var(--chart-${i + 1}))` }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard className="lg:col-span-2" title="Por rango de edad" subtitle="users.age">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demoByAge} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="band" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtNum(v)} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="customers" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ChartCard className="lg:col-span-full" title="Recencia × Frecuencia" subtitle="Cada punto = cohorte agregada · tamaño = ticket promedio">
          <ResponsiveContainer width="100%" height={290}>
            <ScatterChart margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="recency" name="Recencia" unit="d" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="frequency" name="Frecuencia" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <ZAxis dataKey="size" range={[40, 280]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={rfScatter} fill="hsl(var(--chart-1))" fillOpacity={0.55} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-full" title="Funnel de tráfico" description="Visitas → vistas de producto → carrito → compra">
          <div className="overflow-x-auto -mx-5">
            <table className="data-grid">
              <thead>
                <tr>
                  <th>Traffic source</th>
                  <th className="text-right">Visitas</th>
                  <th className="text-right">Product views</th>
                  <th className="text-right">Add to cart</th>
                  <th className="text-right">Purchases</th>
                  <th className="text-right">Conv.</th>
                </tr>
              </thead>
              <tbody>
                {trafficFunnel.map((t) => {
                  const conv = (t.purchases / t.visits) * 100;
                  return (
                    <tr key={t.source}>
                      <td className="font-medium">{t.source}</td>
                      <td className="text-right">{fmtNumber(t.visits)}</td>
                      <td className="text-right">{fmtNumber(t.productViews)}</td>
                      <td className="text-right">{fmtNumber(t.addToCart)}</td>
                      <td className="text-right">{fmtNumber(t.purchases)}</td>
                      <td className="text-right"><span className="chip">{conv.toFixed(2)}%</span></td>
                    </tr>
                  );
                })}
                <tr className="font-medium bg-muted/40">
                  <td>Total</td>
                  <td className="text-right">{fmtNumber(totalAggrViews)}</td>
                  <td className="text-right">—</td>
                  <td className="text-right">—</td>
                  <td className="text-right">{fmtNumber(totalAggrPurchases)}</td>
                  <td className="text-right">{((totalAggrPurchases / totalAggrViews) * 100).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <FindingCard
          icon={<Crown className="h-4 w-4 text-warning" />}
          title="Segmento de mayor valor"
          body="Mujeres 25-44 en US, ticket promedio $182 y frecuencia ≥ 3. Representan ~14% de clientes y 31% de ventas."
        />
        <FindingCard
          icon={<TrendingDown className="h-4 w-4 text-destructive" />}
          title="Segmento con menor frecuencia"
          body="Hombres 45-64 con 1 sola orden y recencia > 120 días. Buen candidato para campaña de reactivación."
        />
        <FindingCard
          icon={<MapPin className="h-4 w-4 text-primary" />}
          title="Concentración geográfica"
          body={`${demoByCountry[0].country}, ${demoByCountry[1].country} y ${demoByCountry[2].country} concentran el 73% de los clientes.`}
        />
      </div>
    </div>
  );
}

function FindingCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="panel p-5">
      <div className="flex items-start gap-2 mb-1.5">
        {icon}
        <div className="font-semibold text-sm">{title}</div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
