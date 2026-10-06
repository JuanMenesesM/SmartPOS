import { useQuery } from "@tanstack/react-query";
import { getUsuarios } from "@/services/usuarios.service";

export function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
    staleTime: 60_000,
  });
}
