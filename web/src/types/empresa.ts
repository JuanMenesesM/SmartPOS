export interface EmpresaConfiguracion {
  // 2. Información Comercial
  moneda: string;
  simboloMoneda: string;
  zonaHoraria: string;
  formatoFecha: string;
  formatoHora: string;

  // 3. Facturación
  prefijoFacturas: string;
  numeroInicialFacturas: string;
  mensajePieFactura: string;
  mostrarLogoFactura: boolean;
  mostrarDireccionFactura: boolean;
  mostrarTelefonoFactura: boolean;

  // 4. Impuestos
  iva: string;
  porcentajeIva: string;
  aplicarImpuestos: boolean;

  // 5. Inventario
  stockMinimoDefecto: string;
  permitirStockNegativo: boolean;
  alertarStockBajo: boolean;

  // 6. Ventas
  abrirVentaAutomaticamente: boolean;
  imprimirFacturaAutomaticamente: boolean;
  solicitarConfirmacionCobro: boolean;
}

export interface Empresa {
  id: number;
  nombre: string;
  nit: string | null;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  logo: string | null;
  ciudad: string | null;
  configuracion: EmpresaConfiguracion | null;
  activo: boolean;
}
