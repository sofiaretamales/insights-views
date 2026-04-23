import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { brandOptions } from "@/lib/mockData";
import { toast } from "sonner";

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState(brandOptions[0]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp({ fullName, email, brand, password });
      toast.success("Cuenta creada", { description: "Bienvenido a Insights." });
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error con Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Configura el acceso de tu marca al panel Insights."
      footer={<>¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline font-medium">Iniciar sesión</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <GoogleButton onClick={onGoogle} disabled={loading} label="Registrarse con Google" />

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-background px-2 text-muted-foreground">o con correo</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Marina Rivas" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Correo corporativo</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@marca.com" />
        </div>

        <div className="space-y-1.5">
          <Label>Marca asignada</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {brandOptions.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">Aísla tus datos a esta marca dentro de TheLook.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
        </div>

        <Button type="submit" className="w-full h-10" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Crear cuenta
        </Button>

        <p className="text-[11px] text-muted-foreground text-center">
          Al continuar aceptas la política de uso de datos (demo).
        </p>
      </form>
    </AuthShell>
  );
}
