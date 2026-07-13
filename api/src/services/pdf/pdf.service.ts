import PDFDocument from "pdfkit";
import { FacturaVentaDTO } from "./factura.dto";

// Colores de la paleta
const COLOR_PRIMARIO  = "#1a1a2e"; // Azul oscuro para header
const COLOR_ACENTO    = "#e94560"; // Rojo/coral para detalles
const COLOR_GRIS      = "#f0f0f0"; // Gris claro para filas alternas
const COLOR_TEXTO     = "#333333";
const COLOR_BLANCO    = "#ffffff";

export const generarFacturaVenta = async (factura: FacturaVentaDTO): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: "A4" });
            const buffers: Buffer[] = [];

            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // ─────────────────────────────────────────────
            // CABECERA: Banda de color con el nombre de la empresa
            // ─────────────────────────────────────────────
            doc.rect(0, 0, 612, 100).fill(COLOR_PRIMARIO);

            doc.fillColor(COLOR_BLANCO)
               .font("Helvetica-Bold")
               .fontSize(22)
               .text(factura.empresa.nombre.toUpperCase(), 50, 28, { align: "center" });

            doc.font("Helvetica")
               .fontSize(9)
               .text(
                   `NIT: ${factura.empresa.nit}  |  ${factura.empresa.direccion}  |  Tel: ${factura.empresa.telefono}`,
                   50, 58, { align: "center" }
               );

            doc.fontSize(9)
               .text(factura.empresa.ciudad, 50, 72, { align: "center" });

            // ─────────────────────────────────────────────
            // BLOQUE DE INFO: Número de factura y datos del cliente
            // ─────────────────────────────────────────────
            doc.fillColor(COLOR_TEXTO);
            const infoY = 120;

            // Lado izquierdo: Datos del cliente
            doc.font("Helvetica-Bold").fontSize(10).text("DATOS DE LA VENTA", 50, infoY);
            doc.font("Helvetica").fontSize(9)
               .text(`Cliente:  ${factura.venta.cliente}`, 50, infoY + 16)
               .text(`Vendedor: ${factura.venta.vendedor}`, 50, infoY + 30);

            // Lado derecho: Número de factura y fecha
            doc.font("Helvetica-Bold")
               .fontSize(18)
               .fillColor(COLOR_ACENTO)
               .text(factura.venta.numeroFactura, 350, infoY, { width: 200, align: "right" });

            doc.font("Helvetica").fontSize(9).fillColor(COLOR_TEXTO)
               .text(
                   `Fecha: ${factura.venta.fecha.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}`,
                   350, infoY + 22, { width: 200, align: "right" }
               );

            // Línea separadora
            const sepY = infoY + 60;
            doc.moveTo(50, sepY).lineTo(562, sepY).strokeColor(COLOR_PRIMARIO).lineWidth(1.5).stroke();

            // ─────────────────────────────────────────────
            // TABLA DE PRODUCTOS
            // ─────────────────────────────────────────────
            const tableTop = sepY + 20;
            const colCant    = 50;
            const colProd    = 100;
            const colPunit   = 380;
            const colSub     = 480;
            const tableRight = 562;

            // Encabezado de la tabla con fondo de color
            doc.rect(50, tableTop, tableRight - 50, 22).fill(COLOR_PRIMARIO);
            doc.fillColor(COLOR_BLANCO).font("Helvetica-Bold").fontSize(9);
            doc.text("CANT",     colCant,  tableTop + 6);
            doc.text("PRODUCTO", colProd,  tableTop + 6);
            doc.text("P. UNIT",  colPunit, tableTop + 6, { width: 80, align: "right" });
            doc.text("SUBTOTAL", colSub,   tableTop + 6, { width: 80, align: "right" });

            // Filas de productos
            let rowY = tableTop + 28;
            doc.font("Helvetica").fontSize(9).fillColor(COLOR_TEXTO);

            for (let i = 0; i < factura.detalles.length; i++) {
                const d = factura.detalles[i];

                // Fila alterna (color gris claro en filas pares)
                if (i % 2 === 0) {
                    doc.rect(50, rowY - 4, tableRight - 50, 20).fill(COLOR_GRIS);
                }

                doc.fillColor(COLOR_TEXTO);
                doc.text(d.cantidad.toString(),                colCant,  rowY);
                doc.text(d.producto.substring(0, 45),         colProd,  rowY);
                doc.text(d.precioUnitario.toLocaleString("es-CO"), colPunit, rowY, { width: 80, align: "right" });
                doc.text(d.subtotal.toLocaleString("es-CO"),       colSub,   rowY, { width: 80, align: "right" });

                rowY += 20;
            }

            // Línea inferior de la tabla
            doc.moveTo(50, rowY + 4).lineTo(tableRight, rowY + 4)
               .strokeColor(COLOR_PRIMARIO).lineWidth(1).stroke();

            // ─────────────────────────────────────────────
            // TOTAL FINAL
            // ─────────────────────────────────────────────
            const totalY = rowY + 20;

            // Caja del total con color acento
            doc.rect(380, totalY, 182, 34).fill(COLOR_ACENTO);
            doc.fillColor(COLOR_BLANCO)
               .font("Helvetica-Bold")
               .fontSize(11)
               .text("TOTAL:", 390, totalY + 10);

            doc.fontSize(13)
               .text(`$ ${factura.totales.total.toLocaleString("es-CO")}`, 390, totalY + 10, {
                   width: 162, align: "right"
               });

            // ─────────────────────────────────────────────
            // PIE DE PÁGINA
            // ─────────────────────────────────────────────
            doc.fillColor(COLOR_TEXTO)
               .font("Helvetica")
               .fontSize(8)
               .text("Gracias por su compra. Este documento es válido como soporte de pago.", 50, 750, {
                   align: "center",
                   width: 512
               });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};