import PDFDocument from "pdfkit";
import { FacturaVentaDTO } from "./factura.dto";

// ── Paleta de colores profesionales (Slate & Indigo) ──────────────────────────
const PRIMARY_COLOR  = "#4F46E5"; // Indigo 600
const PRIMARY_LIGHT  = "#EEF2FF"; // Indigo 50
const TEXT_DARK      = "#0F172A"; // Slate 900
const TEXT_MUTED     = "#64748B"; // Slate 500
const TEXT_SUBTLE    = "#94A3B8"; // Slate 400
const BORDER_COLOR   = "#E2E8F0"; // Slate 200
const BG_CARD        = "#F8FAFC"; // Slate 50
const BG_HEADER_TBL  = "#F1F5F9"; // Slate 100
const BADGE_GREEN_BG = "#ECFDF5"; // Emerald 50
const BADGE_GREEN_TX = "#059669"; // Emerald 600
const BADGE_GREEN_BD = "#A7F3D0"; // Emerald 200
const WHITE          = "#FFFFFF";

// ── Helpers de formato ────────────────────────────────────────────────────────
const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatDateLong = (date: Date): string => {
    return date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const PAGE_W  = 595.28; // Ancho A4
const MARGIN  = 42;
const CONTENT = PAGE_W - MARGIN * 2; // 511.28

export const generarFacturaVenta = async (factura: FacturaVentaDTO): Promise<Buffer> => {
    let logoBuffer: Buffer | null = null;
    if (factura.empresa.logo) {
        try {
            const res = await fetch(factura.empresa.logo);
            const arrayBuffer = await res.arrayBuffer();
            logoBuffer = Buffer.from(arrayBuffer);
        } catch {
            // Si no se puede descargar el logo, continuamos con diseño tipográfico
        }
    }

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: MARGIN,
                size: "A4",
                info: {
                    Title: `Factura ${factura.venta.numeroFactura}`,
                    Author: factura.empresa.nombre || "SmartPOS",
                    Subject: "Comprobante de Venta POS",
                },
            });

            const buffers: Buffer[] = [];
            doc.on("data", (c) => buffers.push(c));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // ── 0. BARRA SUPERIOR DECORATIVA ───────────────────────────────
            doc.rect(0, 0, PAGE_W, 6).fill(PRIMARY_COLOR);

            // ── 1. CABECERA PRINCIPAL ──────────────────────────────────────
            const startY = 38;
            const LOGO_SIZE = 46;
            let currentX = MARGIN;

            // Renderizado de Logo o Icono de Empresa
            if (logoBuffer) {
                doc.image(logoBuffer, MARGIN, startY, {
                    fit: [LOGO_SIZE, LOGO_SIZE],
                });
                currentX = MARGIN + LOGO_SIZE + 14;
            }

            // Datos de la Empresa (Izquierda)
            const nombreEmpresa = (factura.empresa.nombre || "SmartPOS Comercio").toUpperCase();
            doc.font("Helvetica-Bold")
               .fontSize(16)
               .fillColor(TEXT_DARK)
               .text(nombreEmpresa, currentX, startY, { width: 270 });

            let empInfoY = doc.y + 3;

            if (factura.empresa.nit) {
                doc.font("Helvetica-Bold")
                   .fontSize(8.5)
                   .fillColor(PRIMARY_COLOR)
                   .text(`NIT: ${factura.empresa.nit}`, currentX, empInfoY);
                empInfoY += 12;
            }

            doc.font("Helvetica")
               .fontSize(8)
               .fillColor(TEXT_MUTED);

            if (factura.empresa.mostrarDireccionFactura !== false && factura.empresa.direccion) {
                const ciudadStr = factura.empresa.ciudad ? ` - ${factura.empresa.ciudad}` : "";
                doc.text(`${factura.empresa.direccion}${ciudadStr}`, currentX, empInfoY, { width: 270 });
                empInfoY += 11;
            }

            if (factura.empresa.mostrarTelefonoFactura !== false && factura.empresa.telefono) {
                doc.text(`Tel: ${factura.empresa.telefono}${factura.empresa.correo ? `  ·  ${factura.empresa.correo}` : ""}`, currentX, empInfoY, { width: 270 });
            }

            // Datos de la Factura (Derecha)
            const rightBoxW = 190;
            const rightBoxX = MARGIN + CONTENT - rightBoxW;

            // Caja con fondo suave para el número de factura
            doc.roundedRect(rightBoxX, startY - 2, rightBoxW, 78, 8)
               .fillAndStroke(BG_CARD, BORDER_COLOR);

            doc.font("Helvetica-Bold")
               .fontSize(8)
               .fillColor(PRIMARY_COLOR)
               .text("FACTURA DE VENTA", rightBoxX + 12, startY + 8, { width: rightBoxW - 24, align: "right" });

            doc.font("Helvetica-Bold")
               .fontSize(14)
               .fillColor(TEXT_DARK)
               .text(factura.venta.numeroFactura, rightBoxX + 12, startY + 20, { width: rightBoxW - 24, align: "right" });

            doc.font("Helvetica")
               .fontSize(7.5)
               .fillColor(TEXT_MUTED)
               .text(
                   `${formatDateLong(factura.venta.fecha)} · ${formatTime(factura.venta.fecha)}`,
                   rightBoxX + 12,
                   startY + 38,
                   { width: rightBoxW - 24, align: "right" }
               );

            // Badge "PAGADO"
            const badgeW = 68;
            const badgeH = 16;
            const badgeX = rightBoxX + rightBoxW - badgeW - 12;
            const badgeY = startY + 52;

            doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 4)
               .fillAndStroke(BADGE_GREEN_BG, BADGE_GREEN_BD);

            doc.font("Helvetica-Bold")
               .fontSize(7.5)
               .fillColor(BADGE_GREEN_TX)
               .text("✓  PAGADO", badgeX, badgeY + 4, { width: badgeW, align: "center" });

            // ── 2. CARDS DE INFORMACIÓN (CLIENTE & VENDEDOR) ────────────────
            const infoY = 130;
            const colCardW = (CONTENT - 14) / 2; // 248.64 pt

            // Card Cliente
            doc.roundedRect(MARGIN, infoY, colCardW, 46, 6)
               .fillAndStroke(BG_CARD, BORDER_COLOR);

            doc.font("Helvetica-Bold")
               .fontSize(7)
               .fillColor(TEXT_SUBTLE)
               .text("CLIENTE / RECEPTOR", MARGIN + 12, infoY + 8);

            doc.font("Helvetica-Bold")
               .fontSize(10)
               .fillColor(TEXT_DARK)
               .text(factura.venta.cliente || "Consumidor Final", MARGIN + 12, infoY + 20, { width: colCardW - 24 });

            doc.font("Helvetica")
               .fontSize(7.5)
               .fillColor(TEXT_MUTED)
               .text("Venta en punto de atención", MARGIN + 12, infoY + 32);

            // Card Vendedor / Atendido por
            const card2X = MARGIN + colCardW + 14;
            doc.roundedRect(card2X, infoY, colCardW, 46, 6)
               .fillAndStroke(BG_CARD, BORDER_COLOR);

            doc.font("Helvetica-Bold")
               .fontSize(7)
               .fillColor(TEXT_SUBTLE)
               .text("ATENDIDO POR / CAJERO", card2X + 12, infoY + 8);

            doc.font("Helvetica-Bold")
               .fontSize(10)
               .fillColor(TEXT_DARK)
               .text(factura.venta.vendedor || "Personal de Turno", card2X + 12, infoY + 20, { width: colCardW - 24 });

            doc.font("Helvetica")
               .fontSize(7.5)
               .fillColor(TEXT_MUTED)
               .text("Terminal POS Principal", card2X + 12, infoY + 32);

            // ── 3. TABLA DE PRODUCTOS / SERVICIOS ──────────────────────────
            const tableTop = 190;
            const COL_CANT  = MARGIN + 10;
            const COL_DESC  = MARGIN + 55;
            const COL_UNIT  = MARGIN + CONTENT - 190;
            const COL_SUB   = MARGIN + CONTENT - 85;

            // Encabezado de la tabla con fondo
            doc.roundedRect(MARGIN, tableTop, CONTENT, 24, 6)
               .fill(BG_HEADER_TBL);

            doc.font("Helvetica-Bold")
               .fontSize(7.5)
               .fillColor(TEXT_MUTED);

            doc.text("CANT.", COL_CANT, tableTop + 8, { width: 35, align: "center" });
            doc.text("DESCRIPCIÓN DEL PRODUCTO", COL_DESC, tableTop + 8);
            doc.text("PRECIO UNITARIO", COL_UNIT, tableTop + 8, { width: 95, align: "right" });
            doc.text("SUBTOTAL", COL_SUB, tableTop + 8, { width: 75, align: "right" });

            // Filas de Items
            let rowY = tableTop + 30;
            let index = 0;

            for (const item of factura.detalles) {
                // Fondo alternado muy sutil
                if (index % 2 === 1) {
                    doc.rect(MARGIN, rowY - 4, CONTENT, 22).fill("#FAFAFA");
                }

                // Cantidad con badge
                doc.font("Helvetica-Bold")
                   .fontSize(8.5)
                   .fillColor(PRIMARY_COLOR)
                   .text(`${item.cantidad}`, COL_CANT, rowY + 2, { width: 35, align: "center" });

                // Nombre del producto
                doc.font("Helvetica-Bold")
                   .fontSize(8.5)
                   .fillColor(TEXT_DARK)
                   .text(item.producto, COL_DESC, rowY + 2, { width: COL_UNIT - COL_DESC - 10, lineBreak: false });

                // Precio unitario
                doc.font("Helvetica")
                   .fontSize(8.5)
                   .fillColor(TEXT_MUTED)
                   .text(formatMoney(item.precioUnitario), COL_UNIT, rowY + 2, { width: 95, align: "right" });

                // Subtotal
                doc.font("Helvetica-Bold")
                   .fontSize(8.5)
                   .fillColor(TEXT_DARK)
                   .text(formatMoney(item.subtotal), COL_SUB, rowY + 2, { width: 75, align: "right" });

                rowY += 22;

                // Línea separadora muy delgada
                doc.moveTo(MARGIN, rowY - 2)
                   .lineTo(MARGIN + CONTENT, rowY - 2)
                   .strokeColor(BORDER_COLOR)
                   .lineWidth(0.5)
                   .stroke();

                index++;
            }

            // ── 4. RESUMEN DE TOTALES Y NOTAS ──────────────────────────────
            const summaryY = Math.max(rowY + 14, 460);

            // Caja de Método de Pago y Notas (Izquierda)
            const leftBoxW = 240;
            doc.roundedRect(MARGIN, summaryY, leftBoxW, 76, 8)
               .fillAndStroke(BG_CARD, BORDER_COLOR);

            doc.font("Helvetica-Bold")
               .fontSize(7.5)
               .fillColor(TEXT_MUTED)
               .text("INFORMACIÓN DE PAGO", MARGIN + 12, summaryY + 10);

            doc.font("Helvetica")
               .fontSize(8)
               .fillColor(TEXT_DARK)
               .text(`Forma de Pago: ${factura.venta.metodoPago || "Efectivo / Contado"}`, MARGIN + 12, summaryY + 24);

            doc.text(`Moneda: Pesos Colombianos (${factura.totales.moneda})`, MARGIN + 12, summaryY + 37);

            doc.font("Helvetica-Oblique")
               .fontSize(7.5)
               .fillColor(PRIMARY_COLOR)
               .text("Documento soportado en sistema POS", MARGIN + 12, summaryY + 52);

            // Bloque de Totales (Derecha)
            const totBoxW = 230;
            const totBoxX = MARGIN + CONTENT - totBoxW;
            let currentTotY = summaryY;

            // Subtotal
            doc.font("Helvetica")
               .fontSize(8.5)
               .fillColor(TEXT_MUTED)
               .text("Subtotal:", totBoxX, currentTotY + 4, { width: 110, align: "right" });

            doc.font("Helvetica-Bold")
               .fontSize(8.5)
               .fillColor(TEXT_DARK)
               .text(formatMoney(factura.totales.subtotal), totBoxX + 120, currentTotY + 4, { width: 100, align: "right" });

            currentTotY += 16;

            // Descuentos si existen
            if (factura.totales.descuentos > 0) {
                doc.font("Helvetica")
                   .fontSize(8.5)
                   .fillColor(TEXT_MUTED)
                   .text("Descuento:", totBoxX, currentTotY + 4, { width: 110, align: "right" });

                doc.font("Helvetica-Bold")
                   .fontSize(8.5)
                   .fillColor("#DC2626")
                   .text(`- ${formatMoney(factura.totales.descuentos)}`, totBoxX + 120, currentTotY + 4, { width: 100, align: "right" });

                currentTotY += 16;
            }

            // Caja Hero "TOTAL A PAGAR"
            const heroBoxY = currentTotY + 6;
            const heroBoxH = 46;

            doc.roundedRect(totBoxX, heroBoxY, totBoxW, heroBoxH, 8)
               .fill(PRIMARY_COLOR);

            doc.font("Helvetica-Bold")
               .fontSize(8)
               .fillColor(PRIMARY_LIGHT)
               .text("TOTAL A PAGAR", totBoxX + 14, heroBoxY + 10);

            doc.font("Helvetica-Bold")
               .fontSize(16)
               .fillColor(WHITE)
               .text(formatMoney(factura.totales.total), totBoxX + 14, heroBoxY + 22, {
                   width: totBoxW - 28,
                   align: "right",
               });

            // ── 5. PIE DE PÁGINA Y MENSAJE DE AGRADECIMIENTO ───────────────
            const footerY = 740;

            // Mensaje de pie configurado por la empresa
            const mensajePie = factura.empresa.mensajePieFactura || "¡Gracias por su compra! Vuelva pronto.";
            doc.roundedRect(MARGIN, footerY, CONTENT, 32, 6)
               .fillAndStroke(PRIMARY_LIGHT, BORDER_COLOR);

            doc.font("Helvetica-Bold")
               .fontSize(8.5)
               .fillColor(PRIMARY_COLOR)
               .text(mensajePie, MARGIN, footerY + 10, { width: CONTENT, align: "center" });

            // Línea divisoria inferior
            const bottomLineY = footerY + 44;
            doc.moveTo(MARGIN, bottomLineY)
               .lineTo(MARGIN + CONTENT, bottomLineY)
               .strokeColor(BORDER_COLOR)
               .lineWidth(0.5)
               .stroke();

            // Legal y sello del sistema
            doc.font("Helvetica")
               .fontSize(7)
               .fillColor(TEXT_SUBTLE)
               .text(
                   "Comprobante fiscal para uso interno y del cliente · Emitido electrónicamente por SmartPOS",
                   MARGIN,
                   bottomLineY + 6,
                   { width: CONTENT, align: "center" }
               );

            // Barra inferior decorativa
            doc.rect(0, 836, PAGE_W, 6).fill(PRIMARY_COLOR);

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};