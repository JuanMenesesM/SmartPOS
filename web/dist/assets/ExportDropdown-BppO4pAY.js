import{c as f,r as h,j as e,C as g,F as y}from"./index-2WqEeH6c.js";import{D as w}from"./download-uVh8whxF.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M10 12.5 8 15l2 2.5",key:"1tg20x"}],["path",{d:"m14 12.5 2 2.5-2 2.5",key:"yinavb"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",key:"1mlx9k"}]],j=f("FileCode",v);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]],E=f("FileSpreadsheet",k);function u(n,r,a){const i=a.map(c=>c.map(p=>p==null?'""':`"${String(p).replace(/"/g,'""')}"`).join(",")),d="\uFEFF"+[r.map(c=>`"${c.replace(/"/g,'""')}"`).join(","),...i].join(`\r
`),s=new Blob([d],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(s),o=document.createElement("a");o.href=l,o.setAttribute("download",n.endsWith(".csv")?n:`${n}.csv`),document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(l)}function C(n,r,a){const t=n.replace(/\.(csv|xlsx)$/i,"");u(`${t}.csv`,r,a)}function $(n,r,a){const t=window.open("","_blank");if(!t)return;const i=new Date().toLocaleString("es-CO"),d=r.map(o=>`<th style="border: 1px solid #e2e8f0; padding: 8px 10px; background: #f1f5f9; font-size: 11px; text-transform: uppercase; text-align: left; font-weight: 700; color: #334155;">${o}</th>`).join(""),s=a.map(o=>`<tr>${o.map(c=>`<td style="border: 1px solid #e2e8f0; padding: 7px 10px; font-size: 11px; color: #0f172a;">${c??"-"}</td>`).join("")}</tr>`).join(""),l=`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${n}</title>
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
            <h1>${n}</h1>
            <p class="meta">Reporte oficial generado el ${i} | SmartPOS</p>
          </div>
        </div>
        <table>
          <thead><tr>${d}</tr></thead>
          <tbody>${s}</tbody>
        </table>
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\/script>
      </body>
    </html>
  `;t.document.write(l),t.document.close()}function S({title:n,filename:r,headers:a,rows:t,disabled:i=!1}){const[d,s]=h.useState(!1),l=h.useRef(null);h.useEffect(()=>{function m(b){l.current&&!l.current.contains(b.target)&&s(!1)}return document.addEventListener("mousedown",m),()=>document.removeEventListener("mousedown",m)},[]);const o=()=>{s(!1),u(r,a,t)},c=()=>{s(!1),C(r,a,t)},p=()=>{s(!1),$(n,a,t)},x=i||t.length===0;return e.jsxs("div",{ref:l,className:"relative inline-block text-left",children:[e.jsxs("button",{type:"button",disabled:x,onClick:()=>s(m=>!m),className:`
          flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 select-none
          ${x?"opacity-40 cursor-not-allowed bg-muted border border-border text-muted-foreground":d?"bg-emerald-600 text-white shadow-md shadow-emerald-500/20":"bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"}
        `,children:[e.jsx(w,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Exportar"}),e.jsx(g,{className:`h-3.5 w-3.5 transition-transform duration-200 ${d?"rotate-180":""}`})]}),d&&!x&&e.jsxs("div",{className:"absolute right-0 top-full mt-1.5 w-48 z-50 bg-card border border-border rounded-xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150",children:[e.jsx("div",{className:"px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider",children:"Formato de descarga"}),e.jsxs("button",{type:"button",onClick:c,className:"w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-accent transition-colors text-left",children:[e.jsx(E,{className:"h-3.5 w-3.5 text-emerald-500"}),e.jsx("span",{children:"Excel (.xlsx / .csv)"})]}),e.jsxs("button",{type:"button",onClick:o,className:"w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-accent transition-colors text-left",children:[e.jsx(j,{className:"h-3.5 w-3.5 text-blue-500"}),e.jsx("span",{children:"CSV (.csv)"})]}),e.jsxs("button",{type:"button",onClick:p,className:"w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-accent transition-colors text-left",children:[e.jsx(y,{className:"h-3.5 w-3.5 text-rose-500"}),e.jsx("span",{children:"PDF (.pdf)"})]})]})]})}export{S as E};
