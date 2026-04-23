import { useState } from "react";
import { Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel } from "@/components/ui-extra/Panel";
import { SectionHeader } from "@/components/ui-extra/SectionHeader";
import { useAuth, AuthUser, Role } from "@/lib/auth";
import { brandOptions, CURRENT_RETAILER } from "@/lib/mockData";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [brand, setBrand] = useState(user?.brand ?? brandOptions[0]);
  const [role, setRole] = useState<Role>(user?.role ?? "Brand Manager");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ fullName, brand, role });
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Perfil"
        subtitle="Información personal y marca asignada dentro del retailer."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-1">
          <div className="flex flex-col items-center text-center py-2">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 font-semibold text-lg">{user.fullName ?? user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded bg-primary/10 text-primary">
              <ShieldCheck className="h-3 w-3" /> {user.role}
            </div>
            <div className="mt-4 w-full pt-4 border-t border-border text-left space-y-2">
              <Row label="Marca" value={user.brand} />
              <Row label="Retailer" value={CURRENT_RETAILER} />
              <Row label="ID de cuenta" value={user.id ?? "—"} mono />
              <Row label="Alta" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} />
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Datos del perfil</h3>
          </div>
          <form onSubmit={onSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Marca asignada</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {brandOptions.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Rol</Label>
                <Select value={role} onValueChange={(v) => setRole(v as AuthUser["role"])}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brand Manager">Brand Manager</SelectItem>
                    <SelectItem value="Analista">Analista</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar cambios
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-[11px]" : "font-medium"}>{value}</span>
    </div>
  );
}