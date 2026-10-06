import { Navigate } from "react-router-dom";
import { isAuthenticated, isSuperAdmin } from "@/services/auth.service";

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Guard for the /admin route — only accessible if rolId === 1 (Super Admin).
 */
export default function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isSuperAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
