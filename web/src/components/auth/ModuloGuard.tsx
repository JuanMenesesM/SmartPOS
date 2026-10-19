import React from "react";
import { hasModule, ModulosConfig, isSuperAdmin } from "@/services/auth.service";
import ModuloInactivo from "@/components/common/ModuloInactivo";

interface ModuloGuardProps {
  modulo: keyof ModulosConfig;
  nombre: string;
  descripcion?: string;
  children: React.ReactNode;
}

export default function ModuloGuard({
  modulo,
  nombre,
  descripcion,
  children,
}: ModuloGuardProps) {
  // El Super Administrador (rolId = 1) puede previsualizar o acceder siempre
  // pero para los demás roles se valida la suscripción de la empresa.
  const tieneAcceso = hasModule(modulo);

  if (!tieneAcceso) {
    return (
      <ModuloInactivo
        nombre={nombre}
        descripcion={descripcion}
        moduloKey={modulo}
      />
    );
  }

  return <>{children}</>;
}
