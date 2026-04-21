import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import AudiencesDashboard from "./pages/AudiencesDashboard";
import Segmentation from "./pages/Segmentation";
import CatalogQuality from "./pages/CatalogQuality";
import CompetitivePosition from "./pages/CompetitivePosition";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ExecutiveDashboard />} />
            <Route path="/ventas" element={<SalesDashboard />} />
            <Route path="/audiencias" element={<AudiencesDashboard />} />
            <Route path="/segmentacion" element={<Segmentation />} />
            <Route path="/catalogo" element={<CatalogQuality />} />
            <Route path="/competencia" element={<CompetitivePosition />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
