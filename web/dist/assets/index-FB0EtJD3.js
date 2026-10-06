import{c as K,r as p,a as M,j as r,B as F,F as z}from"./index-2WqEeH6c.js";import{u as X}from"./index.esm-huI5JbtQ.js";import{L as S}from"./loader-circle-DlWzgNbN.js";import{S as ee}from"./sparkles-C1A6xKDU.js";import{S as re}from"./save-CXDCdqfj.js";import{P as te,M as ae}from"./phone-DJsRCrGg.js";import{M as se}from"./mail-C_OvJBuT.js";import{R as $}from"./receipt-BbhazPoQ.js";import{C as oe}from"./circle-check-B_tIX4pu.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],ne=K("Earth",ie);let ce={data:""},de=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||ce},le=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,me=/\/\*[^]*?\*\/|  +/g,_=/\n+/g,y=(e,t)=>{let a="",o="",n="";for(let i in e){let s=e[i];i[0]=="@"?i[1]=="i"?a=i+" "+s+";":o+=i[1]=="f"?y(s,i):i+"{"+y(s,i[1]=="k"?"":t)+"}":typeof s=="object"?o+=y(s,t?t.replace(/([^,])+/g,c=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,c):c?c+" "+d:d)):i):s!=null&&(i=i[1]=="-"?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=y.p?y.p(i,s):i+":"+s+";")}return a+(t&&n?t+"{"+n+"}":n)+o},h={},G=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+G(e[a]);return t}return e},pe=(e,t,a,o,n)=>{let i=G(e),s=h[i]||(h[i]=(d=>{let l=0,u=11;for(;l<d.length;)u=101*u+d.charCodeAt(l++)>>>0;return"go"+u})(i));if(!h[s]){let d=i!==e?e:(l=>{let u,g,b=[{}];for(;u=le.exec(l.replace(me,""));)u[4]?b.shift():u[3]?(g=u[3].replace(_," ").trim(),b.unshift(b[0][g]=b[0][g]||{})):b[0][u[1]]=u[2].replace(_," ").trim();return b[0]})(e);h[s]=y(n?{["@keyframes "+s]:d}:d,a?"":"."+s)}let c=a&&h.g;return a&&(h.g=h[s]),((d,l,u,g)=>{g?l.data=l.data.replace(g,d):l.data.indexOf(d)===-1&&(l.data=u?d+l.data:l.data+d)})(h[s],t,o,c),s},ue=(e,t,a)=>e.reduce((o,n,i)=>{let s=t[i];if(s&&s.call){let c=s(a),d=c&&c.props&&c.props.className||/^go/.test(c)&&c;s=d?"."+d:c&&typeof c=="object"?c.props?"":y(c,""):c===!1?"":c}return o+n+(s??"")},"");function k(e){let t=this||{},a=e.call?e(t.p):e;return pe(a.unshift?a.raw?ue(a,[].slice.call(arguments,1),t.p):a.reduce((o,n)=>Object.assign(o,n&&n.call?n(t.p):n),{}):a,de(t.target),t.g,t.o,t.k)}let R,C,I;k.bind({g:1});let f=k.bind({k:1});function xe(e,t,a,o){y.p=t,R=e,C=a,I=o}function j(e,t){let a=this||{};return function(){let o=arguments;function n(i,s){let c=Object.assign({},i),d=c.className||n.className;a.p=Object.assign({theme:C&&C()},c),a.o=/go\d/.test(d),c.className=k.apply(a,o)+(d?" "+d:"");let l=e;return e[0]&&(l=c.as||e,delete c.as),I&&l[0]&&I(c),R(l,c)}return n}}var fe=e=>typeof e=="function",P=(e,t)=>fe(e)?e(t):e,ge=(()=>{let e=0;return()=>(++e).toString()})(),be=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),he=20,V="default",B=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(s=>s.id===t.toast.id?{...s,...t.toast}:s)};case 2:let{toast:o}=t;return B(e,{type:e.toasts.find(s=>s.id===o.id)?1:0,toast:o});case 3:let{toastId:n}=t;return{...e,toasts:e.toasts.map(s=>s.id===n||n===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(s=>s.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+i}))}}},ye=[],je={toasts:[],pausedAt:void 0,settings:{toastLimit:he}},v={},H=(e,t=V)=>{v[t]=B(v[t]||je,e),ye.forEach(([a,o])=>{a===t&&o(v[t])})},q=e=>Object.keys(v).forEach(t=>H(e,t)),ve=e=>Object.keys(v).find(t=>v[t].toasts.some(a=>a.id===e)),A=(e=V)=>t=>{H(t,e)},Ne=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||ge()}),w=e=>(t,a)=>{let o=Ne(t,e,a);return A(o.toasterId||ve(o.id))({type:2,toast:o}),o.id},m=(e,t)=>w("blank")(e,t);m.error=w("error");m.success=w("success");m.loading=w("loading");m.custom=w("custom");m.dismiss=(e,t)=>{let a={type:3,toastId:e};t?A(t)(a):q(a)};m.dismissAll=e=>m.dismiss(void 0,e);m.remove=(e,t)=>{let a={type:4,toastId:e};t?A(t)(a):q(a)};m.removeAll=e=>m.remove(void 0,e);m.promise=(e,t,a)=>{let o=m.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(n=>{let i=t.success?P(t.success,n):void 0;return i?m.success(i,{id:o,...a,...a==null?void 0:a.success}):m.dismiss(o),n}).catch(n=>{let i=t.error?P(t.error,n):void 0;i?m.error(i,{id:o,...a,...a==null?void 0:a.error}):m.dismiss(o)}),e};var we=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ke=f`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ee=f`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Fe=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${we} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ke} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Ee} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Se=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,$e=j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Se} 1s linear infinite;
`,De=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ce=f`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Ie=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${De} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ce} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Pe=j("div")`
  position: absolute;
`,Me=j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ae=f`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Te=j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ae} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Oe=({toast:e})=>{let{icon:t,type:a,iconTheme:o}=e;return t!==void 0?typeof t=="string"?p.createElement(Te,null,t):t:a==="blank"?null:p.createElement(Me,null,p.createElement($e,{...o}),a!=="loading"&&p.createElement(Pe,null,a==="error"?p.createElement(Fe,{...o}):p.createElement(Ie,{...o})))},Le=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ze=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,_e="0%{opacity:0;} 100%{opacity:1;}",Ge="0%{opacity:1;} 100%{opacity:0;}",Re=j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ve=j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Be=(e,t)=>{let a=e.includes("top")?1:-1,[o,n]=be()?[_e,Ge]:[Le(a),ze(a)];return{animation:t?`${f(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};p.memo(({toast:e,position:t,style:a,children:o})=>{let n=e.height?Be(e.position||t||"top-center",e.visible):{opacity:0},i=p.createElement(Oe,{toast:e}),s=p.createElement(Ve,{...e.ariaProps},P(e.message,e));return p.createElement(Re,{className:e.className,style:{...n,...a,...e.style}},typeof o=="function"?o({icon:i,message:s}):p.createElement(p.Fragment,null,i,s))});xe(p.createElement);k`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;async function He(){return(await M.get("/empresa")).data}async function qe(e,t){return(await M.put(`/empresa/${e}`,t)).data}async function Ye(e){return(await M.post("/empresa",e)).data}const D={moneda:"COP",simboloMoneda:"$",zonaHoraria:"America/Bogota",formatoFecha:"DD/MM/YYYY",formatoHora:"12h",prefijoFacturas:"POS-",numeroInicialFacturas:"1",mensajePieFactura:"¡Gracias por su compra! Vuelva pronto.",mostrarLogoFactura:!0,mostrarDireccionFactura:!0,mostrarTelefonoFactura:!0,iva:"IVA",porcentajeIva:"0",aplicarImpuestos:!1,stockMinimoDefecto:"5",permitirStockNegativo:!1,alertarStockBajo:!0,abrirVentaAutomaticamente:!0,imprimirFacturaAutomaticamente:!0,solicitarConfirmacionCobro:!0};function tr(){const[e,t]=p.useState(!0),[a,o]=p.useState(!1),[n,i]=p.useState(null),{register:s,handleSubmit:c,reset:d,watch:l}=X(),u=l("nombre"),g=l("nit"),b=l("telefono"),Y=l("direccion"),T=l("ciudad"),W=l("configuracion.prefijoFacturas")||"POS-",Z=l("configuracion.mensajePieFactura"),Q=l("configuracion.mostrarDireccionFactura"),U=l("configuracion.mostrarTelefonoFactura");p.useEffect(()=>{(async()=>{var N,O;try{const x=await He();i(x.id);const L=x.configuracion||D;d({nombre:x.nombre||"",nit:x.nit||"",direccion:x.direccion||"",telefono:x.telefono||"",correo:x.correo||"",logo:x.logo||"",ciudad:x.ciudad||"",configuracion:{...D,...typeof L=="object"?L:{}}})}catch(x){(((N=x.response)==null?void 0:N.status)===404||((O=x.response)==null?void 0:O.status)===500)&&d({nombre:"",nit:"",direccion:"",telefono:"",correo:"",logo:"",ciudad:"",configuracion:D})}finally{t(!1)}})()},[d]);const J=async E=>{o(!0);try{if(n)await qe(n,E),m.success("Información de empresa actualizada");else{const N=await Ye(E);i(N.id),m.success("Empresa configurada exitosamente")}}catch{m.error("Error al guardar la información de la empresa")}finally{o(!1)}};return e?r.jsx("div",{className:"flex items-center justify-center py-24",children:r.jsxs("div",{className:"flex flex-col items-center gap-3",children:[r.jsx(S,{className:"h-8 w-8 animate-spin text-primary"}),r.jsx("span",{className:"text-xs text-muted-foreground font-semibold",children:"Cargando datos de la empresa..."})]})}):r.jsxs("form",{onSubmit:c(J),className:"space-y-6 max-w-5xl mx-auto pb-12",children:[r.jsxs("div",{className:"flex items-start justify-between gap-4 flex-wrap",children:[r.jsxs("div",{className:"flex items-start gap-3",children:[r.jsx("div",{className:"w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0"}),r.jsxs("div",{className:"space-y-1",children:[r.jsxs("h1",{className:"text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2",children:["Empresa y Facturación",r.jsx(ee,{className:"h-5 w-5 text-primary"})]}),r.jsxs("div",{className:"inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1",children:[r.jsx(F,{className:"h-3.5 w-3.5 text-muted-foreground shrink-0"}),r.jsx("span",{className:"text-xs font-medium text-muted-foreground",children:"Datos comerciales y de contacto que aparecerán en las facturas y comprobantes."})]})]})]}),r.jsx("button",{type:"submit",disabled:a,className:"flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60",children:a?r.jsxs(r.Fragment,{children:[r.jsx(S,{className:"h-4 w-4 animate-spin"}),"Guardando..."]}):r.jsxs(r.Fragment,{children:[r.jsx(re,{className:"h-4 w-4"}),"Guardar Cambios"]})})]}),r.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[r.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[r.jsxs("div",{className:"bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5",children:[r.jsxs("div",{className:"flex items-center gap-3 pb-3 border-b border-border/60",children:[r.jsx("div",{className:"h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20",children:r.jsx(F,{className:"h-5 w-5"})}),r.jsxs("div",{children:[r.jsx("h2",{className:"text-sm font-bold text-foreground",children:"Datos del Negocio"}),r.jsx("p",{className:"text-xs text-muted-foreground",children:"Información fiscal e identificación comercial"})]})]}),r.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[r.jsxs("div",{className:"space-y-1.5 sm:col-span-2",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx(F,{className:"h-3 w-3 text-primary"})," Nombre / Razón Social"]}),r.jsx("input",{required:!0,...s("nombre"),placeholder:"Ej. Mi Tienda Principal S.A.S.",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-semibold"})]}),r.jsxs("div",{className:"space-y-1.5",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx(z,{className:"h-3 w-3 text-primary"})," NIT / Documento Tributario"]}),r.jsx("input",{required:!0,...s("nit"),placeholder:"Ej. 900.123.456-7",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"})]}),r.jsxs("div",{className:"space-y-1.5",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx(te,{className:"h-3 w-3 text-primary"})," Teléfono / WhatsApp"]}),r.jsx("input",{...s("telefono"),placeholder:"Ej. +57 300 123 4567",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"})]}),r.jsxs("div",{className:"space-y-1.5 sm:col-span-2",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx(se,{className:"h-3 w-3 text-primary"})," Correo Electrónico"]}),r.jsx("input",{type:"email",...s("correo"),placeholder:"contacto@mitienda.com",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"})]}),r.jsxs("div",{className:"space-y-1.5",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx(ae,{className:"h-3 w-3 text-primary"})," Dirección Comercial"]}),r.jsx("input",{...s("direccion"),placeholder:"Ej. Carrera 15 # 45-20",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"})]}),r.jsxs("div",{className:"space-y-1.5",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx(ne,{className:"h-3 w-3 text-primary"})," Ciudad / Municipio"]}),r.jsx("input",{...s("ciudad"),placeholder:"Ej. Bogotá, D.C.",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"})]})]})]}),r.jsxs("div",{className:"bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5",children:[r.jsxs("div",{className:"flex items-center gap-3 pb-3 border-b border-border/60",children:[r.jsx("div",{className:"h-10 w-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 ring-1 ring-violet-500/20",children:r.jsx($,{className:"h-5 w-5"})}),r.jsxs("div",{children:[r.jsx("h2",{className:"text-sm font-bold text-foreground",children:"Detalles del Comprobante"}),r.jsx("p",{className:"text-xs text-muted-foreground",children:"Textos y opciones que se imprimen en el ticket"})]})]}),r.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[r.jsxs("div",{className:"space-y-1.5",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx(z,{className:"h-3 w-3 text-violet-500"})," Prefijo de Factura"]}),r.jsx("input",{...s("configuracion.prefijoFacturas"),placeholder:"Ej. POS-",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono font-bold"})]}),r.jsxs("div",{className:"space-y-1.5 sm:col-span-2",children:[r.jsxs("label",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx($,{className:"h-3 w-3 text-violet-500"})," Mensaje en Pie de Factura"]}),r.jsx("textarea",{rows:2,...s("configuracion.mensajePieFactura"),placeholder:"Ej. ¡Gracias por su compra! Vuelva pronto.",className:"w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none font-medium"})]}),r.jsxs("div",{className:"sm:col-span-2 pt-2 space-y-2.5",children:[r.jsxs("label",{className:"flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer select-none",children:[r.jsx("input",{type:"checkbox",...s("configuracion.mostrarDireccionFactura"),className:"w-4 h-4 rounded text-primary focus:ring-primary/30 border-border"}),r.jsxs("div",{className:"text-xs",children:[r.jsx("span",{className:"font-bold text-foreground block",children:"Incluir dirección en el ticket"}),r.jsx("span",{className:"text-muted-foreground text-[11px]",children:"Imprime la dirección y ciudad en el encabezado de la factura."})]})]}),r.jsxs("label",{className:"flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer select-none",children:[r.jsx("input",{type:"checkbox",...s("configuracion.mostrarTelefonoFactura"),className:"w-4 h-4 rounded text-primary focus:ring-primary/30 border-border"}),r.jsxs("div",{className:"text-xs",children:[r.jsx("span",{className:"font-bold text-foreground block",children:"Incluir teléfono en el ticket"}),r.jsx("span",{className:"text-muted-foreground text-[11px]",children:"Imprime el número telefónico para contacto del cliente."})]})]})]})]})]})]}),r.jsx("div",{className:"space-y-4",children:r.jsx("div",{className:"sticky top-6",children:r.jsxs("div",{className:"bg-card border border-border rounded-3xl p-5 shadow-md space-y-4",children:[r.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-border/60",children:[r.jsxs("span",{className:"text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",children:[r.jsx($,{className:"h-3.5 w-3.5 text-primary"})," Vista Previa del Ticket"]}),r.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20",children:"Formato POS"})]}),r.jsxs("div",{className:"bg-muted/40 border border-dashed border-border/80 rounded-2xl p-4 font-mono text-[11px] text-foreground space-y-3 shadow-inner",children:[r.jsxs("div",{className:"text-center space-y-0.5 pb-2 border-b border-dashed border-border",children:[r.jsx("p",{className:"font-extrabold text-xs text-foreground uppercase truncate",children:u||"NOMBRE DE LA EMPRESA"}),r.jsxs("p",{className:"text-[10px] text-muted-foreground",children:["NIT: ",g||"000.000.000-0"]}),Q&&r.jsxs("p",{className:"text-[10px] text-muted-foreground truncate",children:[Y||"Dirección Comercial",T?` - ${T}`:""]}),U&&r.jsxs("p",{className:"text-[10px] text-muted-foreground",children:["Tel: ",b||"(300) 000-0000"]})]}),r.jsxs("div",{className:"text-[10px] space-y-0.5 text-muted-foreground",children:[r.jsxs("div",{className:"flex justify-between",children:[r.jsx("span",{children:"Factura:"}),r.jsxs("span",{className:"font-bold text-foreground",children:[W,"0001"]})]}),r.jsxs("div",{className:"flex justify-between",children:[r.jsx("span",{children:"Fecha:"}),r.jsx("span",{children:new Date().toLocaleDateString("es-CO")})]})]}),r.jsxs("div",{className:"border-t border-b border-dashed border-border py-1.5 space-y-1 text-[10px]",children:[r.jsxs("div",{className:"flex justify-between",children:[r.jsx("span",{className:"truncate max-w-[140px]",children:"1 × Producto Muestra"}),r.jsx("span",{className:"font-semibold",children:"$15.000"})]}),r.jsxs("div",{className:"flex justify-between font-extrabold text-xs pt-1 border-t border-border/40 text-foreground",children:[r.jsx("span",{children:"TOTAL:"}),r.jsx("span",{children:"$15.000"})]})]}),r.jsx("div",{className:"text-center pt-1 text-[10px] text-muted-foreground italic",children:r.jsx("p",{children:Z||"¡Gracias por su compra!"})})]}),r.jsx("button",{type:"submit",disabled:a,className:"w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60",children:a?r.jsxs(r.Fragment,{children:[r.jsx(S,{className:"h-4 w-4 animate-spin"}),"Guardando..."]}):r.jsxs(r.Fragment,{children:[r.jsx(oe,{className:"h-4 w-4"}),"Guardar Configuración"]})})]})})})]})]})}export{tr as default};
