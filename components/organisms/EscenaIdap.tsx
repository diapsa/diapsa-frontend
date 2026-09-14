"use client";

import { useEffect, useRef } from "react";
import { montarIdap } from "@/lib/idap-escena";

/**
 * EscenaIdap
 * Recreación animada de la pantalla de una inspección integral en IDAP:
 * la inspección llega desde campo, las tres disciplinas se llenan con sus
 * valores, se califican en semáforo, se abre la pestaña de la disciplina
 * de la página y termina en la recomendación. Pasar el cursor por una
 * tarjeta de disciplina abre su pestaña.
 *
 * Origen: docs/designs/IDAP inspeccion.html, generado en Claude Diseño con
 * cuatro ajustes (recomendación completa, pestaña de termografía con las
 * imágenes reales, osciloscopio de ultrasonido y espectros de vibración).
 * El marcado y el CSS se toman del diseño tal cual; el CSS viene con todos
 * los selectores acotados a `.idap` para que sus clases genéricas (.card,
 * .badge, .tab, .row) no toquen el resto del sitio. La lógica vive en
 * lib/idap-escena.js.
 *
 * Los valores son los de una inspección real de un motor; no aparece
 * ningún nombre de planta ni de cliente. Con prefers-reduced-motion se
 * muestra el estado final sin conteos ni deslizamientos.
 */

type Props = {
  /** Pestaña que se abre sola en el bucle: la disciplina de la página. */
  disciplina?: "term" | "vib" | "us";
  /** Fotografías térmicas reales para los huecos de la pestaña de termografía. */
  imagenes?: { principal?: string; miniaturas?: string[]; visual?: string };
};

const CSS = `.idap-wrap{container-type:inline-size;width:100%;max-width:1024px;margin:0 auto}
.idap{position:relative;aspect-ratio:1024/650;overflow:hidden;background:#0b0f19;color:#fff;
  font-family:Geist,Inter,"Segoe UI",system-ui,-apple-system,sans-serif;font-size:1.5625cqw;line-height:1.3;
  box-sizing:border-box;padding:1.5em;display:flex;flex-direction:column;gap:1em;
  --line:rgba(255,255,255,.08);--card:#111827;--mut:#c5cbd2;--dim:#8b939e;--sk:#1c2434;
  --g:#22c55e;--y:#facc15;--r:#ef4444;--b:#38bdf8;--o:#fc9f01;--or:#f97316;
  font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}
.idap *{box-sizing:border-box}
.idap.noanim *{transition:none!important;animation:none!important}
@media (prefers-reduced-motion: reduce){.idap, .idap *{transition:none!important;animation:none!important}}
@keyframes fadeUp{from{opacity:0;transform:translateY(.5em)}}
@keyframes fadeIn{from{opacity:0}}
@keyframes draw{from{stroke-dashoffset:1}}
@keyframes rise{from{bottom:0}}
@keyframes drop{from{opacity:0;transform:translate(-50%,-1em)}}
@keyframes growX{from{transform:scaleX(0)}}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(255,255,255,.8)}100%{box-shadow:0 0 0 .7em rgba(255,255,255,0)}}
.idap .hd{display:flex;align-items:flex-end;justify-content:space-between;gap:1em}
.idap .hd h1{margin:0;font-size:1.25em;font-weight:600;letter-spacing:-.01em}
.idap .hd .sub{margin-top:.2em;color:var(--mut);font-size:.8125em;display:flex;gap:.5em;align-items:center}
.idap .hd .sub .dot{width:.25em;height:.25em;border-radius:50%;background:var(--dim)}
.idap .badges{display:flex;gap:.5em;flex-wrap:wrap}
.idap .badge{font-size:.6875em;font-weight:600;padding:.35em .7em;border-radius:999px;border:1px solid var(--line);color:var(--mut);white-space:nowrap;line-height:1}
.idap .badge.r{color:var(--r);border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.1)}
.idap .badge.y{color:var(--y);border-color:rgba(250,204,21,.35);background:rgba(250,204,21,.1)}
.idap .badge.g{color:var(--g);border-color:rgba(34,197,94,.35);background:rgba(34,197,94,.1)}
.idap .toast{position:absolute;top:1em;left:50%;transform:translate(-50%,-160%);opacity:0;display:flex;align-items:center;gap:.5em;
  background:var(--card);border:1px solid var(--line);border-radius:999px;padding:.5em .9em;font-size:.75em;color:var(--mut);
  transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .35s;z-index:5;pointer-events:none;box-shadow:0 .5em 1.5em rgba(0,0,0,.4)}
.idap .toast.in{transform:translate(-50%,0);opacity:1}
.idap .toast svg{width:1.2em;height:1.2em;color:var(--b)}
.idap .toast.in svg{animation:spin .9s linear 2}
@keyframes spin{to{transform:rotate(360deg)}}
.idap .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1em}
.idap .card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:.875em 1em;display:flex;flex-direction:column;gap:.55em;cursor:pointer;
  transition:border-color .2s,background .2s;position:relative}
.idap .card:hover, .idap .card.active{border-color:rgba(255,255,255,.18);background:#141c2c}
.idap .card .lab{display:flex;align-items:center;justify-content:space-between;font-size:.75em;color:var(--mut);font-weight:500}
.idap .card .lab svg{width:1.25em;height:1.25em;color:var(--dim)}
.idap .card .vals{display:flex;align-items:baseline;gap:.75em;min-height:1.6em;flex-wrap:wrap;white-space:nowrap}
.idap .card .v{font-size:1.25em;font-weight:600;letter-spacing:-.01em;line-height:1.1}
.idap .card .s{font-size:.75em;color:var(--dim)}
.idap .card .st{min-height:1.5em;display:flex}
.idap .card .badge{opacity:0;transform:scale(.6)}
.idap .card .badge.pop{animation:pop .5s cubic-bezier(.34,1.56,.64,1) forwards}
@keyframes pop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
.idap .sk{display:inline-block;height:.9em;border-radius:.3em;background:var(--sk);vertical-align:middle}
.idap .card .v .sk{width:3.6em;height:1em}
.idap .card .s .sk{width:5em;height:.8em}
.idap .card .st .sk{width:4.5em;height:1.3em;border-radius:999px}
.idap .card.on .sk, .idap .on>.sk{display:none}
.idap .card .v .n, .idap .card .s .n{display:none}
.idap .card.on .n{display:inline}
.idap .tabs{display:flex;gap:1.5em;border-bottom:1px solid var(--line);font-size:.8125em}
.idap .tab{padding:.6em 0;color:var(--dim);position:relative;cursor:pointer;transition:color .25s;background:none;border:0;font:inherit;font-weight:500}
.idap .tab::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:#fff;transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.idap .tab.active{color:#fff}
.idap .tab.active::after{transform:scaleX(1)}
.idap .panel{flex:1;min-height:0;position:relative;overflow:hidden}
.idap .pane{display:none;height:100%}
.idap .pane.show{display:block}
.idap .grid3{display:grid;grid-template-columns:1.55fr 1fr 1.15fr;gap:1em;height:100%}
.idap .blk{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:.875em 1em;display:flex;flex-direction:column;gap:.75em;min-width:0}
.idap .blk h3{margin:0;font-size:.75em;font-weight:500;color:var(--mut);display:flex;align-items:center;gap:.5em}
.idap .blk h3 svg{width:1.2em;height:1.2em;color:var(--dim)}
.idap .th{display:flex;align-items:center;justify-content:space-between;gap:.75em}
.idap .pt{display:flex;flex-direction:column;gap:.4em}
.idap .pt .pl{font-size:.6875em;color:var(--dim)}
.idap .tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5em}
.idap .tiles.one{grid-template-columns:1fr}
.idap .tile{border-radius:8px;border:1px solid var(--line);background:var(--sk);padding:.5em .6em;display:flex;flex-direction:column;gap:.15em;min-height:3.4em;
  transition:background .35s,border-color .35s}
.idap .tile .k{font-size:.625em;color:var(--dim);font-weight:600;letter-spacing:.06em}
.idap .tile .val{font-size:1em;font-weight:600;opacity:0;transition:opacity .3s;line-height:1.1}
.idap .tile .val small{font-size:.65em;font-weight:500;color:var(--mut);margin-left:.25em}
.idap .tile.on .val{opacity:1}
.idap .tile.on.g{background:rgba(34,197,94,.14);border-color:rgba(34,197,94,.45)}
.idap .tile.on.g .val, .idap .tile.on.g .k{color:var(--g)}
.idap .tile.on.y{background:rgba(250,204,21,.14);border-color:rgba(250,204,21,.5)}
.idap .tile.on.y .val, .idap .tile.on.y .k{color:var(--y)}
.idap .tile.on.r{background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.5)}
.idap .tile.on.r .val, .idap .tile.on.r .k{color:var(--r)}
.idap .tile.on.pink .val{color:#f87171}
.idap .tile.on.rbd{border-color:rgba(239,68,68,.6)}
.idap .spec{flex:1;min-height:0;display:flex;flex-direction:column;gap:.3em;border-top:1px solid var(--line);padding-top:.55em;position:relative}
.idap .sgraph{flex:1;min-height:3.2em;position:relative}
.idap .sgraph svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.idap .sgraph .bar, .idap .sgraph .pk{transform-box:fill-box;transform-origin:bottom}
.idap .spec:not(.on) .bar{transform:scaleY(0)}
.idap .spec:not(.pk-on) .pk{transform:scaleY(0)}
.idap .spec.on .bar{animation:growY .3s ease-out both;animation-delay:calc(var(--i)*25ms)}
.idap .spec.pk-on .pk{animation:bounceY .55s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--j)*80ms)}
@keyframes growY{from{transform:scaleY(0)}}
@keyframes bounceY{from{transform:scaleY(0)}}
.idap .sgraph .lim{stroke:rgba(255,255,255,.35);stroke-dasharray:4 4;stroke-width:1;vector-effect:non-scaling-stroke}
.idap .sgraph .lbl{position:absolute;font-size:.5625em;color:var(--dim);line-height:1;white-space:nowrap}
.idap .sgraph .lim-l{right:0;transform:translateY(-110%)}
.idap .sgraph .pkl{transform:translate(-50%,-115%)}
.idap .saxis{display:flex;justify-content:space-between;align-items:flex-start;gap:.5em;border-top:1px solid rgba(255,255,255,.15);padding-top:.25em;font-size:.5625em;color:var(--dim);min-height:1.2em}
.idap .saxis .fx{margin-left:auto}
.idap .brk{position:relative;flex:1;max-width:57%;margin-left:18%;height:.5em;border:1px solid var(--dim);border-top:0;border-radius:0 0 .25em .25em}
.idap .brk span{position:absolute;left:50%;top:100%;transform:translateX(-50%);white-space:nowrap;padding-top:.2em}
.idap .spec.hl .pk{filter:brightness(1.35) drop-shadow(0 0 3px rgba(250,204,21,.8))}
.idap .reco{transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .4s,box-shadow .3s}
.idap .reco.hl{box-shadow:0 0 0 2px var(--o),0 0 1em rgba(252,159,1,.45)}
.idap .tile.pulse{animation:pulse .65s ease-in-out 2}
@keyframes pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(250,204,21,0)}50%{transform:scale(1.04);box-shadow:0 0 0 .4em rgba(250,204,21,.18)}}
.idap .ref{font-size:.6875em;color:var(--dim)}
.idap .th .ref{white-space:nowrap;flex:none}
.idap .rows{display:flex;flex-direction:column}
.idap .row{display:flex;justify-content:space-between;align-items:baseline;gap:.75em;padding:.42em 0;border-bottom:1px solid var(--line);font-size:.75em}
.idap .row:last-child{border-bottom:0}
.idap .row>span:first-child{color:var(--dim)}
.idap .row b{font-weight:600;text-align:right}
.idap .rows.big .row b{font-size:1.2em}
.idap .rows.big .row{padding:.3em 0}
.idap .red{color:var(--r)}
.idap .yy{color:var(--y);font-weight:600}
.idap .ghost{white-space:nowrap;flex:none;background:none;border:1px solid var(--line);color:var(--mut);border-radius:8px;padding:.4em .75em;font:inherit;font-size:.6875em;cursor:pointer}
.idap .circ{width:1.75em;height:1.75em;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--mut);display:grid;place-items:center;padding:0;cursor:pointer;flex:none}
.idap .circ svg{width:.9em;height:.9em}
.idap .reco{border:1px solid var(--o);background:var(--card);border-radius:12px;padding:.875em 1em;display:flex;flex-direction:column;gap:.55em;
  transform:translateX(120%);opacity:0;transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .4s;min-width:0}
.idap .reco.in{transform:none;opacity:1}
.idap .reco .eyebrow, .idap .reco .rl{display:block;font-size:.6875em;color:var(--o);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.3em}
.idap .reco .rl{color:var(--dim)}
.idap .reco p{margin:0;font-size:.875em;font-weight:500;line-height:1.35;text-wrap:pretty}
.idap .reco p.why{font-size:.75em;font-weight:400;color:var(--mut)}
.idap .reco .row{padding:.32em 0;font-size:.6875em}
.idap .reco .trend{display:block;width:100%;height:2.2em;overflow:visible}
.idap .reco .rb{opacity:0}
.idap .reco.in .rb{opacity:1;animation:fadeUp .4s ease-out both;animation-delay:calc(.6s + var(--i)*.2s)}
.idap .reco.in .trend polyline{stroke-dasharray:1;stroke-dashoffset:0;animation:draw .9s ease-out both;animation-delay:1.35s}
.idap .reco.in .trend circle{animation:fadeIn .3s both;animation-delay:2.15s}
.idap .reco .st{margin-top:auto}
.idap .pane[data-pane=term]{font-size:.95em}
.idap .tgrid{display:grid;grid-template-columns:2fr 1fr;grid-template-rows:minmax(0,1fr) auto;gap:.75em;height:100%}
.idap .pane .blk{padding:.7em .875em;gap:.6em}
.idap .tspots{grid-column:1/-1}
.idap .vwrap{display:flex;align-items:center;justify-content:center;gap:.6em}
.idap .viewer{position:relative;height:8.4em;aspect-ratio:4/3;background:#000;border-radius:10px;overflow:hidden;flex:none}
.idap .pat{position:absolute;inset:0;background:
  radial-gradient(ellipse 28% 30% at 55% 45%,#ef4444 0,#f97316 30%,rgba(250,204,21,.9) 55%,rgba(34,197,94,.6) 80%,transparent 100%),
  radial-gradient(ellipse 60% 45% at 45% 55%,#22c55e 0,#0ea5e9 45%,#1e3a8a 75%,#0a0f2a 100%),#0a0f2a}
.idap .thumb .pat{background:radial-gradient(ellipse 45% 40% at 55% 45%,#f97316 0,#facc15 35%,#22c55e 60%,#1e3a8a 100%)}
.idap .viewer img, .idap .thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block}
.idap img[data-slot]:not([src]){display:none}
.idap .viewer:has(img[src]) .pat, .idap .thumb:has(img[src]) .pat{display:none}
.idap .scale{position:absolute;top:.45em;right:.45em;display:flex;flex-direction:column;align-items:center;gap:.2em;font-size:.5625em;font-weight:600;text-shadow:0 0 .3em #000}
.idap .scale i{width:.7em;height:6em;border-radius:.3em;background:linear-gradient(to top,#1d4ed8,#22c55e,#facc15,#ef4444,#fff)}
.idap .mark{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;font-size:.5625em}
.idap .mark .dot{width:1em;height:1em;border-radius:50%;border:2px solid #fff;background:rgba(0,0,0,.35);flex:none}
.idap .mark .ln{width:1.4em;height:1px;background:#fff}
.idap .mark span{background:rgba(0,0,0,.6);color:#fff;padding:.25em .5em;border-radius:.3em;white-space:nowrap;font-weight:600}
.idap .thumbs{display:flex;gap:.5em;justify-content:center}
.idap .thumb{position:relative;width:3.6em;aspect-ratio:4/3;border-radius:6px;overflow:hidden;background:#000;border:1px solid var(--line)}
.idap .thumb.sel{border:2px solid var(--o)}
.idap .thumb.vis{display:none}
.idap .thumb.vis.has{display:block}
.idap .thumb.vis span{position:absolute;left:0;right:0;bottom:0;font-size:.5em;text-align:center;background:rgba(0,0,0,.6);padding:.2em}
.idap .pgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6em}
.idap .pane .blk .tile{min-height:0;padding:.45em .6em}
.idap .pane[data-pane=term].show .viewer{animation:fadeIn .4s both}
.idap .pane[data-pane=term].show .mark{animation:fadeIn .3s .35s both}
.idap .pane[data-pane=term].show .mark .dot{animation:ping .8s .45s 2}
.idap .pane[data-pane=term].show .thumb{animation:fadeUp .35s both;animation-delay:calc(.55s + var(--i)*.12s)}
.idap .pane[data-pane=term].show .tright .row{animation:fadeUp .35s both;animation-delay:calc(.8s + var(--i)*.1s)}
.idap .pane[data-pane=term].show .tspots .tile{animation:fadeUp .35s both;animation-delay:calc(1.3s + var(--i)*.1s)}
.idap .pane[data-pane=us]{font-size:.92em}
.idap .ugrid{display:grid;grid-template-columns:1fr 1.25fr .8fr;grid-template-rows:auto minmax(0,1fr) auto;gap:.65em;height:100%}
.idap .uwave, .idap .usev{grid-column:1/-1}
.idap .wrow{display:flex;gap:.9em;align-items:stretch}
.idap .scope{height:5.6em;aspect-ratio:3/1;background:#070b16;border:1px solid var(--line);border-radius:8px;overflow:hidden;flex:none;cursor:crosshair}
.idap .scope canvas{display:block;width:100%;height:100%}
.idap .legend{display:flex;flex-direction:column;gap:.35em;justify-content:center;font-size:.6875em;color:var(--mut);min-width:0}
.idap .legend div{display:flex;align-items:center;gap:.45em}
.idap .legend i{width:1.2em;height:2px;border-radius:1px;display:inline-block}
.idap .legend .ref{font-size:.9em;margin-top:.3em;text-wrap:pretty}
.idap .uread{gap:.45em}
.idap .uread .tile{flex:none;min-height:auto}
.idap .bar{height:.4em;border-radius:999px;background:#0b0f19;overflow:hidden;margin-top:.3em}
.idap .bar i{display:block;height:100%;border-radius:999px;background:var(--r)}
.idap .uind .row{padding:.3em 0;font-size:.7em}
.idap .uind .row b{display:flex;align-items:center;gap:.5em}
.idap .uind .row .ref{font-weight:400;font-size:.85em}
.idap .uind .badge{font-size:.85em}
.idap .meter{display:flex;gap:.5em;align-items:stretch;flex:1;min-height:5em}
.idap .mticks{position:relative;width:1.4em;font-size:.6em;color:var(--dim)}
.idap .mticks span{position:absolute;right:0;transform:translateY(50%)}
.idap .mbar{position:relative;width:1.4em;border-radius:.4em;overflow:visible;display:flex;flex-direction:column-reverse}
.idap .mbar .b{display:block;width:100%}
.idap .mbar .b.g{height:22.9%;background:var(--g);border-radius:0 0 .4em .4em}
.idap .mbar .b.y{height:22.8%;background:var(--y)}
.idap .mbar .b.o{height:22.9%;background:var(--or)}
.idap .mbar .b.r{height:31.4%;background:var(--r);border-radius:.4em .4em 0 0}
.idap .needle{position:absolute;left:-.3em;right:-.3em;bottom:91.4%;height:2px;background:#fff;box-shadow:0 0 .3em rgba(0,0,0,.8)}
.idap .needle span{position:absolute;left:calc(100% + .5em);top:50%;transform:translateY(-50%);font-size:.7em;font-weight:600;white-space:nowrap}
.idap .umeter{align-items:stretch}
.idap .sev{position:relative;padding-top:1.7em}
.idap .segs{display:flex;height:1.7em;border-radius:.4em;overflow:hidden;transform-origin:left}
.idap .segs span{flex:1;display:flex;align-items:center;justify-content:center;font-size:.5625em;font-weight:600;color:#0b0f19;text-align:center;padding:0 .3em;line-height:1.1}
.idap .segs span:nth-child(1){background:var(--g)}
.idap .segs span:nth-child(2){background:var(--y)}
.idap .segs span:nth-child(3){background:var(--or)}
.idap .segs span:nth-child(4){background:var(--r);color:#fff}
.idap .smark{position:absolute;top:0;left:87%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;font-size:.625em;font-weight:600}
.idap .smark i{width:0;height:0;border-left:.5em solid transparent;border-right:.5em solid transparent;border-top:.6em solid #fff;margin-top:.15em}
.idap .pane[data-pane=us].show .uread .tile{animation:fadeUp .35s both;animation-delay:calc(.2s + var(--i)*.15s)}
.idap .pane[data-pane=us].show .uind .row{animation:fadeUp .35s both;animation-delay:calc(.5s + var(--i)*.1s)}
.idap .pane[data-pane=us].show .needle{animation:rise 1s cubic-bezier(.2,.8,.2,1) both;animation-delay:1s}
.idap .pane[data-pane=us].show .segs{animation:growX .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:2.05s}
.idap .pane[data-pane=us].show .smark{animation:drop .45s cubic-bezier(.34,1.56,.64,1) both;animation-delay:2.6s}
@container (max-width:699px){.idap{aspect-ratio:auto;font-size:14px;padding:1em;gap:.875em}
.idap .hd{flex-direction:column;align-items:flex-start;gap:.6em}
.idap .cards{grid-template-columns:1fr}
.idap .panel{overflow:visible}
.idap .grid3, .idap .tgrid, .idap .ugrid{grid-template-columns:1fr;grid-template-rows:none;height:auto}
.idap .tspots, .idap .uwave, .idap .usev{grid-column:auto}
.idap .pgrid{grid-template-columns:1fr 1fr}
.idap .wrow{flex-direction:column}
.idap .scope{width:100%;height:auto}
.idap .meter{min-height:8em}
.idap .reco{transform:translateY(40%)}
.idap .tabs{gap:1em;overflow-x:auto;overflow-y:hidden;padding-bottom:1px}}`;

const MARCADO = `<div class="idap" id="idap" role="img" aria-label="Inspección integral del equipo Motor en IDAP: termografía en alarma, vibraciones en precaución, ultrasonido en alarma. Recomendación: programar cambio de rodamiento del lado de carga en la próxima ventana de producción.">

  <div class="toast" id="toast" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"></path><path d="M3 21v-5h5"></path><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"></path><path d="M21 3v5h-5"></path></svg>
    Inspección recibida desde campo
  </div>

  <header class="hd">
    <div>
      <h1>Inspección integral</h1>
      <div class="sub"><span>Motor</span><span class="dot"></span><span>14 mar 2026 · 10:32</span></div>
    </div>
    <div class="badges">
      <span class="badge">Integral</span>
      <span class="badge">3 disciplinas evaluadas</span>
      <span class="badge r">Alarma</span>
    </div>
  </header>

  <div class="cards" id="cards">
    <div class="card" data-tab="term" tabindex="0">
      <div class="lab">Termografía
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg></div>
      <div class="vals">
        <span class="v"><span class="sk"></span><span class="n">T máx. <b data-count="91.4" data-dec="1">0.0</b> °C</span></span>
        <span class="s"><span class="sk"></span><span class="n">Ambiente <b data-count="28.0" data-dec="1">0.0</b> °C</span></span>
      </div>
      <div class="st"><span class="sk"></span><span class="badge r">Alarma</span></div>
    </div>
    <div class="card" data-tab="vib" tabindex="0">
      <div class="lab">Vibraciones
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h3l3-8 4 16 4-12 2 4h4"></path></svg></div>
      <div class="vals">
        <span class="v"><span class="sk"></span><span class="n"><b data-count="6" data-dec="0">0</b> lecturas</span></span>
        <span class="s"><span class="sk"></span><span class="n"><b data-count="1.3" data-dec="1">0.0</b> mm/s</span></span>
      </div>
      <div class="st"><span class="sk"></span><span class="badge y">Precaución</span></div>
    </div>
    <div class="card" data-tab="us" tabindex="0">
      <div class="lab">Ultrasonido
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18.5 5.5a9 9 0 0 1 0 13"></path></svg></div>
      <div class="vals">
        <span class="v"><span class="sk"></span><span class="n"><b data-count="2" data-dec="0">0</b> puntos medidos</span></span>
        <span class="s"><span class="sk"></span><span class="n"><b data-count="47" data-dec="0">0</b> dB</span></span>
      </div>
      <div class="st"><span class="sk"></span><span class="badge r">Alarma</span></div>
    </div>
  </div>

  <nav class="tabs" id="tabs">
    <button class="tab active" data-tab="res">Resumen</button>
    <button class="tab" data-tab="term">Termografía</button>
    <button class="tab" data-tab="vib">Vibraciones</button>
    <button class="tab" data-tab="us">Ultrasonido</button>
  </nav>

  <div class="panel" id="panel">
    <!-- Vibraciones / Resumen -->
    <div class="pane show" data-pane="vib">
      <div class="grid3">
        <div class="blk">
          <h3>Amplitud global (Velocidad)</h3>
          <div class="pt"><span class="pl">Punto 1</span>
            <div class="tiles">
              <div class="tile g" data-vel="0"><span class="k">A</span><span class="val">0.418<small>mm/s</small></span></div>
              <div class="tile g" data-vel="1"><span class="k">H</span><span class="val">1.13<small>mm/s</small></span></div>
              <div class="tile g" data-vel="2"><span class="k">V</span><span class="val">0.759<small>mm/s</small></span></div>
            </div></div>
          <div class="pt"><span class="pl">Punto 2</span>
            <div class="tiles">
              <div class="tile g" data-vel="3"><span class="k">A</span><span class="val">1.23<small>mm/s</small></span></div>
              <div class="tile g" data-vel="4"><span class="k">H</span><span class="val">1.12<small>mm/s</small></span></div>
              <div class="tile g" data-vel="5"><span class="k">V</span><span class="val">1.25<small>mm/s</small></span></div>
            </div></div>
          <div class="spec" id="specV">
            <span class="ref">Espectro de velocidad, punto 2 dirección H</span>
            <div class="sgraph">
              <svg viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true"><g class="bars"></g><line class="lim" x1="0" x2="400" y1="33.3" y2="33.3"></line></svg>
              <span class="lbl lim-l" style="top:33.3%">alarma</span>
              <span class="lbl pkl" style="left:16.25%;top:42%">1x</span>
              <span class="lbl pkl" style="left:31.25%;top:58%">2x</span>
              <span class="lbl pkl" style="left:46.25%;top:70%">3x</span>
            </div>
            <div class="saxis"><span class="fx">Frecuencia</span></div>
          </div>
        </div>
        <div class="blk">
          <h3>Amplitud global (Aceleración)</h3>
          <div class="pt"><span class="pl">Punto 1</span>
            <div class="tiles one"><div class="tile g" id="acc1"><span class="k">RMS</span><span class="val">0.38<small>g</small></span></div></div></div>
          <div class="pt"><span class="pl">Punto 2</span>
            <div class="tiles one"><div class="tile y" id="acc2"><span class="k">RMS</span><span class="val">1.49<small>g</small></span></div></div></div>
          <div class="spec" id="specA">
            <span class="ref">Espectro envolvente, punto 2</span>
            <div class="sgraph">
              <svg viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true"><g class="bars"></g><line class="lim" x1="0" x2="400" y1="33.3" y2="33.3"></line><g class="pks"></g></svg>
              <span class="lbl lim-l" style="top:33.3%">precaución</span>
              <span class="lbl pkl" style="left:18.75%;top:20%">BPFO</span>
            </div>
            <div class="saxis"><div class="brk"><span>Armónicos de falla de rodamiento</span></div><span class="fx">Frecuencia</span></div>
          </div>
        </div>
        <aside class="reco" id="reco">
          <div class="rb" style="--i:0">
            <span class="eyebrow">Recomendación</span>
            <p>Programar cambio de rodamiento del lado de carga en la próxima ventana de producción</p>
          </div>
          <div class="rb" style="--i:1">
            <span class="rl">Por qué</span>
            <p class="why">Aceleración RMS de <b class="yy">1.49 g</b> en el punto 2, por encima del criterio de precaución de 0.90 g</p>
          </div>
          <div class="rb rows" style="--i:2">
            <div class="row"><span>Componente</span><b>Rodamiento, lado de carga</b></div>
            <div class="row"><span>Urgencia</span><b>Próxima ventana de producción</b></div>
            <div class="row"><span>Seguimiento</span><b>Reinspección en 30 días</b></div>
          </div>
          <div class="rb" style="--i:3">
            <span class="rl">Tendencia</span>
            <svg class="trend" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="tg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#22c55e"></stop><stop offset=".72" stop-color="#22c55e"></stop><stop offset="1" stop-color="#facc15"></stop></linearGradient></defs>
              <polyline pathLength="1" points="4,29 27,27 50,25.5 73,22.5 96,18 116,7" fill="none" stroke="url(#tg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
              <circle cx="116" cy="7" r="3" fill="#facc15"></circle>
            </svg>
            <span class="ref">Últimas 6 inspecciones</span>
          </div>
          <div class="rb st" style="--i:4"><span class="badge y">Precaución</span></div>
        </aside>
      </div>
    </div>

    <!-- Termografía -->
    <div class="pane" data-pane="term">
      <div class="tgrid">
        <div class="blk tleft">
          <div class="th">
            <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg>Termografía</h3>
            <button class="ghost" type="button">Abrir evidencia</button>
          </div>
          <div class="vwrap">
            <button class="circ" type="button" aria-label="Anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"></path></svg></button>
            <div class="viewer">
              <div class="pat"></div>
              <img data-slot="termica-principal" alt="Imagen térmica principal">
              <div class="scale"><span>91.4 °C</span><i></i><span>28.0 °C</span></div>
              <div class="mark" style="left:55%;top:45%"><i class="dot"></i><i class="ln"></i><span>P1 91.4 °C</span></div>
            </div>
            <button class="circ" type="button" aria-label="Siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"></path></svg></button>
          </div>
          <div class="thumbs">
            <div class="thumb sel" style="--i:0"><div class="pat"></div><img data-slot="termica-1" alt=""></div>
            <div class="thumb" style="--i:1"><div class="pat"></div><img data-slot="termica-2" alt=""></div>
            <div class="thumb" style="--i:2"><div class="pat"></div><img data-slot="termica-3" alt=""></div>
            <div class="thumb vis" id="thVis" style="--i:3"><img data-slot="visual" alt=""><span>A simple vista</span></div>
          </div>
        </div>
        <div class="blk tright">
          <h3>Indicadores principales</h3>
          <div class="rows big">
            <div class="row" style="--i:0"><span>Temperatura máxima</span><b class="red">91.4 °C</b></div>
            <div class="row" style="--i:1"><span>Temperatura mínima</span><b>—</b></div>
            <div class="row" style="--i:2"><span>Temperatura ambiente</span><b>28.0 °C</b></div>
            <div class="row" style="--i:3"><span>Emisividad utilizada</span><b>0.87</b></div>
            <div class="row" style="--i:4"><span>Distancia de captura</span><b>2.00 m</b></div>
          </div>
        </div>
        <div class="blk tspots">
          <div class="th"><h3>Valores de spots</h3><span class="ref">4 puntos marcados</span></div>
          <div class="pgrid">
            <div class="tile on pink" style="--i:0"><span class="k">LADO LIBRE</span><span class="val">56.6<small>°C</small></span></div>
            <div class="tile on pink" style="--i:1"><span class="k">BOBINADO/CUERPO</span><span class="val">54.2<small>°C</small></span></div>
            <div class="tile on pink rbd" style="--i:2"><span class="k">L. CARGA</span><span class="val">91.4<small>°C</small></span></div>
            <div class="tile on pink" style="--i:3"><span class="k">EJE</span><span class="val">60.9<small>°C</small></span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ultrasonido -->
    <div class="pane" data-pane="us">
      <div class="ugrid">
        <div class="blk uwave">
          <h3>Forma de onda</h3>
          <div class="wrow">
            <div class="scope" id="scope"><canvas id="cv" aria-hidden="true"></canvas></div>
            <div class="legend">
              <div><i style="background:var(--g)"></i>Línea base 15 dB</div>
              <div><i style="background:var(--r)"></i>Punto 1, 47 dB</div>
              <span class="ref">Impactos periódicos, patrón típico de rodamiento dañado</span>
            </div>
          </div>
        </div>
        <div class="blk uread">
          <div class="tile on r" style="--i:0"><span class="k">PUNTO 1</span><span class="val">47<small>dB</small></span><div class="bar"><i style="width:100%"></i></div><span class="ref">Referencia 23 dB</span></div>
          <div class="tile on r" style="--i:1"><span class="k">PUNTO 2</span><span class="val">47<small>dB</small></span><div class="bar"><i style="width:100%"></i></div><span class="ref">Referencia 23 dB</span></div>
        </div>
        <div class="blk uind">
          <h3>Indicadores principales</h3>
          <div class="rows">
            <div class="row" style="--i:0"><span>Nivel máximo</span><b><span class="red">47.0 dB</span><span class="ref">Ref. ≤ 23 dB</span></b></div>
            <div class="row" style="--i:1"><span>Línea base del componente</span><b>15 dB</b></div>
            <div class="row" style="--i:2"><span>Puntos medidos</span><b>2</b></div>
            <div class="row" style="--i:3"><span>Estado</span><b><span class="red">Alarma</span><span class="badge r">Alarma</span></b></div>
          </div>
        </div>
        <div class="blk umeter">
          <h3>Nivel</h3>
          <div class="meter">
            <div class="mticks"><span style="bottom:68.6%">39</span><span style="bottom:45.7%">31</span><span style="bottom:22.9%">23</span><span style="bottom:0">15</span></div>
            <div class="mbar"><i class="b g"></i><i class="b y"></i><i class="b o"></i><i class="b r"></i><div class="needle"><span>47 dB</span></div></div>
          </div>
        </div>
        <div class="blk usev">
          <h3>Criterios de severidad</h3>
          <div class="sev">
            <div class="segs"><span>Bueno, 15 a 23</span><span>Observación, 24 a 31</span><span>Precaución, 32 a 39</span><span>Alarma, mayor a 39</span></div>
            <div class="smark"><span>47 dB</span><i></i></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

export default function EscenaIdap({ disciplina = "vib", imagenes }: Props) {
  const envoltura = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = envoltura.current?.querySelector<HTMLElement>(".idap");
    if (!root) return;
    return montarIdap(root, { disciplina, imagenes });
    // Las imágenes se pasan una vez; cambiarlas en caliente no tiene caso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disciplina]);

  return (
    <div className="idap-wrap" ref={envoltura}>
      <style>{CSS}</style>
      <div dangerouslySetInnerHTML={{ __html: MARCADO }} />
    </div>
  );
}
