import PDFDocument from "pdfkit";
import { FacturaVentaDTO } from "./factura.dto";

// ── Paleta de colores ──────────────────────────────────────────────────────────
const PURPLE     = "#6B4EFF";   // Acento principal (violeta)
const DARK       = "#1A1A2E";   // Texto oscuro / nombre empresa
const GRAY_LABEL = "#9CA3AF";   // Etiquetas secundarias
const GRAY_LINE  = "#E5E7EB";   // Separadores
const LAVENDER   = "#EEF0FF";   // Fondo caja de estado
const WHITE      = "#FFFFFF";

// ── Helpers ────────────────────────────────────────────────────────────────────
const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const fmt = (v: number) => money.format(v);
const formatDate = (date: Date) => date.toLocaleDateString("es-CO", { dateStyle: "long" });

// ── Labels ─────────────────────────────────────────────────────────────────────
const LABELS = {
    invoiceNumber:  "NÚMERO DE FACTURA",
    issueDate:      "FECHA DE EMISIÓN",
    billTo:         "CLIENTE",
    serviceBy:      "VENDEDOR",
    paymentStatus:  "ESTADO DE PAGO",
    saleDate:       "FECHA DE VENTA",
    qty:            "CANT",
    description:    "DESCRIPCIÓN",
    unitPrice:      "UNITARIO",
    subtotalCol:    "SUBTOTAL",
    subtotal:       "SUBTOTAL",
    discount:       "DESCUENTO",
    totalDue:       "TOTAL A PAGAR",
    footer:         "Generado por SmartPOS · Documento fiscal para uso interno y del cliente"
};

const PAGE_W  = 595.28;
const MARGIN  = 50;
const CONTENT = PAGE_W - MARGIN * 2;  // 495.28

// ──────────────────────────────────────────────────────────────────────────────
export const generarFacturaVenta = async (factura: FacturaVentaDTO): Promise<Buffer> => {

    // Descargar logo antes de entrar al Promise (no se puede await dentro)
    let logoBuffer: Buffer | null = null;
    if (factura.empresa.logo) {
        try {
            const res = await fetch(factura.empresa.logo);
            const arrayBuffer = await res.arrayBuffer();
            logoBuffer = Buffer.from(arrayBuffer);
        } catch {
            // Si falla la descarga, se usará el nombre en texto
        }
    }

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: MARGIN, size: "A4" });
            const buffers: Buffer[] = [];
            doc.on("data", (c) => buffers.push(c));
            doc.on("end",  () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // ── 1. CABECERA ─────────────────────────────────────────────────
            const headerY = 60;
            const LOGO_SIZE = 48;
            const empresaNombre = (factura.empresa.nombre ?? "").toUpperCase();

            let nameX = MARGIN; // posición X donde empieza el nombre

            if (logoBuffer) {
                doc.image(logoBuffer, MARGIN, headerY - 6, {
                    fit: [LOGO_SIZE, LOGO_SIZE]
                });
                nameX = MARGIN + LOGO_SIZE + 12; // nombre al lado del logo
            }

            // Nombre empresa (siempre visible)
            doc.font("Helvetica-Bold")
               .fontSize(22)
               .fillColor(PURPLE)
               .text(empresaNombre, nameX, headerY);

            // Subtítulo empresa
            doc.font("Helvetica")
               .fontSize(9)
               .fillColor(GRAY_LABEL)
               .text(
                   `${factura.empresa.ciudad ?? ""}  ·  ${factura.empresa.direccion ?? ""}`,
                   nameX, headerY + 28
               );

            // Número de factura (derecha)
            const rightX = MARGIN + CONTENT;
            doc.font("Helvetica")
               .fontSize(7)
               .fillColor(GRAY_LABEL)
               .text(LABELS.invoiceNumber, MARGIN, headerY, { width: CONTENT, align: "right" });

            doc.font("Helvetica-Bold")
               .fontSize(14)
               .fillColor(DARK)
               .text(`#${factura.venta.numeroFactura}`, MARGIN, headerY + 13, { width: CONTENT, align: "right" });

            // Fecha
            doc.font("Helvetica")
               .fontSize(7)
               .fillColor(GRAY_LABEL)
               .text(LABELS.issueDate, MARGIN, headerY + 34, { width: CONTENT, align: "right" });

            doc.font("Helvetica")
               .fontSize(9)
               .fillColor(DARK)
               .text(
                   formatDate(factura.venta.fecha),
                   MARGIN, headerY + 46, { width: CONTENT, align: "right" }
               );

            // ── Línea divisoria ──────────────────────────────────────────────
            const lineY = headerY + 72;
            doc.moveTo(MARGIN, lineY).lineTo(MARGIN + CONTENT, lineY)
               .strokeColor(DARK).lineWidth(1.5).stroke();

            // ── 2. BLOQUE DE INFORMACIÓN ────────────────────────────────────
            const infoY = lineY + 20;
            const col2X = MARGIN + 160;
            const col3X = MARGIN + 320;
            const boxW  = 175;

            // BILL TO
            doc.font("Helvetica").fontSize(7).fillColor(GRAY_LABEL).text(LABELS.billTo, MARGIN, infoY);
            doc.font("Helvetica-Bold").fontSize(14).fillColor(DARK)
               .text(factura.venta.cliente || "Consumidor Final", MARGIN, infoY + 12);

            // SERVICE BY
            doc.font("Helvetica").fontSize(7).fillColor(GRAY_LABEL).text(LABELS.serviceBy, col2X, infoY);
            doc.font("Helvetica-Bold").fontSize(14).fillColor(DARK)
               .text(factura.venta.vendedor, col2X, infoY + 12);

            // Caja de estado (derecha)
            const boxX = MARGIN + CONTENT - boxW;
            doc.roundedRect(boxX, infoY - 4, boxW, 60, 6).fill(LAVENDER);

            doc.font("Helvetica").fontSize(7).fillColor(GRAY_LABEL)
               .text(LABELS.paymentStatus, boxX + 12, infoY + 6);
            doc.font("Helvetica-Bold").fontSize(9).fillColor(PURPLE)
               .text("PAGADO", boxX + 12, infoY + 20);

            doc.font("Helvetica").fontSize(7).fillColor(GRAY_LABEL)
               .text(LABELS.saleDate, boxX + 12, infoY + 36);
            doc.font("Helvetica").fontSize(8).fillColor(DARK)
               .text(
                   factura.venta.fecha.toLocaleTimeString("es-CO", { timeStyle: "short" }),
                   boxX + 12, infoY + 48
               );

            // ── 3. TABLA DE ITEMS ────────────────────────────────────────────
            const tableTop = infoY + 80;

            // Encabezados de la tabla
            const COL_CANT = MARGIN;
            const COL_DESC = MARGIN + 50;
            const COL_UNIT = MARGIN + CONTENT - 130;
            const COL_SUB  = MARGIN + CONTENT - 60;

            doc.font("Helvetica").fontSize(7).fillColor(GRAY_LABEL);
            doc.text(LABELS.qty,         COL_CANT, tableTop);
            doc.text(LABELS.description, COL_DESC, tableTop);
            doc.text(LABELS.unitPrice,   COL_UNIT, tableTop, { width: 70, align: "right" });
            doc.text(LABELS.subtotalCol, COL_SUB,  tableTop, { width: 60, align: "right" });

            // Línea bajo encabezado
            const headLineY = tableTop + 14;
            doc.moveTo(MARGIN, headLineY).lineTo(MARGIN + CONTENT, headLineY)
               .strokeColor(GRAY_LINE).lineWidth(0.5).stroke();

            // Filas
            let rowY = headLineY + 16;
            for (const d of factura.detalles) {
                // Cantidad (en formato "01", "02"...)
                doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK)
                   .text(d.cantidad.toString().padStart(2, "0"), COL_CANT, rowY);

                // Nombre del producto (negrita)
                doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK)
                   .text(d.producto, COL_DESC, rowY, { width: COL_UNIT - COL_DESC - 10 });

                // Precio unitario
                doc.font("Helvetica").fontSize(10).fillColor(DARK)
                   .text(fmt(d.precioUnitario), COL_UNIT, rowY, { width: 70, align: "right" });

                // Subtotal
                doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK)
                   .text(fmt(d.subtotal), COL_SUB, rowY, { width: 60, align: "right" });

                rowY += 30;

                // Línea divisora sutil entre items
                doc.moveTo(MARGIN, rowY - 8).lineTo(MARGIN + CONTENT, rowY - 8)
                   .strokeColor(GRAY_LINE).lineWidth(0.3).stroke();
            }

            // ── 4. TOTALES ───────────────────────────────────────────────────
            const totY = rowY + 10;
            const totLabelX = COL_UNIT;
            const totValX   = COL_SUB;

            // Subtotal
            doc.font("Helvetica").fontSize(8).fillColor(GRAY_LABEL)
               .text(LABELS.subtotal, totLabelX, totY, { width: 70, align: "right" });
            doc.font("Helvetica").fontSize(9).fillColor(DARK)
               .text(fmt(factura.totales.subtotal), totValX, totY, { width: 60, align: "right" });

            // Descuentos (si hubiese)
            if (factura.totales.descuentos > 0) {
                doc.font("Helvetica").fontSize(8).fillColor(GRAY_LABEL)
                   .text(LABELS.discount, totLabelX, totY + 18, { width: 70, align: "right" });
                doc.font("Helvetica").fontSize(9).fillColor(DARK)
                   .text(`-${fmt(factura.totales.descuentos)}`, totValX, totY + 18, { width: 60, align: "right" });
            }

            // Caja TOTAL
            const totalBoxY = totY + (factura.totales.descuentos > 0 ? 36 : 18);
            const totalBoxX = COL_UNIT - 10;
            const totalBoxW = MARGIN + CONTENT - totalBoxX;

            doc.roundedRect(totalBoxX, totalBoxY, totalBoxW, 44, 6).fill(PURPLE);
            doc.font("Helvetica").fontSize(8).fillColor(WHITE)
               .text(LABELS.totalDue, totalBoxX + 12, totalBoxY + 8,
                   { width: totalBoxW - 24, align: "right" });
            doc.font("Helvetica-Bold").fontSize(15).fillColor(WHITE)
               .text(fmt(factura.totales.total), totalBoxX + 12, totalBoxY + 20,
                   { width: totalBoxW - 24, align: "right" });

            // ── 5. PIE DE PÁGINA ─────────────────────────────────────────────
            const footerY = 780;

            doc.moveTo(MARGIN, footerY).lineTo(MARGIN + CONTENT, footerY)
               .strokeColor(GRAY_LINE).lineWidth(0.5).stroke();

            doc.font("Helvetica-Bold").fontSize(8).fillColor(DARK)
               .text((factura.empresa.nombre ?? "").toUpperCase(), MARGIN + CONTENT, footerY + 12,
                   { width: CONTENT, align: "right" });
            doc.font("Helvetica").fontSize(7.5).fillColor(GRAY_LABEL)
               .text(
                   `${factura.empresa.direccion}  |  Tel: ${factura.empresa.telefono}  |  ${factura.empresa.correo}`,
                   MARGIN + CONTENT, footerY + 24,
                   { width: CONTENT, align: "right" }
               );

            doc.font("Helvetica").fontSize(7).fillColor(GRAY_LABEL)
               .text(
                   LABELS.footer,
                   MARGIN, footerY + 12, { width: CONTENT, align: "center" }
               );
            doc.end();

        } catch (err) {
            reject(err);
        }
    });
};