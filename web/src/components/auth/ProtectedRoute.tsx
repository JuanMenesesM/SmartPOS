import { Navigate } from "react-router-dom";
import { isAuthenticated, getUsuario } from "@/services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUsuario();
  if (user && user.rolId !== 1 && user.licenciaActiva === false) {
    return <Navigate to="/licencia-bloqueada" replace />;
  }

  return <>{children}</>;
}
