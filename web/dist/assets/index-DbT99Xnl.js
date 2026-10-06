import{c as Y,r as u,a as P,j as e,B as V,F as q,P as Q,e as W,X,C as J}from"./index-94HbGamN.js";import{u as K,C as E}from"./index.esm-CD1PocbN.js";import{M as ee}from"./monitor-CbLj4ux9.js";import{S as re}from"./save-5epSzFSP.js";import{C as ae}from"./check-oci7E6sp.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],se=Y("Database",te);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],ie=Y("Earth",oe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]],le=Y("Percent",ne);let de={data:""},ce=r=>{if(typeof window=="object"){let a=(r?r.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return a.nonce=window.__nonce__,a.parentNode||(r||document.head).appendChild(a),a.firstChild}return r||de},me=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,ue=/\/\*[^]*?\*\/|  +/g,T=/\n+/g,v=(r,a)=>{let t="",n="",l="";for(let i in r){let s=r[i];i[0]=="@"?i[1]=="i"?t=i+" "+s+";":n+=i[1]=="f"?v(s,i):i+"{"+v(s,i[1]=="k"?"":a)+"}":typeof s=="object"?n+=v(s,a?a.replace(/([^,])+/g,d=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,o=>/&/.test(o)?o.replace(/&/g,d):d?d+" "+o:o)):i):s!=null&&(i=i[1]=="-"?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),l+=v.p?v.p(i,s):i+":"+s+";")}return t+(a&&l?a+"{"+l+"}":l)+n},N={},H=r=>{if(typeof r=="object"){let a="";for(let t in r)a+=t+H(r[t]);return a}return r},pe=(r,a,t,n,l)=>{let i=H(r),s=N[i]||(N[i]=(o=>{let c=0,m=11;for(;c<o.length;)m=101*m+o.charCodeAt(c++)>>>0;return"go"+m})(i));if(!N[s]){let o=i!==r?r:(c=>{let m,g,y=[{}];for(;m=me.exec(c.replace(ue,""));)m[4]?y.shift():m[3]?(g=m[3].replace(T," ").trim(),y.unshift(y[0][g]=y[0][g]||{})):y[0][m[1]]=m[2].replace(T," ").trim();return y[0]})(r);N[s]=v(l?{["@keyframes "+s]:o}:o,t?"":"."+s)}let d=t&&N.g;return t&&(N.g=N[s]),((o,c,m,g)=>{g?c.data=c.data.replace(g,o):c.data.indexOf(o)===-1&&(c.data=m?o+c.data:c.data+o)})(N[s],a,n,d),s},xe=(r,a,t)=>r.reduce((n,l,i)=>{let s=a[i];if(s&&s.call){let d=s(t),o=d&&d.props&&d.props.className||/^go/.test(d)&&d;s=o?"."+o:d&&typeof d=="object"?d.props?"":v(d,""):d===!1?"":d}return n+l+(s??"")},"");function I(r){let a=this||{},t=r.call?r(a.p):r;return pe(t.unshift?t.raw?xe(t,[].slice.call(arguments,1),a.p):t.reduce((n,l)=>Object.assign(n,l&&l.call?l(a.p):l),{}):t,ce(a.target),a.g,a.o,a.k)}let R,M,$;I.bind({g:1});let h=I.bind({k:1});function fe(r,a,t,n){v.p=a,R=r,M=t,$=n}function w(r,a){let t=this||{};return function(){let n=arguments;function l(i,s){let d=Object.assign({},i),o=d.className||l.className;t.p=Object.assign({theme:M&&M()},d),t.o=/go\d/.test(o),d.className=I.apply(t,n)+(o?" "+o:"");let c=r;return r[0]&&(c=d.as||r,delete d.as),$&&c[0]&&$(d),R(c,d)}return l}}var be=r=>typeof r=="function",A=(r,a)=>be(r)?r(a):r,ge=(()=>{let r=0;return()=>(++r).toString()})(),he=(()=>{let r;return()=>{if(r===void 0&&typeof window<"u"){let a=matchMedia("(prefers-reduced-motion: reduce)");r=!a||a.matches}return r}})(),ye=20,B="default",G=(r,a)=>{let{toastLimit:t}=r.settings;switch(a.type){case 0:return{...r,toasts:[a.toast,...r.toasts].slice(0,t)};case 1:return{...r,toasts:r.toasts.map(s=>s.id===a.toast.id?{...s,...a.toast}:s)};case 2:let{toast:n}=a;return G(r,{type:r.toasts.find(s=>s.id===n.id)?1:0,toast:n});case 3:let{toastId:l}=a;return{...r,toasts:r.toasts.map(s=>s.id===l||l===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return a.toastId===void 0?{...r,toasts:[]}:{...r,toasts:r.toasts.filter(s=>s.id!==a.toastId)};case 5:return{...r,pausedAt:a.time};case 6:let i=a.time-(r.pausedAt||0);return{...r,pausedAt:void 0,toasts:r.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+i}))}}},je=[],Ne={toasts:[],pausedAt:void 0,settings:{toastLimit:ye}},k={},U=(r,a=B)=>{k[a]=G(k[a]||Ne,r),je.forEach(([t,n])=>{t===a&&n(k[a])})},Z=r=>Object.keys(k).forEach(a=>U(r,a)),ve=r=>Object.keys(k).find(a=>k[a].toasts.some(t=>t.id===r)),z=(r=B)=>a=>{U(a,r)},we=(r,a="blank",t)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:a,ariaProps:{role:"status","aria-live":"polite"},message:r,pauseDuration:0,...t,id:(t==null?void 0:t.id)||ge()}),F=r=>(a,t)=>{let n=we(a,r,t);return z(n.toasterId||ve(n.id))({type:2,toast:n}),n.id},p=(r,a)=>F("blank")(r,a);p.error=F("error");p.success=F("success");p.loading=F("loading");p.custom=F("custom");p.dismiss=(r,a)=>{let t={type:3,toastId:r};a?z(a)(t):Z(t)};p.dismissAll=r=>p.dismiss(void 0,r);p.remove=(r,a)=>{let t={type:4,toastId:r};a?z(a)(t):Z(t)};p.removeAll=r=>p.remove(void 0,r);p.promise=(r,a,t)=>{let n=p.loading(a.loading,{...t,...t==null?void 0:t.loading});return typeof r=="function"&&(r=r()),r.then(l=>{let i=a.success?A(a.success,l):void 0;return i?p.success(i,{id:n,...t,...t==null?void 0:t.success}):p.dismiss(n),l}).catch(l=>{let i=a.error?A(a.error,l):void 0;i?p.error(i,{id:n,...t,...t==null?void 0:t.error}):p.dismiss(n)}),r};var ke=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Se=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Fe=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ie=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ke} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Se} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${r=>r.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Fe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Ee=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ce=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${r=>r.secondary||"#e0e0e0"};
  border-right-color: ${r=>r.primary||"#616161"};
  animation: ${Ee} 1s linear infinite;
`,De=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Me=h`
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
}`,$e=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${De} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Me} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${r=>r.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Ae=w("div")`
  position: absolute;
`,Ye=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Pe=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ze=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Pe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Le=({toast:r})=>{let{icon:a,type:t,iconTheme:n}=r;return a!==void 0?typeof a=="string"?u.createElement(ze,null,a):a:t==="blank"?null:u.createElement(Ye,null,u.createElement(Ce,{...n}),t!=="loading"&&u.createElement(Ae,null,t==="error"?u.createElement(Ie,{...n}):u.createElement($e,{...n})))},Oe=r=>`
0% {transform: translate3d(0,${r*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,_e=r=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${r*-150}%,-1px) scale(.6); opacity:0;}
`,Ve="0%{opacity:0;} 100%{opacity:1;}",Te="0%{opacity:1;} 100%{opacity:0;}",He=w("div")`
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
`,Re=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Be=(r,a)=>{let t=r.includes("top")?1:-1,[n,l]=he()?[Ve,Te]:[Oe(t),_e(t)];return{animation:a?`${h(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(l)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};u.memo(({toast:r,position:a,style:t,children:n})=>{let l=r.height?Be(r.position||a||"top-center",r.visible):{opacity:0},i=u.createElement(Le,{toast:r}),s=u.createElement(Re,{...r.ariaProps},A(r.message,r));return u.createElement(He,{className:r.className,style:{...l,...t,...r.style}},typeof n=="function"?n({icon:i,message:s}):u.createElement(u.Fragment,null,i,s))});fe(u.createElement);I`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;const L="http://localhost:3000";function O(){const r=localStorage.getItem("token");return r?{Authorization:`Bearer ${r}`}:{}}async function Ge(){return(await P.get(`${L}/empresa`,{headers:O()})).data}async function Ue(r,a){return(await P.put(`${L}/empresa/${r}`,a,{headers:O()})).data}async function Ze(r){return(await P.post(`${L}/empresa`,r,{headers:O()})).data}const C={moneda:"COP",simboloMoneda:"$",zonaHoraria:"America/Bogota",formatoFecha:"DD/MM/YYYY",formatoHora:"12h",prefijoFacturas:"POS-",numeroInicialFacturas:"1",mensajePieFactura:"¡Gracias por su compra!",mostrarLogoFactura:!0,mostrarDireccionFactura:!0,mostrarTelefonoFactura:!0,iva:"IVA",porcentajeIva:"19",aplicarImpuestos:!1,stockMinimoDefecto:"5",permitirStockNegativo:!1,alertarStockBajo:!0,abrirVentaAutomaticamente:!0,imprimirFacturaAutomaticamente:!0,solicitarConfirmacionCobro:!0};function D({value:r,onChange:a,options:t,placeholder:n="Seleccione...",title:l}){const[i,s]=u.useState(!1),d=u.useRef(null);u.useEffect(()=>{function c(m){d.current&&!d.current.contains(m.target)&&s(!1)}return document.addEventListener("mousedown",c),()=>document.removeEventListener("mousedown",c)},[]);const o=t.find(c=>c.value===r);return e.jsxs("div",{ref:d,className:"relative w-full",children:[e.jsxs("button",{type:"button",onClick:()=>s(c=>!c),className:`
          w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-sm font-semibold
          transition-all duration-200 select-none
          ${i||r?"bg-primary/10 text-primary border-primary/30 shadow-sm":"bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"}
        `,children:[e.jsx("span",{className:"truncate",children:o?o.label:n}),e.jsx(J,{className:`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${i?"rotate-180 text-primary":""}`})]}),i&&e.jsxs("div",{className:"absolute left-0 top-full mt-2 w-full z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150",children:[e.jsx("div",{className:"px-3 pt-3 pb-1.5",children:e.jsx("p",{className:"text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",children:l})}),e.jsx("div",{className:"p-1.5 space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar",children:t.map(c=>{const m=c.value===r;return e.jsxs("button",{type:"button",onClick:()=>{a(c.value),s(!1)},className:`
                    w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left
                    transition-colors duration-150
                    ${m?"bg-primary text-primary-foreground font-semibold":"hover:bg-accent text-foreground"}
                  `,children:[e.jsx("span",{className:"truncate",children:c.label}),m&&e.jsx(ae,{className:"h-3.5 w-3.5 shrink-0 ml-2"})]},c.value)})})]})]})}function Ke(){const[r,a]=u.useState("general"),[t,n]=u.useState(!0),[l,i]=u.useState(!1),[s,d]=u.useState(null),{register:o,handleSubmit:c,control:m,reset:g}=K();u.useEffect(()=>{(async()=>{var x,S;try{const f=await Ge();d(f.id);const _=f.configuracion||C;g({nombre:f.nombre,nit:f.nit||"",direccion:f.direccion||"",telefono:f.telefono||"",correo:f.correo||"",logo:f.logo||"",ciudad:f.ciudad||"",configuracion:{...C,...typeof _=="object"?_:{}}})}catch(f){(((x=f.response)==null?void 0:x.status)===404||((S=f.response)==null?void 0:S.status)===500)&&g({nombre:"",nit:"",direccion:"",telefono:"",correo:"",logo:"",ciudad:"",configuracion:C})}finally{n(!1)}})()},[g]);const y=async b=>{i(!0);try{if(s)await Ue(s,b),p.success("Configuraciones guardadas");else{const x=await Ze(b);d(x.id),p.success("Empresa creada y configuraciones guardadas")}}catch{p.error("Error al guardar las configuraciones")}finally{i(!1)}},j=({icon:b,label:x,id:S})=>e.jsxs("button",{type:"button",onClick:()=>a(S),className:`
        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold
        ${r===S?"bg-primary/10 text-primary border border-primary/20 shadow-sm":"text-muted-foreground hover:bg-muted hover:text-foreground"}
      `,children:[e.jsx(b,{className:"h-4 w-4"}),x]});return t?e.jsx("div",{className:"flex items-center justify-center h-[calc(100vh-120px)]",children:e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-primary"})}):e.jsxs("form",{onSubmit:c(y),className:"h-[calc(100vh-120px)] flex flex-col",children:[e.jsx("div",{className:"flex items-start justify-between gap-4 flex-wrap mb-6",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("h1",{className:"text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",children:"Empresa"}),e.jsxs("div",{className:"inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1",children:[e.jsx(V,{className:"h-3 w-3 text-muted-foreground shrink-0"}),e.jsx("span",{className:"text-xs font-medium text-muted-foreground",children:"Configuración general del negocio."})]})]})]})}),e.jsxs("div",{className:"flex-1 flex gap-8 min-h-0",children:[e.jsxs("div",{className:"w-64 flex-shrink-0 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar",children:[e.jsx(j,{icon:V,label:"1. Información General",id:"general"}),e.jsx(j,{icon:ie,label:"2. Información Comercial",id:"comercial"}),e.jsx(j,{icon:q,label:"3. Facturación",id:"facturacion"}),e.jsx(j,{icon:le,label:"4. Impuestos (Futuro)",id:"impuestos"}),e.jsx(j,{icon:Q,label:"5. Inventario",id:"inventario"}),e.jsx(j,{icon:W,label:"6. Ventas",id:"ventas"}),e.jsx(j,{icon:se,label:"7. Respaldos (Futuro)",id:"respaldos"}),e.jsx(j,{icon:ee,label:"8. Información del Sistema",id:"sistema"})]}),e.jsxs("div",{className:"flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"flex-1 overflow-y-auto p-6 custom-scrollbar",children:[r==="general"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"1. Información General"}),e.jsxs("div",{className:"grid grid-cols-2 gap-5",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Nombre de la empresa"}),e.jsx("input",{...o("nombre"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"NIT"}),e.jsx("input",{...o("nit"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5 col-span-2",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Razón Social"}),e.jsx("input",{className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all",placeholder:"Igual al nombre si se deja vacío"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Correo"}),e.jsx("input",{...o("correo"),type:"email",className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Teléfono"}),e.jsx("input",{...o("telefono"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Dirección"}),e.jsx("input",{...o("direccion"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Ciudad"}),e.jsx("input",{...o("ciudad"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]})]})]}),r==="comercial"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"2. Información Comercial"}),e.jsxs("div",{className:"grid grid-cols-2 gap-5",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Moneda"}),e.jsx(E,{control:m,name:"configuracion.moneda",render:({field:{value:b,onChange:x}})=>e.jsx(D,{value:b,onChange:x,title:"Moneda",options:[{value:"COP",label:"Peso Colombiano (COP)"},{value:"USD",label:"Dólar Estadounidense (USD)"},{value:"EUR",label:"Euro (EUR)"}]})})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Símbolo"}),e.jsx("input",{...o("configuracion.simboloMoneda"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Zona Horaria"}),e.jsx(E,{control:m,name:"configuracion.zonaHoraria",render:({field:{value:b,onChange:x}})=>e.jsx(D,{value:b,onChange:x,title:"Zona Horaria",options:[{value:"America/Bogota",label:"America/Bogota (GMT-5)"}]})})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Formato de Fecha"}),e.jsx(E,{control:m,name:"configuracion.formatoFecha",render:({field:{value:b,onChange:x}})=>e.jsx(D,{value:b,onChange:x,title:"Formato de Fecha",options:[{value:"DD/MM/YYYY",label:"DD/MM/YYYY"},{value:"MM/DD/YYYY",label:"MM/DD/YYYY"},{value:"YYYY-MM-DD",label:"YYYY-MM-DD"}]})})]})]})]}),r==="facturacion"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"3. Facturación"}),e.jsxs("div",{className:"grid grid-cols-2 gap-5",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Prefijo Facturas"}),e.jsx("input",{...o("configuracion.prefijoFacturas"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Número Inicial"}),e.jsx("input",{...o("configuracion.numeroInicialFacturas"),className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-1.5 col-span-2",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Mensaje Pie de Factura"}),e.jsx("textarea",{...o("configuracion.mensajePieFactura"),rows:3,className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"})]}),e.jsxs("div",{className:"col-span-2 space-y-3 pt-4 border-t border-border/50",children:[e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",children:[e.jsx("input",{type:"checkbox",...o("configuracion.mostrarLogoFactura"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsx("span",{className:"text-xs font-semibold",children:"Mostrar Logo en factura"})]}),e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",children:[e.jsx("input",{type:"checkbox",...o("configuracion.mostrarDireccionFactura"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsx("span",{className:"text-xs font-semibold",children:"Mostrar Dirección en factura"})]}),e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",children:[e.jsx("input",{type:"checkbox",...o("configuracion.mostrarTelefonoFactura"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsx("span",{className:"text-xs font-semibold",children:"Mostrar Teléfono en factura"})]})]})]})]}),r==="impuestos"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"4. Impuestos (Futuro)"}),e.jsxs("div",{className:"grid grid-cols-2 gap-5 opacity-70 pointer-events-none",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Nombre de Impuesto"}),e.jsx("input",{defaultValue:"IVA",className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none transition-all"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Porcentaje (%)"}),e.jsx("input",{defaultValue:"19",className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none transition-all"})]}),e.jsxs("div",{className:"col-span-2 pt-2",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-3 block",children:"¿Aplicar impuestos?"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("label",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"radio",name:"imp",className:"text-primary"}),e.jsx("span",{className:"text-sm font-semibold",children:"Sí"})]}),e.jsxs("label",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"radio",name:"imp",defaultChecked:!0,className:"text-primary"}),e.jsx("span",{className:"text-sm font-semibold",children:"No"})]})]})]})]})]}),r==="inventario"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"5. Inventario"}),e.jsxs("div",{className:"grid gap-6",children:[e.jsxs("div",{className:"space-y-1.5 max-w-xs",children:[e.jsx("label",{className:"text-[10px] font-bold tracking-wider text-muted-foreground uppercase",children:"Stock mínimo por defecto"}),e.jsx("input",{...o("configuracion.stockMinimoDefecto"),type:"number",className:"w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"})]}),e.jsxs("div",{className:"space-y-4 pt-4 border-t border-border/50",children:[e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",children:[e.jsx("input",{type:"checkbox",...o("configuracion.permitirStockNegativo"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsxs("div",{className:"space-y-0.5",children:[e.jsx("span",{className:"text-xs font-semibold block",children:"Permitir stock negativo"}),e.jsx("span",{className:"text-[11px] text-muted-foreground block leading-tight",children:"Permite vender productos aunque no haya existencias en el sistema."})]})]}),e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",children:[e.jsx("input",{type:"checkbox",...o("configuracion.alertarStockBajo"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsx("span",{className:"text-xs font-semibold block",children:"Alertar stock bajo"})]})]})]})]}),r==="ventas"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"6. Ventas"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-border bg-muted/30",children:[e.jsx("input",{type:"checkbox",...o("configuracion.abrirVentaAutomaticamente"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsx("span",{className:"text-xs font-semibold",children:"Abrir venta automáticamente"})]}),e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-border bg-muted/30",children:[e.jsx("input",{type:"checkbox",...o("configuracion.imprimirFacturaAutomaticamente"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsx("span",{className:"text-xs font-semibold",children:"Imprimir factura después de cobrar"})]}),e.jsxs("label",{className:"flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-border bg-muted/30",children:[e.jsx("input",{type:"checkbox",...o("configuracion.solicitarConfirmacionCobro"),className:"w-4 h-4 rounded border-border text-primary focus:ring-primary"}),e.jsx("span",{className:"text-xs font-semibold",children:"Solicitar confirmación antes de cobrar"})]})]})]}),r==="respaldos"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"7. Respaldos (Futuro)"}),e.jsxs("div",{className:"p-5 rounded-2xl border border-border bg-muted/20 space-y-4",children:[e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Último respaldo: ",e.jsx("strong",{children:"Nunca"})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{type:"button",className:"px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs opacity-70 cursor-not-allowed",children:"Generar respaldo"}),e.jsx("button",{type:"button",className:"px-4 py-2 rounded-xl border border-border font-semibold text-xs opacity-70 cursor-not-allowed",children:"Restaurar respaldo"})]})]})]}),r==="sistema"&&e.jsxs("div",{className:"space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",children:[e.jsx("h2",{className:"text-lg font-bold",children:"8. Información del Sistema"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"p-3.5 rounded-xl bg-muted/30 border border-border",children:[e.jsx("p",{className:"text-[9px] uppercase font-bold text-muted-foreground mb-1 tracking-wider",children:"Versión SmartPOS"}),e.jsx("p",{className:"text-xs font-semibold text-foreground",children:"1.0.0-beta"})]}),e.jsxs("div",{className:"p-3.5 rounded-xl bg-muted/30 border border-border",children:[e.jsx("p",{className:"text-[9px] uppercase font-bold text-muted-foreground mb-1 tracking-wider",children:"Versión API"}),e.jsx("p",{className:"text-xs font-semibold text-foreground",children:"1.0.0-beta"})]}),e.jsxs("div",{className:"p-3.5 rounded-xl bg-muted/30 border border-border",children:[e.jsx("p",{className:"text-[9px] uppercase font-bold text-muted-foreground mb-1 tracking-wider",children:"Base de datos"}),e.jsx("p",{className:"text-xs font-semibold text-foreground",children:"PostgreSQL"})]}),e.jsxs("div",{className:"p-3.5 rounded-xl bg-muted/30 border border-border",children:[e.jsx("p",{className:"text-[9px] uppercase font-bold text-muted-foreground mb-1 tracking-wider",children:"Servidor"}),e.jsx("p",{className:"text-xs font-semibold text-foreground",children:"Localhost (Node.js)"})]}),e.jsxs("div",{className:"p-3.5 rounded-xl bg-muted/30 border border-border",children:[e.jsx("p",{className:"text-[9px] uppercase font-bold text-muted-foreground mb-1 tracking-wider",children:"Fecha instalación"}),e.jsx("p",{className:"text-xs font-semibold text-foreground",children:"01/01/2026"})]}),e.jsxs("div",{className:"p-3.5 rounded-xl bg-muted/30 border border-border",children:[e.jsx("p",{className:"text-[9px] uppercase font-bold text-muted-foreground mb-1 tracking-wider",children:"Última actualización"}),e.jsx("p",{className:"text-xs font-semibold text-foreground",children:"Hace 2 horas"})]})]})]})]}),e.jsxs("div",{className:"p-4 border-t border-border bg-muted/30 flex justify-end gap-3 shrink-0",children:[e.jsxs("button",{type:"button",onClick:()=>{window.location.reload()},className:"px-4 py-2.5 rounded-xl border border-border hover:bg-muted font-semibold text-xs transition-all duration-150 flex items-center gap-2",children:[e.jsx(X,{className:"h-4 w-4"})," Cancelar"]}),e.jsxs("button",{type:"submit",disabled:l,className:"px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs transition-all duration-150 flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-70",children:[e.jsx(re,{className:"h-4 w-4"}),l?"Guardando...":"Guardar Cambios"]})]})]})]})]})}export{Ke as default};
