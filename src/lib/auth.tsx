import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CURRENT_BRAND } from "./mock";

export type Role = "Brand Manager" | "Analista" | "Admin";

export type AuthUser = {
  id?: string;
  name: string;
  fullName?: string;
  email: string;
  role: Role;
  brand: string;
  initials: string;
  avatarInitials?: string;
  createdAt?: string;
};

type StoredAccount = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  brand: string;
  role: "Brand Manager" | "Analista" | "Admin";
  avatarInitials: string;
  createdAt: string;
};

type UpdateProfilePatch = Partial<Pick<StoredAccount, "fullName" | "brand" | "role">>;
type UpdateUserPatch = Partial<AuthUser>;

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;

  signup: (name: string, email: string, password: string, brand: string) => Promise<void>;
  signUp: (input: { email: string; password: string; fullName: string; brand: string }) => Promise<void>;

  logout: () => void;
  signOut: () => void;

  updateUser: (patch: UpdateUserPatch) => void;
  updateProfile: (patch: UpdateProfilePatch) => Promise<void>;

  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const ACCOUNTS_KEY = "insights.accounts";
const SESSION_KEY = "insights.session";
const RESET_KEY = "insights.reset";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "U";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const toAuthUser = (acc: StoredAccount): AuthUser => ({
  id: acc.id,
  name: acc.fullName,
  fullName: acc.fullName,
  email: acc.email,
  role: acc.role,
  brand: acc.brand,
  initials: acc.avatarInitials,
  avatarInitials: acc.avatarInitials,
  createdAt: acc.createdAt,
});

const loadAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  const seed: StoredAccount[] = [
    {
      id: "demo-1",
      email: "marina@calvinklein.com",
      password: "demo1234",
      fullName: "Marina Rivas",
      brand: CURRENT_BRAND,
      role: "Brand Manager",
      avatarInitials: "MR",
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seed));
  return seed;
};

const saveAccounts = (accs: StoredAccount[]) => {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accs));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persistSession = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    await wait(400);
    const accs = loadAccounts();
    const acc = accs.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (!acc) throw new Error("No existe una cuenta con ese correo.");
    if (acc.password !== password) throw new Error("Contraseña incorrecta.");

    persistSession(toAuthUser(acc));
  };

  const login: AuthCtx["login"] = async (email, password) => {
    await signIn(email, password);
  };

  const signUp: AuthCtx["signUp"] = async ({ email, password, fullName, brand }) => {
    await wait(500);
    const accs = loadAccounts();

    if (accs.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Ya existe una cuenta con ese correo.");
    }

    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    const acc: StoredAccount = {
      id: `u-${Date.now()}`,
      email,
      password,
      fullName,
      brand,
      role: "Brand Manager",
      avatarInitials: initials(fullName),
      createdAt: new Date().toISOString(),
    };

    accs.push(acc);
    saveAccounts(accs);
    persistSession(toAuthUser(acc));
  };

  const signup: AuthCtx["signup"] = async (name, email, password, brand) => {
    await signUp({ fullName: name, email, password, brand });
  };

  const signOut = () => persistSession(null);
  const logout = () => signOut();

  const updateProfile: AuthCtx["updateProfile"] = async (patch) => {
    await wait(300);
    if (!user?.id) throw new Error("No autenticado.");

    const accs = loadAccounts();
    const idx = accs.findIndex((a) => a.id === user.id);

    if (idx < 0) throw new Error("Cuenta no encontrada.");

    const nextFullName = patch.fullName ?? accs[idx].fullName;

    const next: StoredAccount = {
      ...accs[idx],
      ...patch,
      fullName: nextFullName,
      avatarInitials: initials(nextFullName),
    };

    accs[idx] = next;
    saveAccounts(accs);
    persistSession(toAuthUser(next));
  };

  const updateUser: AuthCtx["updateUser"] = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;

      const mergedName = patch.name ?? patch.fullName ?? prev.name;
      const next: AuthUser = {
        ...prev,
        ...patch,
        name: mergedName,
        fullName: patch.fullName ?? prev.fullName ?? mergedName,
        initials: patch.name || patch.fullName ? initials(mergedName) : prev.initials,
        avatarInitials: patch.name || patch.fullName ? initials(mergedName) : prev.avatarInitials ?? prev.initials,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(next));

      if (next.id) {
        const accs = loadAccounts();
        const idx = accs.findIndex((a) => a.id === next.id);
        if (idx >= 0) {
          accs[idx] = {
            ...accs[idx],
            fullName: next.fullName ?? next.name,
            brand: next.brand,
            role: next.role as StoredAccount["role"],
            avatarInitials: next.avatarInitials ?? next.initials,
          };
          saveAccounts(accs);
        }
      }

      return next;
    });
  };

  const requestPasswordReset: AuthCtx["requestPasswordReset"] = async (email) => {
    await wait(400);
    const accs = loadAccounts();
    const acc = accs.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (!acc) throw new Error("No encontramos una cuenta con ese correo.");

    localStorage.setItem(
      RESET_KEY,
      JSON.stringify({
        email: acc.email,
        ts: Date.now(),
      })
    );
  };

  const resetPassword: AuthCtx["resetPassword"] = async (newPassword) => {
    await wait(400);
    const raw = localStorage.getItem(RESET_KEY);

    if (!raw) throw new Error("Enlace de recuperación inválido o expirado.");
    if (newPassword.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    const { email } = JSON.parse(raw) as { email: string; ts: number };
    const accs = loadAccounts();
    const idx = accs.findIndex((a) => a.email.toLowerCase() === email.toLowerCase());

    if (idx < 0) throw new Error("Cuenta no encontrada.");

    accs[idx].password = newPassword;
    saveAccounts(accs);
    localStorage.removeItem(RESET_KEY);
  };

  const changePassword: AuthCtx["changePassword"] = async (current, nextPwd) => {
    await wait(300);
    if (!user?.id) throw new Error("No autenticado.");

    const accs = loadAccounts();
    const idx = accs.findIndex((a) => a.id === user.id);

    if (idx < 0) throw new Error("Cuenta no encontrada.");
    if (accs[idx].password !== current) throw new Error("La contraseña actual no coincide.");
    if (nextPwd.length < 8) {
      throw new Error("La nueva contraseña debe tener al menos 8 caracteres.");
    }

    accs[idx].password = nextPwd;
    saveAccounts(accs);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        login,
        signIn,
        signup,
        signUp,
        logout,
        signOut,
        updateUser,
        updateProfile,
        requestPasswordReset,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  return <>{children}</>;
}