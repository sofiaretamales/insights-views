import { useState } from "react";
import { PageHeader } from "@/components/ui-extra/PageHeader";
import { KpiCard } from "@/components/ui-extra/KpiCard";
import { catalogIssues, catalogProducts, catalogQualityScore } from "@/lib/mock";
import { fmtMoney, fmtPct } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, FileText, Tag, Box, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const stateBadge = {
  OK: "bg-success/10 text-success",
  Revisar: "bg-warning/10 text-warning",
  Acción: "bg-destructive/10 text-destructive",
} as const;

export default function Catalogo() {
  const [selected, setSelected] = useState<typeof catalogProducts[number] | null>(null);

  return (
    <div>
      <PageHeader
        title="Calidad de Catálogo"
        subtitle="Evaluación de productos de tu marca: completitud, pricing y desempeño comercial."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        <div className="kpi-card">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Score global</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="font-display text-3xl font-bold gradient-text">{catalogQualityScore}</div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${catalogQualityScore}%`, background: "var(--gradient-brand)" }} />
          </div>
        </div>
        <KpiCard label="Sin nombre claro" value={String(catalogIssues.missingName)} icon={<FileText className="h-4 w-4" />} hint="de 312 productos" />
        <KpiCard label="Sin SKU" value={String(catalogIssues.missingSku)} icon={<Tag className="h-4 w-4" />} />
        <KpiCard label="Bajo sell-through" value={String(catalogIssues.lowSellThrough)} icon={<Box className="h-4 w-4" />} hint="inventory_items" />
        <KpiCard label="Pricing inconsistente" value={String(catalogIssues.inconsistentCostRetail)} icon={<AlertTriangle className="h-4 w-4" />} hint="cost vs retail" />
      </div>

      <div className="panel">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h3 className="font-semibold text-sm">Productos · catálogo de la marca</h3>
            <p className="text-xs text-muted-foreground mt-0.5">products + inventory_items + order_items</p>
          </div>
          <span className="chip">Click un producto para ver detalle</span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Retail</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Quality</TableHead>
                <TableHead className="text-right">Sell-through</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acción sugerida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalogProducts.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelected(p)}>
                  <TableCell className="font-medium">
                    {p.name}
                    <div className="text-[11px] text-muted-foreground font-normal">{p.id}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtMoney(p.retail)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{fmtMoney(p.cost)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            p.score > 80 ? "bg-success" : p.score > 60 ? "bg-warning" : "bg-destructive"
                          )}
                          style={{ width: `${p.score}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-semibold text-xs">{p.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{fmtPct(p.sellThrough * 100, 0)}</TableCell>
                  <TableCell>
                    <span className={cn("text-xs font-semibold rounded-md px-2 py-0.5", stateBadge[p.state])}>{p.state}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.suggestion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="text-xs text-muted-foreground font-mono">{selected.id}</div>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.brand} · {selected.category} · {selected.department}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Stat label="Retail price" value={fmtMoney(selected.retail)} />
                <Stat label="Cost" value={fmtMoney(selected.cost)} />
                <Stat label="Quality score" value={String(selected.score)} />
                <Stat label="Sell-through" value={fmtPct(selected.sellThrough * 100, 0)} />
              </div>

              <div className="mt-6 rounded-lg border bg-primary-soft p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div className="text-sm font-semibold text-primary">Sugerencias IA</div>
                  <span className="chip ml-auto bg-card border-primary/20 text-primary">Revisar antes de aplicar</span>
                </div>
                <div className="space-y-3 text-sm">
                  <SuggestField
                    label="Mejor título"
                    value={`${selected.name} — ${selected.category} ${selected.department}, fit moderno`}
                  />
                  <SuggestField
                    label="Mejor descripción"
                    value={`${selected.category} de ${selected.brand}, diseño contemporáneo, materiales premium. Ideal para uso diario.`}
                  />
                  <SuggestField label="Recategorización" value={`${selected.category} › Subcategoría sugerida`} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Aplicar sugerencias
                  </Button>
                  <Button size="sm" variant="outline">
                    Descartar
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
      <div className="font-display font-bold text-lg mt-1">{value}</div>
    </div>
  );
}

function SuggestField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">{label}</div>
      <div className="text-sm bg-card border rounded-md px-3 py-2 leading-snug">{value}</div>
    </div>
  );
}
