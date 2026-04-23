import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import AudiencesDashboard from "./pages/AudiencesDashboard";
import Segmentation from "./pages/Segmentation";
import CatalogQuality from "./pages/CatalogQuality";
import CompetitivePosition from "./pages/CompetitivePosition";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected app routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<ExecutiveDashboard />} />
              <Route path="/ventas" element={<SalesDashboard />} />
              <Route path="/audiencias" element={<AudiencesDashboard />} />
              <Route path="/segmentacion" element={<Segmentation />} />
              <Route path="/catalogo" element={<CatalogQuality />} />
              <Route path="/competencia" element={<CompetitivePosition />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/configuracion" element={<SettingsPage />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
