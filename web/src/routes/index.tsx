import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SuperAdminRoute from "@/components/auth/SuperAdminRoute";

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const LoginPage            = lazy(() => import("@/pages/Login"));
const DashboardPage        = lazy(() => import("@/pages/Dashboard"));
const ProductosPage        = lazy(() => import("@/pages/Productos"));
const VentasPage           = lazy(() => import("@/pages/Ventas"));
const MesaPOSPage          = lazy(() => import("@/pages/Ventas/MesaPOSPage"));
const ComprasPage          = lazy(() => import("@/pages/Compras"));
const KardexPage           = lazy(() => import("@/pages/Kardex"));
const AuditoriaPage        = lazy(() => import("@/pages/Auditoria"));
const EmpresaPage          = lazy(() => import("@/pages/Empresa"));
const ConfiguracionPage    = lazy(() => import("@/pages/Configuracion"));
const AdminDashboardPage   = lazy(() => import("@/pages/AdminDashboard"));
const LicenciaBloqueadaPage = lazy(() => import("@/pages/LicenciaBloqueada"));

// ── Fallback spinner ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center py-32">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-medium">Cargando…</span>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Página de login - sin layout */}
          <Route path="/login" element={<LoginPage />} />

          {/* Licencia bloqueada - sin layout */}
          <Route path="/licencia-bloqueada" element={<LicenciaBloqueadaPage />} />

          {/* Panel Maestro — Solo Super Admin (rolId=1), con su propio layout */}
          <Route
            path="/admin"
            element={
              <SuperAdminRoute>
                <MainLayout />
              </SuperAdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
          </Route>

          {/* Páginas protegidas - con MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"         element={<DashboardPage />}     />
            <Route path="/productos"         element={<ProductosPage />}     />
            <Route path="/ventas"            element={<VentasPage />}        />
            <Route path="/ventas/mesa/:mesaId" element={<MesaPOSPage />}      />
            <Route path="/compras"           element={<ComprasPage />}       />
            <Route path="/kardex"        element={<KardexPage />}        />
            <Route path="/auditoria"     element={<AuditoriaPage />}     />
            <Route path="/empresa"       element={<EmpresaPage />}       />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Route>

          {/* Ruta fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
