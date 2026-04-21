import { SectionHeader } from "@/components/ui-extra/SectionHeader";
import { Panel } from "@/components/ui-extra/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aiSegmentSuggestions, savedSegments, fmtNumber, fmtCurrency } from "@/lib/mockData";
import { Plus, X, Save, Sparkles, Edit3, Wand2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Rule { id: number; field: string; op: string; value: string; }

const fieldOptions = [
  { value: "category", label: "Categoría comprada" },
  { value: "frequency", label: "Frecuencia" },
  { value: "recency", label: "Recencia (días)" },
  { value: "aov", label: "Ticket promedio" },
  { value: "gender", label: "Género" },
  { value: "age_range", label: "Rango etario" },
  { value: "state", label: "Estado / país" },
  { value: "traffic_source", label: "Traffic source" },
];

const opOptions = [
  { value: "eq", label: "es igual a" },
  { value: "neq", label: "no es" },
  { value: "gt", label: "mayor a" },
  { value: "lt", label: "menor a" },
  { value: "in", label: "incluye" },
];

export default function Segmentation() {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, field: "category", op: "eq", value: "Outerwear & Coats" },
    { id: 2, field: "frequency", op: "gt", value: "2" },
    { id: 3, field: "aov", op: "gt", value: "180" },
  ]);
  const [name, setName] = useState("");

  const estimatedSize = Math.max(420, 12_400 - rules.length * 2_300);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Segmentación"
        subtitle="Construí segmentos manualmente o partí de propuestas IA basadas en mvSegmentBase. Las sugerencias son revisables y no reemplazan tu juicio."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Builder */}
        <Panel
          className="lg:col-span-2"
          title="Constructor de segmento"
          description="Definí condiciones combinadas con AND. El backend traduce las reglas a SQL contra mvSegmentBase."
          action={<span className="chip"><Wand2 className="h-3 w-3" /> visual builder</span>}
        >
          <div className="space-y-4">
            <Input
              placeholder="Nombre del segmento — ej. VIP Outerwear CA/NY"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-medium"
            />

            <div className="space-y-2">
              {rules.map((r, i) => (
                <div key={r.id} className="flex flex-wrap items-center gap-2 p-3 rounded-md border border-border bg-muted/20">
                  <span className="text-xs font-medium text-muted-foreground w-10">{i === 0 ? "Donde" : "Y"}</span>
                  <Select value={r.field} onValueChange={(v) => setRules(rules.map(x => x.id === r.id ? { ...x, field: v } : x))}>
                    <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{fieldOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={r.op} onValueChange={(v) => setRules(rules.map(x => x.id === r.id ? { ...x, op: v } : x))}>
                    <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{opOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input
                    value={r.value}
                    onChange={(e) => setRules(rules.map(x => x.id === r.id ? { ...x, value: e.target.value } : x))}
                    className="h-9 flex-1 min-w-[120px]"
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setRules(rules.filter(x => x.id !== r.id))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setRules([...rules, { id: Date.now(), field: "category", op: "eq", value: "" }])}
              >
                <Plus className="h-3.5 w-3.5" /> Agregar condición
              </Button>
            </div>

            {/* Preview */}
            <div className="rounded-lg border border-border bg-gradient-subtle p-4 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Tamaño estimado</div>
                <div className="text-3xl font-semibold tabular text-foreground mt-1">{fmtNumber(estimatedSize)}</div>
                <div className="text-xs text-muted-foreground mt-1">≈ {((estimatedSize / 18240) * 100).toFixed(1)}% de tu base activa</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5"><Edit3 className="h-3.5 w-3.5" /> Vista previa SQL</Button>
                <Button size="sm" className="gap-1.5" onClick={() => toast.success("Segmento guardado", { description: name || "Sin nombre" })}>
                  <Save className="h-3.5 w-3.5" /> Guardar segmento
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        {/* AI suggestions */}
        <Panel
          title="Propuestas IA"
          description="Hallazgos accionables sobre mvSegmentBase"
          action={<span className="chip"><Sparkles className="h-3 w-3 text-primary" /> IA</span>}
        >
          <div className="space-y-3">
            {aiSegmentSuggestions.map((s) => (
              <div key={s.name} className="ai-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-foreground">{s.name}</div>
                  <span className={
                    "chip " + (s.potential === "Alto" ? "text-success" : "text-primary")
                  }>{s.potential}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.reason}</p>
                <div className="mt-2 text-[11px] font-mono bg-background/60 rounded px-2 py-1.5 border border-border text-muted-foreground break-all">
                  {s.logic}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <Users className="h-3 w-3 inline mr-1" />
                    <span className="tabular font-medium text-foreground">{fmtNumber(s.size)}</span> · AOV {fmtCurrency(s.aov)}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1"
                    onClick={() => toast.success("Sugerencia cargada en el constructor", { description: s.name })}
                  >
                    Usar sugerencia
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Saved segments */}
      <Panel title="Segmentos guardados" description="Listos para activar en la herramienta de tu elección">
        <div className="overflow-x-auto -mx-5">
          <table className="data-grid">
            <thead>
              <tr>
                <th>Segmento</th>
                <th>Reglas</th>
                <th className="text-right">Tamaño</th>
                <th className="text-right">AOV</th>
                <th>Actualizado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {savedSegments.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-muted-foreground">{s.criteria}</td>
                  <td className="text-right">{fmtNumber(s.size)}</td>
                  <td className="text-right">{s.aov ? fmtCurrency(s.aov) : "—"}</td>
                  <td className="text-muted-foreground">{s.updated}</td>
                  <td className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Editar</Button>
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
