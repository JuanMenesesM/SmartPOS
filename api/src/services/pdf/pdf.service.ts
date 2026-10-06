import PDFDocument from "pdfkit";
import { FacturaVentaDTO } from "./factura.dto";

// ── Paleta de colores profesionales para ticket POS ───────────────────────────
const PRIMARY_COLOR  = "#4F46E5"; // Indigo 600
const PRIMARY_LIGHT  = "#EEF2FF"; // Indigo 50
const TEXT_DARK      = "#0F172A"; // Slate 900
const TEXT_MUTED     = "#64748B"; // Slate 500
const TEXT_SUBTLE    = "#94A3B8"; // Slate 400
const BORDER_COLOR   = "#E2E8F0"; // Slate 200
const BG_CARD        = "#F8FAFC"; // Slate 50
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

const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTimeShort = (date: Date): string => {
    return date.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

// ── Dimensiones del Ticket POS (80mm = ~226.77 pt) ──────────────────────────
const PAGE_W = 226.77; 
const MARGIN = 12;
const CONTENT = PAGE_W - MARGIN * 2; // 202.77 pt

export const generarFacturaVenta = async (factura: FacturaVentaDTO): Promise<Buffer> => {
    let logoBuffer: Buffer | null = null;
    if (factura.empresa.logo) {
        try {
            const res = await fetch(factura.empresa.logo);
            const arrayBuffer = await res.arrayBuffer();
            logoBuffer = Buffer.from(arrayBuffer);
        } catch {
            // Continuar con tipografía en caso de error
        }
    }

    // Cálculo dinámico de altura para que el comprobante sea compacto y sin hoja vacía
    const baseHeight = 250;
    const itemsHeight = factura.detalles.length * 22;
    const dynamicHeight = Math.max(340, baseHeight + itemsHeight);

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: MARGIN,
                size: [PAGE_W, dynamicHeight],
                info: {
                    Title: `Ticket ${factura.venta.numeroFactura}`,
                    Author: factura.empresa.nombre || "SmartPOS",
                    Subject: "Comprobante POS Compacto",
                },
            });

            const buffers: Buffer[] = [];
            doc.on("data", (c) => buffers.push(c));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // ── 0. BARRA SUPERIOR DECORATIVA ───────────────────────────────
            doc.rect(0, 0, PAGE_W, 4).fill(PRIMARY_COLOR);

            // ── 1. CABECERA DE LA EMPRESA ──────────────────────────────────
            let currentY = 14;

            if (logoBuffer) {
                doc.image(logoBuffer, (PAGE_W - 32) / 2, currentY, { fit: [32, 32] });
                currentY += 36;
            }

            // Nombre Empresa (Centrado)
            const nombreEmpresa = (factura.empresa.nombre || "SmartPOS").toUpperCase();
            doc.font("Helvetica-Bold")
               .fontSize(11)
               .fillColor(TEXT_DARK)
               .text(nombreEmpresa, MARGIN, currentY, { width: CONTENT, align: "center" });

            currentY = doc.y + 2;

            // NIT
            if (factura.empresa.nit) {
                doc.font("Helvetica-Bold")
                   .fontSize(7.5)
                   .fillColor(PRIMARY_COLOR)
                   .text(`NIT: ${factura.empresa.nit}`, MARGIN, currentY, { width: CONTENT, align: "center" });
                currentY = doc.y + 2;
            }

            // Dirección y Teléfono
            doc.font("Helvetica")
               .fontSize(7)
               .fillColor(TEXT_MUTED);

            if (factura.empresa.mostrarDireccionFactura !== false && factura.empresa.direccion) {
                const ciudadStr = factura.empresa.ciudad ? ` (${factura.empresa.ciudad})` : "";
                doc.text(`${factura.empresa.direccion}${ciudadStr}`, MARGIN, currentY, { width: CONTENT, align: "center" });
                currentY = doc.y + 1;
            }

            if (factura.empresa.mostrarTelefonoFactura !== false && factura.empresa.telefono) {
                doc.text(`Tel: ${factura.empresa.telefono}`, MARGIN, currentY, { width: CONTENT, align: "center" });
                currentY = doc.y + 4;
            } else {
                currentY += 4;
            }

            // Línea divisoria punteada
            doc.moveTo(MARGIN, currentY)
               .lineTo(MARGIN + CONTENT, currentY)
               .strokeColor(BORDER_COLOR)
               .lineWidth(0.8)
               .dash(3, { space: 2 })
               .stroke();
            doc.undash();

            currentY += 6;

            // ── 2. METADATOS DEL COMPROBANTE ───────────────────────────────
            // Factura # y Badge PAGADO en una sola línea
            doc.font("Helvetica-Bold")
               .fontSize(9)
               .fillColor(TEXT_DARK)
               .text(factura.venta.numeroFactura, MARGIN, currentY);

            // Badge Pagado
            const badgeW = 48;
            const badgeH = 12;
            const badgeX = MARGIN + CONTENT - badgeW;
            const badgeY = currentY - 1;

            doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 3)
               .fillAndStroke(BADGE_GREEN_BG, BADGE_GREEN_BD);

            doc.font("Helvetica-Bold")
               .fontSize(6)
               .fillColor(BADGE_GREEN_TX)
               .text("PAGADO", badgeX, badgeY + 2.5, { width: badgeW, align: "center" });

            currentY += 13;

            // Fecha y Hora
            doc.font("Helvetica")
               .fontSize(7)
               .fillColor(TEXT_MUTED)
               .text(`Fecha: ${formatDateShort(factura.venta.fecha)}  ${formatTimeShort(factura.venta.fecha)}`, MARGIN, currentY);

            currentY += 9;

            // Atendido por y Cliente
            doc.text(`Atendido por: ${factura.venta.vendedor || "Cajero"}`, MARGIN, currentY);
            currentY += 9;

            doc.text(`Cliente: ${factura.venta.cliente || "Consumidor Final"}`, MARGIN, currentY);
            currentY += 10;

            // ── 3. TABLA COMPACTA DE ITEMS ─────────────────────────────────
            // Cabecera
            doc.roundedRect(MARGIN, currentY, CONTENT, 14, 4)
               .fill(PRIMARY_LIGHT);

            doc.font("Helvetica-Bold")
               .fontSize(6.5)
               .fillColor(PRIMARY_COLOR);

            doc.text("CANT", MARGIN + 4, currentY + 3.5, { width: 22, align: "left" });
            doc.text("DESCRIPCIÓN", MARGIN + 30, currentY + 3.5, { width: 95, align: "left" });
            doc.text("TOTAL", MARGIN + CONTENT - 54, currentY + 3.5, { width: 50, align: "right" });

            currentY += 17;

            // Filas
            for (const item of factura.detalles) {
                // Cantidad
                doc.font("Helvetica-Bold")
                   .fontSize(7.5)
                   .fillColor(PRIMARY_COLOR)
                   .text(`${item.cantidad}x`, MARGIN + 4, currentY, { width: 22 });

                // Nombre del producto
                doc.font("Helvetica-Bold")
                   .fontSize(7.5)
                   .fillColor(TEXT_DARK)
                   .text(item.producto, MARGIN + 30, currentY, { width: 95, lineBreak: false });

                // Subtotal
                doc.font("Helvetica-Bold")
                   .fontSize(7.5)
                   .fillColor(TEXT_DARK)
                   .text(formatMoney(item.subtotal), MARGIN + CONTENT - 54, currentY, { width: 50, align: "right" });

                currentY += 10;

                // Precio unitario abajo sutil
                doc.font("Helvetica")
                   .fontSize(6)
                   .fillColor(TEXT_SUBTLE)
                   .text(`@ ${formatMoney(item.precioUnitario)} c/u`, MARGIN + 30, currentY);

                currentY += 10;

                // Línea divisoria muy suave entre items
                doc.moveTo(MARGIN, currentY - 1)
                   .lineTo(MARGIN + CONTENT, currentY - 1)
                   .strokeColor(BORDER_COLOR)
                   .lineWidth(0.4)
                   .stroke();
            }

            currentY += 4;

            // ── 4. RESUMEN DE TOTALES ──────────────────────────────────────
            // Subtotal
            doc.font("Helvetica")
               .fontSize(7.5)
               .fillColor(TEXT_MUTED)
               .text("Subtotal:", MARGIN + 4, currentY);

            doc.font("Helvetica-Bold")
               .fontSize(7.5)
               .fillColor(TEXT_DARK)
               .text(formatMoney(factura.totales.subtotal), MARGIN + CONTENT - 70, currentY, { width: 66, align: "right" });

            currentY += 11;

            // Descuentos si existen
            if (factura.totales.descuentos > 0) {
                doc.font("Helvetica")
                   .fontSize(7)
                   .fillColor(TEXT_MUTED)
                   .text("Descuento:", MARGIN + 4, currentY);

                doc.font("Helvetica-Bold")
                   .fontSize(7)
                   .fillColor("#DC2626")
                   .text(`-${formatMoney(factura.totales.descuentos)}`, MARGIN + CONTENT - 70, currentY, { width: 66, align: "right" });

                currentY += 11;
            }

            // Card TOTAL A PAGAR
            currentY += 2;
            doc.roundedRect(MARGIN, currentY, CONTENT, 26, 6)
               .fill(PRIMARY_COLOR);

            doc.font("Helvetica-Bold")
               .fontSize(7.5)
               .fillColor(PRIMARY_LIGHT)
               .text("TOTAL A PAGAR", MARGIN + 8, currentY + 8);

            doc.font("Helvetica-Bold")
               .fontSize(11)
               .fillColor(WHITE)
               .text(formatMoney(factura.totales.total), MARGIN + 8, currentY + 6, {
                   width: CONTENT - 16,
                   align: "right",
               });

            currentY += 32;

            // ── 5. PIE DE TICKET Y AGRADECIMIENTO ──────────────────────────
            const mensajePie = factura.empresa.mensajePieFactura || "¡Gracias por su compra! Vuelva pronto.";
            doc.font("Helvetica-Oblique")
               .fontSize(7)
               .fillColor(PRIMARY_COLOR)
               .text(mensajePie, MARGIN, currentY, { width: CONTENT, align: "center" });

            currentY = doc.y + 4;

            doc.font("Helvetica")
               .fontSize(6)
               .fillColor(TEXT_SUBTLE)
               .text("Comprobante electrónico · SmartPOS", MARGIN, currentY, { width: CONTENT, align: "center" });

            // Barra inferior decorativa
            doc.rect(0, dynamicHeight - 3, PAGE_W, 3).fill(PRIMARY_COLOR);

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};