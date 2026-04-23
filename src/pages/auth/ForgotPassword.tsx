import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success("Enlace generado", {
        description: "En la demo, continúa directamente al formulario de reseteo.",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecerla."
      footer={<><Link to="/login" className="text-primary hover:underline font-medium">Volver a iniciar sesión</Link></>}
    >
      {sent ? (
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-muted/40 p-4 flex gap-3">
            <MailCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-foreground">Enlace enviado a {email}</div>
              <p className="text-muted-foreground mt-1">
                Revisa tu correo. En esta demo el enlace queda activo en el navegador.
              </p>
            </div>
          </div>
          <Button className="w-full h-10" onClick={() => navigate("/reset-password")}>
            Continuar a restablecer contraseña
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo corporativo</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@marca.com" />
          </div>
          <Button type="submit" className="w-full h-10" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Enviar enlace
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
