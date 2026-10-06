/**
 * Formatea un número como moneda colombiana (COP).
 * Usa puntos como separadores de miles: $1.250.000
 */
export function formatCOP(amount: number): string {
  return `$${ new Intl.NumberFormat("es-CO").format(Math.round(amount)) }`;
}

/**
 * Formatea un número con puntos de miles, sin símbolo de moneda.
 * Ej: 1.250.000
 */
export function formatNum(value: number): string {
  return new Intl.NumberFormat("es-CO").format(Math.round(value));
}

/**
 * Versión compacta para ejes de gráficas (K / M).
 * Ej: $1.2M, $850K  — con puntos internos también
 */
export function formatCOPCompact(value: number): string {
  if (value >= 1_000_000)
    return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 }).format(value / 1_000_000)}M`;
  if (value >= 1_000)
    return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value / 1_000)}K`;
  return formatCOP(value);
}
