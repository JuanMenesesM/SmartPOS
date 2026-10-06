/**
 * Export utilities for downloading CSV, Excel-compatible CSV, and printable PDF reports
 * using Blob objects for 100% reliable downloads without browser URL truncation or character bugs.
 */

export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const BOM = "\uFEFF"; // Byte Order Mark for Excel UTF-8 recognition
  const csvRows = rows.map((row) =>
    row
      .map((val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(",")
  );

  const csvContent =
    BOM + [headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","), ...csvRows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExcel(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const cleanName = filename.replace(/\.(csv|xlsx)$/i, "");
  downloadCSV(`${cleanName}.csv`, headers, rows);
}

export function printPDFReport(
  title: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const dateStr = new Date().toLocaleString("es-CO");

  const tableHeaders = headers
    .map(
      (h) =>
        `<th style="border: 1px solid #e2e8f0; padding: 8px 10px; background: #f1f5f9; font-size: 11px; text-transform: uppercase; text-align: left; font-weight: 700; color: #334155;">${h}</th>`
    )
    .join("");

  const tableRows = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (val) =>
              `<td style="border: 1px solid #e2e8f0; padding: 7px 10px; font-size: 11px; color: #0f172a;">${val ?? "-"}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 24px; color: #0f172a; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
          h1 { font-size: 20px; font-weight: 800; margin: 0; color: #0f172a; }
          p.meta { font-size: 11px; color: #64748b; margin: 4px 0 0 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          @page { size: auto; margin: 15mm; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${title}</h1>
            <p class="meta">Reporte oficial generado el ${dateStr} | SmartPOS</p>
          </div>
        </div>
        <table>
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
