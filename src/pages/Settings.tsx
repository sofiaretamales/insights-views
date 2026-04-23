import { useState } from "react";
import { Bell, Database, KeyRound, Loader2, LogOut, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Panel } from "@/components/ui-extra/Panel";
import { SectionHeader } from "@/components/ui-extra/SectionHeader";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const PREFS_KEY = "insights.prefs";

type Prefs = {
  emailWeekly: boolean;
  emailAlerts: boolean;
  productNews: boolean;
  darkMode: boolean;
};

const defaultPrefs: Prefs = {
  emailWeekly: true,
  emailAlerts: true,
  productNews: false,
  darkMode: false,
};

const loadPrefs = (): Prefs => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {}
  return defaultPrefs;
};

export default function Settings() {
  const { user, changePassword, signOut } = useAuth();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs());
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const updatePref = <K extends keyof Prefs>(k: K, v: Prefs[K]) => {
    const nextPrefs = { ...prefs, [k]: v };
    setPrefs(nextPrefs);
    localStorage.setItem(PREFS_KEY, JSON.stringify(nextPrefs));
  };

  const onChangePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await changePassword(current, next);
      toast.success("Contraseña actualizada");
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    signOut();
    toast.success("Sesión cerrada");
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Configuración"
        subtitle="Preferencias de cuenta, notificaciones y seguridad."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Notificaciones</h3>
          </div>
          <div className="space-y-4">
            <ToggleRow
              title="Resumen semanal"
              description="Cada lunes recibirás KPIs clave de tu marca."
              checked={prefs.emailWeekly}
              onChange={(v) => updatePref("emailWeekly", v)}
            />
            <ToggleRow
              title="Alertas de catálogo y ventas"
              description="Notificaciones cuando una métrica se aleje del rango esperado."
              checked={prefs.emailAlerts}
              onChange={(v) => updatePref("emailAlerts", v)}
            />
            <ToggleRow
              title="Novedades de producto"
              description="Nuevas vistas, integraciones y mejoras de IA."
              checked={prefs.productNews}
              onChange={(v) => updatePref("productNews", v)}
            />
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Apariencia</h3>
          </div>
          <ToggleRow
            title="Modo oscuro"
            description="Cambia el tema de la interfaz (demo)."
            checked={prefs.darkMode}
            onChange={(v) => {
              updatePref("darkMode", v);
              document.documentElement.classList.toggle("dark", v);
            }}
          />

          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Datos y privacidad</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Tu cuenta accede solo a datos de la marca <span className="text-foreground font-medium">{user.brand}</span>.</li>
              <li>• No se almacena PII de compradores en esta plataforma.</li>
              <li>• Datos provistos por TheLook eCommerce sobre BigQuery.</li>
            </ul>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Seguridad</h3>
          </div>
          <form onSubmit={onChangePwd} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="cur">Contraseña actual</Label>
              <Input id="cur" type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new">Nueva contraseña</Label>
              <Input id="new" type="password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="con">Confirmar</Label>
              <Input id="con" type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Cambiar contraseña
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Cerrar sesión en este dispositivo</div>
              <div className="text-xs text-muted-foreground">Volverás a la pantalla de inicio de sesión.</div>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-1.5">
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ToggleRow({
  title, description, checked, onChange,
}: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
