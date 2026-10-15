/**
 * Formatea un número como moneda colombiana (COP).
 * Usa puntos como separadores de miles: $1.250.000
 * Los números negativos se formatean como: -$504.000
 */
export function formatCOP(amount: number): string {
  const rounded = Math.round(amount || 0);
  if (rounded < 0) {
    return `-$${new Intl.NumberFormat("es-CO").format(Math.abs(rounded))}`;
  }
  return `$${new Intl.NumberFormat("es-CO").format(rounded)}`;
}

/**
 * Formatea un número con puntos de miles, sin símbolo de moneda.
 * Ej: 1.250.000
 */
export function formatNum(value: number): string {
  return new Intl.NumberFormat("es-CO").format(Math.round(value || 0));
}

/**
 * Versión compacta para ejes de gráficas (K / M).
 * Ej: $1.2M, $850K  - con puntos internos también
 */
export function formatCOPCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    return `${sign}$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 }).format(abs / 1_000_000)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(abs / 1_000)}K`;
  }
  return formatCOP(value);
}
