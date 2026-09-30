/**
 * Inspección integral de IDAP, la escena del bloque "Así llega una
 * inspección a IDAP" de /servicios/idap: encabezado del equipo, las
 * cinco técnicas en tarjetas y pestañas de Resumen (condición global,
 * costo de falla contra costo de atender hoy y recomendación validada),
 * Termografía (comparación con la inspección anterior), Vibraciones
 * (tendencia de 12 meses y espectro), Ultrasonido (forma de onda, puntos,
 * indicadores, nivel y escala de severidad), Aceite (metales con su
 * tendencia, viscosidad, agua, código ISO) y Eléctrico. Recorre las
 * pestañas en bucle; el cursor o el toque pausan en la que se elija.
 *
 * Generada en Claude Diseño por Emiliano (2026-09-29,
 * docs/designs/idap-inspeccion-integral.html) y portada tal cual: el CSS
 * y el marcado del diseño con la raíz renombrada a .ii-raiz (la escena
 * vieja de las páginas de servicio usa .idap) y la función montar() del
 * diseño, que trabaja solo dentro de su raíz y devuelve la limpieza.
 * Datos de ejemplo; las cifras de costo de falla son ilustrativas. Con
 * opciones.pestana (p. ej. 'ultra') el bucle alterna solo el resumen y
 * esa técnica, para las páginas de servicio.
 */
/* eslint-disable */
export var CSS = "\n.ii-raiz{--bg:#0b0f19;--pn:#111827;--ln:rgba(255,255,255,.08);--tx:#f1f5f9;--dm:#94a3b8;--au:#ffc34d;--ok:#22c55e;--obs:#f59e0b;--pre:#facc15;--al:#ef4444;container:idap/inline-size;background:var(--bg);color:var(--tx);font-family:Manrope,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.45;padding:clamp(14px,2.4vw,24px);border-radius:16px;max-width:1100px;margin:0 auto;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;box-sizing:border-box}\n.ii-raiz *,.ii-raiz *::before,.ii-raiz *::after{box-sizing:border-box;margin:0;padding:0}\n.ii-raiz button{font:inherit;color:inherit}\n.ii-raiz a{color:var(--au)}.ii-raiz a:hover{color:#ffd580}\n.ii-raiz svg{display:block;width:100%;height:100%;overflow:visible}\n.ii-raiz svg text{font-family:inherit}\n.ii-raiz .s-ok{color:var(--ok)}.ii-raiz .s-obs{color:var(--obs)}.ii-raiz .s-pre{color:var(--pre)}.ii-raiz .s-al{color:var(--al)}\n.idap-in{display:grid;gap:16px;min-width:0}\n.idap-aviso{height:28px;display:flex;align-items:center;gap:10px;font-size:12px;font-weight:700;color:var(--dm);transition:color .4s;min-width:0}\n.idap-aviso>i{flex:none;width:8px;height:8px;border-radius:50%;background:var(--dm);transition:background .4s,box-shadow .4s}\n.idap-aviso.on{color:var(--tx)}.idap-aviso.on>i{background:var(--au);box-shadow:0 0 0 4px rgba(255,195,77,.2)}\n.idap-aviso>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.idap-aviso>em{margin-left:auto;font-style:normal;font-weight:600;color:var(--dm);white-space:nowrap}\n.idap-hd{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 24px}\n.idap-t{font-size:clamp(18px,2.4cqi,24px);font-weight:800;letter-spacing:-.01em;line-height:1.2}\n.idap-sub{color:var(--dm);font-size:13px;font-weight:600;margin-top:4px}\n.idap-hdr{display:flex;flex-wrap:wrap;gap:8px;align-items:center}\n.idap-chip{flex:none;white-space:nowrap;font-size:12px;font-weight:700;color:var(--dm);border:1px solid var(--ln);border-radius:999px;padding:5px 11px}\n.idap-glob{flex:none;white-space:nowrap;display:inline-flex;gap:8px;align-items:center;font-weight:800;font-size:13px;color:var(--al);background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.45);padding:5px 12px;border-radius:999px}\n.idap-glob>i{width:8px;height:8px;border-radius:50%;background:var(--al)}\n.idap-cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}\n.idap-card{appearance:none;cursor:pointer;text-align:left;background:var(--pn);border:1px solid var(--ln);border-radius:12px;padding:14px;display:grid;gap:8px;align-content:start;min-width:0;transition:border-color .25s,background .25s}\n.idap-card:hover,.idap-card.on{border-color:rgba(255,195,77,.55)}.idap-card.on{background:#162034}\n.idap-card:focus-visible,.idap-tab:focus-visible{outline:2px solid var(--au);outline-offset:2px}\n.idap-cn{font-size:12px;font-weight:700;color:var(--dm)}\n.idap-cv{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 6px;min-width:0}\n.idap-cv b{font-size:clamp(20px,2.4cqi,26px);font-weight:800;letter-spacing:-.02em;line-height:1.15}\n.idap-cv small{font-size:12px;color:var(--dm);font-weight:700}\n.idap-st{justify-self:start;display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:800;padding:3px 9px;border-radius:999px;background:color-mix(in srgb,currentColor 14%,transparent);white-space:nowrap}\n.idap-st::before{content:\"\";width:6px;height:6px;border-radius:50%;background:currentColor}\n.idap-tabs{display:flex;gap:2px;border-bottom:1px solid var(--ln)}\n.idap-tab{appearance:none;background:none;border:0;cursor:pointer;padding:10px 14px 12px;font-size:13px;font-weight:700;color:var(--dm);position:relative;overflow:hidden;border-radius:8px 8px 0 0;transition:color .2s,background .2s;white-space:nowrap}\n.idap-tab:hover{color:var(--tx)}.idap-tab.on{color:var(--tx);background:rgba(255,255,255,.035)}\n.idap-tab::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:2px;background:transparent}\n.idap-tab.on::after{background:rgba(255,195,77,.3)}\n.idap-tab>i{position:absolute;left:0;bottom:0;height:2px;width:0;background:var(--au);z-index:1}\n.idap-tab.on.fijo>i{width:100%!important}\n.idap-stage{display:grid;min-width:0}\n.idap-pane{grid-area:1/1;min-width:0;opacity:0;visibility:hidden;transition:opacity .35s ease,visibility 0s linear .35s}\n.idap-pane.on{opacity:1;visibility:visible;transition:opacity .35s ease}\n.idap-p{background:var(--pn);border:1px solid var(--ln);border-radius:12px;padding:16px;min-width:0}\n.idap-h{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--dm);margin-bottom:12px}\n.idap-row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:6px 16px;margin-bottom:12px}\n.idap-row .idap-h{margin:0}\n.idap-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;color:var(--dm);font-weight:700}\n.idap-leg span{display:inline-flex;align-items:center;gap:6px}\n.idap-leg i{width:14px;height:3px;border-radius:2px}\n.idap-note{font-size:12.5px;color:var(--dm);font-weight:600;margin-top:10px;text-wrap:pretty}\n.idap-trk{position:relative;height:10px;border-radius:5px;background:rgba(255,255,255,.06)}\n.idap-trk>i{position:absolute;left:0;top:0;bottom:0;border-radius:5px;width:0}\n/* Resumen */\n.idap-res{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:12px;align-items:start}\n.idap-band{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:14px 18px;border-radius:12px;background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.5);font-weight:700;font-size:15px}\n.idap-band b{color:var(--al);font-weight:800;display:inline-flex;align-items:center;gap:8px}\n.idap-band b>i{width:10px;height:10px;border-radius:50%;background:var(--al);box-shadow:0 0 0 4px rgba(239,68,68,.25)}\n.idap-col{display:grid;gap:12px;align-content:start;min-width:0}\n.idap-sem{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:8px}\n.idap-sem>div{display:grid;justify-items:start;gap:4px;padding:10px;border-radius:10px;background:rgba(255,255,255,.025);border:1px solid var(--ln);min-width:0}\n.idap-sem i{width:12px;height:12px;border-radius:50%;background:currentColor;box-shadow:0 0 0 3px color-mix(in srgb,currentColor 25%,transparent);margin-bottom:4px}\n.idap-sem span{font-size:12px;font-weight:700;color:var(--tx)}\n.idap-sem em{font-style:normal;font-size:11px;font-weight:800}\n.idap-big{font-size:18px;font-weight:800;letter-spacing:-.01em;line-height:1.3;text-wrap:pretty}\n.idap-txt{font-size:13px;color:var(--dm);font-weight:600;margin-top:4px;text-wrap:pretty}\n.idap-rec{font-size:15px;font-weight:700;line-height:1.4;text-wrap:pretty}\n.idap-firma{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--ln);font-size:12px;font-weight:800;color:var(--au)}\n.idap-firma svg{width:16px;height:16px;flex:none}\n.idap-cost{border-color:rgba(255,195,77,.6);background:linear-gradient(180deg,rgba(255,195,77,.1),rgba(255,195,77,.02) 55%),var(--pn);display:grid;gap:16px;align-content:start}\n.idap-cost .idap-h{color:var(--au);margin:0}\n.idap-c2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}\n.idap-c2>div{display:grid;gap:4px;align-content:start;padding:12px;border-radius:10px;background:rgba(11,15,25,.55);border:1px solid var(--ln);min-width:0}\n.idap-c2 .l{font-size:12px;font-weight:800}\n.idap-c2 strong{font-size:clamp(20px,2.3cqi,25px);font-weight:800;letter-spacing:-.02em;white-space:nowrap;line-height:1.2}\n.idap-c2 p{font-size:12px;color:var(--dm);font-weight:600}\n.idap-bars{display:grid;gap:8px}\n.idap-br{display:grid;grid-template-columns:84px minmax(0,1fr);align-items:center;gap:10px;font-size:12px;font-weight:700;color:var(--dm)}\n.idap-save{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;padding-top:14px;border-top:1px solid rgba(255,195,77,.25)}\n.idap-save span{font-weight:800;font-size:14px}\n.idap-save strong{font-size:clamp(22px,2.8cqi,30px);font-weight:800;color:var(--au);letter-spacing:-.02em;white-space:nowrap}\n/* Termografía */\n.idap-ter{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:12px;align-items:start}\n.idap-cmp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}\n.idap-fig{display:grid;gap:8px;min-width:0}\n.idap-fig .cap{font-size:12px;font-weight:700;text-wrap:pretty}\n.idap-fr{position:relative;aspect-ratio:4/3;border-radius:8px;overflow:hidden;background:#140b2e}\n.idap-fr.cmp{cursor:ew-resize;touch-action:pan-y}\n.idap-fr>.g{position:absolute;inset:0}\n.idap-fr img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n.ii-raiz img[data-slot]:not([src]),.ii-raiz img[data-slot][src=\"\"]{display:none}\n.idap-cur{position:absolute;top:0;bottom:0;left:62%;width:2px;margin-left:-1px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)}\n.idap-cur::before{content:\"\";position:absolute;left:50%;top:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.35)}\n.idap-rd{font-size:12px;color:var(--dm);font-weight:700;display:flex;flex-wrap:wrap;gap:0 6px;align-items:baseline}\n.idap-rd b{color:var(--tx);font-size:15px;font-weight:800}\n.idap-thm{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:14px}\n.idap-thm figure{display:grid;gap:4px;min-width:0}\n.idap-thm figcaption{font-size:11px;color:var(--dm);font-weight:700}\n.g-act{background:radial-gradient(ellipse 12% 16% at 62% 50%,#fffbe0 0%,#ffe45c 30%,#ff9a1f 65%,transparent 100%),radial-gradient(ellipse 30% 36% at 62% 50%,rgba(232,58,32,.95) 0%,rgba(160,28,96,.6) 60%,transparent 100%),radial-gradient(ellipse 22% 28% at 30% 52%,rgba(214,70,60,.75) 0%,rgba(120,30,110,.5) 60%,transparent 100%),linear-gradient(180deg,#1a0d3a,#2a1150 50%,#170b33)}\n.g-ant{background:radial-gradient(ellipse 9% 12% at 62% 50%,#ffc070 0%,#e8602a 55%,transparent 100%),radial-gradient(ellipse 24% 30% at 62% 50%,rgba(170,40,90,.85) 0%,rgba(90,24,110,.5) 60%,transparent 100%),radial-gradient(ellipse 22% 28% at 30% 52%,rgba(190,56,70,.7) 0%,rgba(110,28,110,.45) 60%,transparent 100%),linear-gradient(180deg,#1a0d3a,#261048 50%,#170b33)}\n.g-1{background:radial-gradient(ellipse 22% 30% at 50% 50%,#ffe45c 0%,#ff7a1f 40%,rgba(160,28,96,.7) 75%,transparent 100%),linear-gradient(160deg,#1a0d3a,#2a1150)}\n.g-2{background:radial-gradient(ellipse 30% 26% at 40% 55%,rgba(232,58,32,.9) 0%,rgba(120,30,110,.6) 60%,transparent 100%),linear-gradient(200deg,#170b33,#2a1150)}\n.g-3{background:radial-gradient(ellipse 26% 32% at 60% 45%,rgba(214,70,60,.8) 0%,rgba(100,26,110,.55) 60%,transparent 100%),linear-gradient(180deg,#1a0d3a,#170b33)}\n.idap-tb{display:grid;font-size:13px}\n.idap-tr5{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,.8fr) minmax(0,.8fr) minmax(0,.7fr) minmax(0,1.1fr);grid-template-areas:\"n a b c s\";gap:8px;align-items:center;padding:10px 8px;border-top:1px solid var(--ln);font-weight:600}\n.idap-tr5.hd{font-size:10.5px;font-weight:800;color:var(--dm);text-transform:uppercase;letter-spacing:.06em;border-top:0;padding-top:0}\n.idap-tr5.hot{background:rgba(250,204,21,.07);border-radius:8px}\n.idap-tr5>.c-n{grid-area:n;font-weight:700}.idap-tr5>.c-a{grid-area:a;text-align:right}.idap-tr5>.c-b{grid-area:b;text-align:right}.idap-tr5>.c-c{grid-area:c;text-align:right}.idap-tr5>.c-s{grid-area:s;justify-self:end}\n.idap-tr5.hot>.c-b,.idap-tr5.hot>.c-c{color:var(--pre);font-weight:800}\n/* Vibraciones */\n.idap-vib{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:12px;align-items:start}\n.idap-vch{height:260px}.idap-spc{height:200px}\n/* Ultrasonido */\n.idap-ul{display:grid;gap:12px}\n.idap-wv{height:150px;position:relative}\n.idap-wv canvas{position:absolute;inset:0;width:100%;height:100%;display:block}\n.idap-u3{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) minmax(0,.62fr);gap:12px}\n.idap-pt{display:grid;gap:16px}\n.idap-pt>div{display:grid;gap:6px}\n.idap-pt .top{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:13px;font-weight:700}\n.idap-pt .top b{font-size:15px;font-weight:800}\n.idap-pt .idap-trk>u{position:absolute;top:-3px;bottom:-3px;width:2px;margin-left:-1px;background:var(--tx);left:38.33%;text-decoration:none}\n.idap-pt .sub{font-size:11.5px;color:var(--dm);font-weight:600}\n.idap-kp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}\n.idap-kp>div{padding:10px;border-radius:10px;background:rgba(255,255,255,.025);border:1px solid var(--ln);display:grid;gap:2px;min-width:0}\n.idap-kp span{font-size:11px;color:var(--dm);font-weight:700}\n.idap-kp b{font-size:20px;font-weight:800;white-space:nowrap}\n.idap-mt .val{font-size:22px;font-weight:800;color:var(--al);line-height:1.1}\n.idap-mtb{display:flex;gap:8px;height:150px;margin-top:12px}\n.idap-mtl{position:relative;width:22px;font-size:10px;color:var(--dm);font-weight:700}\n.idap-mtl span{position:absolute;right:0;transform:translateY(50%);line-height:1}\n.idap-mtt{position:relative;width:22px;border-radius:6px;overflow:hidden;background:linear-gradient(to top,rgba(34,197,94,.16) 0 39.2%,rgba(245,158,11,.16) 39.2% 52.5%,rgba(250,204,21,.16) 52.5% 65.8%,rgba(239,68,68,.16) 65.8%)}\n.idap-mtt>i{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(to top,#22c55e 0 39.2%,#f59e0b 39.2% 52.5%,#facc15 52.5% 65.8%,#ef4444 65.8%) bottom/100% 150px no-repeat}\n.idap-sc{padding:0 22px}\n.idap-mkr{position:relative;height:30px}\n.idap-mk{position:absolute;bottom:0;left:0;transform:translateX(-50%);display:grid;justify-items:center;font-size:12px;font-weight:800;white-space:nowrap;line-height:1.2}\n.idap-mk::after{content:\"\";width:0;height:0;border:6px solid transparent;border-top-color:currentColor;border-bottom:0;margin-top:3px}\n.idap-scb,.idap-scl{display:grid;grid-template-columns:8.5fr 8fr 8fr 15.5fr;gap:2px}\n.idap-scb{height:12px;border-radius:6px;overflow:hidden}\n.idap-scl{margin-top:8px}\n.idap-scl>div{font-size:12px;font-weight:800;display:grid;min-width:0}\n.idap-scl span{font-size:11px;color:var(--dm);font-weight:600}\n/* Aceite */\n.idap-oil{display:grid;gap:12px}\n.idap-met,.idap-o3,.idap-el{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}\n.idap-mc .top{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}\n.idap-mc .nm{font-weight:800;font-size:14px}\n.idap-mc .nm small{color:var(--dm);font-weight:700;font-size:12px;margin-left:4px}\n.idap-v{font-size:24px;font-weight:800;letter-spacing:-.02em;margin:8px 0 10px;line-height:1.2}\n.idap-v small{font-size:13px;color:var(--dm);font-weight:700;margin-left:4px}\n.idap-sp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}\n.idap-sp>div{display:grid;justify-items:center;gap:4px;font-size:11px;color:var(--dm);font-weight:700}\n.idap-sp b{color:var(--tx);font-size:12px;font-weight:800}\n.idap-sp .bx{height:56px;width:100%;display:flex;align-items:flex-end;justify-content:center;border-bottom:1px solid var(--ln)}\n.idap-sp .bx>i{display:block;width:60%;max-width:34px;border-radius:4px 4px 0 0;height:0}\n.idap-gauge{position:relative;height:12px;border-radius:6px;background:rgba(255,255,255,.06);margin-top:14px}\n.idap-gauge .band{position:absolute;top:0;bottom:0;background:rgba(34,197,94,.3);border-left:2px solid var(--ok);border-right:2px solid var(--ok)}\n.idap-gauge .fill{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:var(--ok);width:0}\n.idap-gauge .mk{position:absolute;top:-5px;bottom:-5px;width:4px;margin-left:-2px;background:var(--tx);border-radius:2px;left:0}\n.idap-gauge .lim{position:absolute;top:-4px;bottom:-4px;width:2px;margin-left:-1px;background:var(--al)}\n.idap-gt{position:relative;height:16px;margin-top:6px;font-size:11px;color:var(--dm);font-weight:700}\n.idap-gt span{position:absolute;transform:translateX(-50%);white-space:nowrap}\n.idap-iso{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}\n.idap-iso>div{display:grid;justify-items:center;padding:8px 4px;border-radius:8px;background:rgba(255,255,255,.03);border:1px solid var(--ln)}\n.idap-iso b{font-size:20px;font-weight:800}\n.idap-iso span{font-size:11px;color:var(--dm);font-weight:700}\n.idap-cl{padding:14px 18px;border-radius:12px;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.5);font-weight:600;font-size:14px;text-wrap:pretty}\n.idap-cl b{color:var(--obs);font-weight:800}\n.idap-okb{grid-column:1/-1;padding:14px 18px;border-radius:12px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.5);font-weight:700;font-size:15px;display:flex;flex-wrap:wrap;gap:4px 8px}\n.idap-okb b{color:var(--ok);font-weight:800}\n@container idap (max-width:860px){\n  .idap-res,.idap-ter,.idap-vib{grid-template-columns:minmax(0,1fr)}\n}\n@container idap (max-width:680px){\n  .idap-cards{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .idap-card:last-child{grid-column:1/-1}\n  .idap-u3{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}\n  .idap-mt{grid-column:1/-1}\n}\n@container idap (max-width:560px){\n  .idap-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;border:0}\n  .idap-tab{border:1px solid var(--ln);border-radius:8px;padding:9px 4px;text-align:center}\n  .idap-c2,.idap-u3,.idap-met,.idap-o3,.idap-el{grid-template-columns:minmax(0,1fr)}\n  .idap-mt{grid-column:auto}\n  .idap-band,.idap-okb{font-size:14px;padding:12px 14px}\n  .idap-vch{height:220px}\n  .idap-tr5.hd{display:none}\n  .idap-tr5{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-areas:\"n n s\" \"a b c\";row-gap:6px}\n  .idap-tr5>.c-a,.idap-tr5>.c-b,.idap-tr5>.c-c{text-align:left}\n  .idap-tr5 [data-l]::before{content:attr(data-l);display:block;font-size:10.5px;color:var(--dm);font-weight:700}\n  .idap-scl{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}\n}\n";

export var HTML = "<div class=\"ii-raiz\" data-screen-label=\"Inspección integral\">\n<div class=\"idap-in\">\n\n  <div class=\"idap-aviso\" data-k=\"aviso\" aria-live=\"polite\"><i></i><span>Inspección integral recibida</span><em data-k=\"est\"></em></div>\n\n  <header class=\"idap-hd\">\n    <div>\n      <p class=\"idap-t\">Bomba de alimentación B (P-201B)</p>\n      <p class=\"idap-sub\">Central Norte · inspección integral del 28/09/2026</p>\n    </div>\n    <div class=\"idap-hdr\">\n      <span class=\"idap-chip\">5 disciplinas evaluadas</span>\n      <span class=\"idap-glob\"><i></i>Alarma</span>\n    </div>\n  </header>\n\n  <div class=\"idap-cards\">\n    <button type=\"button\" class=\"idap-card\" data-tab=\"termo\" data-k=\"card-termo\"><span class=\"idap-cn\">Termografía</span><span class=\"idap-cv\"><b data-k=\"c-termo\">71.4</b><small>°C</small></span><span class=\"idap-st s-pre\">Precaución</span></button>\n    <button type=\"button\" class=\"idap-card\" data-tab=\"vib\" data-k=\"card-vib\"><span class=\"idap-cn\">Vibraciones</span><span class=\"idap-cv\"><b data-k=\"c-vib\">11.2</b><small>mm/s</small></span><span class=\"idap-st s-al\">Alarma</span></button>\n    <button type=\"button\" class=\"idap-card\" data-tab=\"ultra\" data-k=\"card-ultra\"><span class=\"idap-cn\">Ultrasonido</span><span class=\"idap-cv\"><b data-k=\"c-ultra\">47</b><small>dB</small></span><span class=\"idap-st s-al\">Alarma</span></button>\n    <button type=\"button\" class=\"idap-card\" data-tab=\"aceite\" data-k=\"card-aceite\"><span class=\"idap-cn\">Aceite</span><span class=\"idap-cv\"><b data-k=\"c-aceite\">42</b><small>ppm Fe</small></span><span class=\"idap-st s-obs\">Observación</span></button>\n    <button type=\"button\" class=\"idap-card\" data-tab=\"elec\" data-k=\"card-elec\"><span class=\"idap-cn\">Eléctrico</span><span class=\"idap-cv\"><b data-k=\"c-elec\">1.2</b><small>% de desbalance</small></span><span class=\"idap-st s-ok\">Bueno</span></button>\n  </div>\n\n  <div class=\"idap-tabs\" role=\"tablist\">\n    <button type=\"button\" role=\"tab\" class=\"idap-tab on\" data-tab=\"res\" aria-selected=\"true\">Resumen<i></i></button>\n    <button type=\"button\" role=\"tab\" class=\"idap-tab\" data-tab=\"termo\" aria-selected=\"false\">Termografía<i></i></button>\n    <button type=\"button\" role=\"tab\" class=\"idap-tab\" data-tab=\"vib\" aria-selected=\"false\">Vibraciones<i></i></button>\n    <button type=\"button\" role=\"tab\" class=\"idap-tab\" data-tab=\"ultra\" aria-selected=\"false\">Ultrasonido<i></i></button>\n    <button type=\"button\" role=\"tab\" class=\"idap-tab\" data-tab=\"aceite\" aria-selected=\"false\">Aceite<i></i></button>\n    <button type=\"button\" role=\"tab\" class=\"idap-tab\" data-tab=\"elec\" aria-selected=\"false\">Eléctrico<i></i></button>\n  </div>\n\n  <div class=\"idap-stage\" data-k=\"stage\">\n\n    <!-- RESUMEN -->\n    <section class=\"idap-pane on\" data-pane=\"res\" role=\"tabpanel\" aria-label=\"Resumen\">\n      <div class=\"idap-res\">\n        <div class=\"idap-band\" data-k=\"band\"><b><i></i>Alarma</b><span>· 3 hallazgos · requiere atención esta semana</span></div>\n        <div class=\"idap-col\">\n          <div class=\"idap-p\">\n            <h4 class=\"idap-h\">Semáforo por técnica</h4>\n            <div class=\"idap-sem\">\n              <div class=\"s-pre\" data-k=\"sem\"><i></i><span>Termografía</span><em>Precaución</em></div>\n              <div class=\"s-al\" data-k=\"sem\"><i></i><span>Vibraciones</span><em>Alarma</em></div>\n              <div class=\"s-al\" data-k=\"sem\"><i></i><span>Ultrasonido</span><em>Alarma</em></div>\n              <div class=\"s-obs\" data-k=\"sem\"><i></i><span>Aceite</span><em>Observación</em></div>\n              <div class=\"s-ok\" data-k=\"sem\"><i></i><span>Eléctrico</span><em>Bueno</em></div>\n            </div>\n          </div>\n          <div class=\"idap-p\" data-k=\"hall\">\n            <h4 class=\"idap-h\">Hallazgo principal</h4>\n            <p class=\"idap-big\">Daño en rodamiento del lado acople</p>\n            <p class=\"idap-txt\">Confirmado por vibraciones, termografía y ultrasonido</p>\n          </div>\n          <div class=\"idap-p\" data-k=\"rec\">\n            <h4 class=\"idap-h\">Recomendación</h4>\n            <p class=\"idap-rec\">Cambiar rodamiento y revisar lubricación en la próxima ventana de paro</p>\n            <p class=\"idap-firma\" data-k=\"firma\"><svg viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"8\" cy=\"8\" r=\"6.5\"></circle><path d=\"M5 8.2l2 2 4-4.2\"></path></svg>Validado por especialista DIAPSA</p>\n          </div>\n        </div>\n        <div class=\"idap-p idap-cost\" data-k=\"cost\">\n          <h4 class=\"idap-h\">Costo de falla</h4>\n          <div class=\"idap-c2\">\n            <div><span class=\"l s-al\">Si falla</span><strong data-k=\"cf\">$2.4 M MXN</strong><p>(36 h de paro + reparación mayor)</p></div>\n            <div><span class=\"l\" style=\"color:#ffc34d\">Atender hoy</span><strong data-k=\"ch\">$85 mil MXN</strong><p>(cambio de rodamiento en ventana programada)</p></div>\n          </div>\n          <div class=\"idap-bars\">\n            <div class=\"idap-br\"><span>Si falla</span><div class=\"idap-trk\"><i data-k=\"bf\" style=\"width:100%;background:#ef4444\"></i></div></div>\n            <div class=\"idap-br\"><span>Atender hoy</span><div class=\"idap-trk\"><i data-k=\"bh\" style=\"width:3.54%;background:#ffc34d\"></i></div></div>\n          </div>\n          <div class=\"idap-save\" data-k=\"save\"><span>Ahorro estimado:</span><strong data-k=\"cs\">$2.3 M MXN</strong></div>\n        </div>\n      </div>\n    </section>\n\n    <!-- TERMOGRAFÍA -->\n    <section class=\"idap-pane\" data-pane=\"termo\" role=\"tabpanel\" aria-label=\"Termografía\">\n      <div class=\"idap-ter\">\n        <div class=\"idap-p\">\n          <div class=\"idap-row\"><h4 class=\"idap-h\">Comparación con la inspección pasada</h4></div>\n          <div class=\"idap-cmp\">\n            <div class=\"idap-fig\">\n              <p class=\"cap\">Inspección anterior · 28/06/2026</p>\n              <div class=\"idap-fr cmp\" data-k=\"fr\"><div class=\"g g-ant\"></div><img data-slot=\"termica-anterior\" alt=\"Imagen térmica, inspección anterior\"><div class=\"idap-cur\" data-k=\"curA\"></div></div>\n              <p class=\"idap-rd\">En el cursor <b data-k=\"rA\">53.1 °C</b></p>\n            </div>\n            <div class=\"idap-fig\">\n              <p class=\"cap\">Inspección actual · 28/09/2026</p>\n              <div class=\"idap-fr cmp\" data-k=\"fr\"><div class=\"g g-act\"></div><img data-slot=\"termica-principal\" alt=\"Imagen térmica, inspección actual\"><div class=\"idap-cur\" data-k=\"curB\"></div></div>\n              <p class=\"idap-rd\">En el cursor <b data-k=\"rB\">71.4 °C</b></p>\n            </div>\n          </div>\n          <div class=\"idap-thm\">\n            <figure><div class=\"idap-fr\"><div class=\"g g-1\"></div><img data-slot=\"termica-1\" alt=\"Miniatura térmica 1\"></div><figcaption>Rodamiento lado acople</figcaption></figure>\n            <figure><div class=\"idap-fr\"><div class=\"g g-2\"></div><img data-slot=\"termica-2\" alt=\"Miniatura térmica 2\"></div><figcaption>Carcasa del motor</figcaption></figure>\n            <figure><div class=\"idap-fr\"><div class=\"g g-3\"></div><img data-slot=\"termica-3\" alt=\"Miniatura térmica 3\"></div><figcaption>Acoplamiento</figcaption></figure>\n          </div>\n        </div>\n        <div class=\"idap-p\">\n          <h4 class=\"idap-h\">Puntos de medición</h4>\n          <div class=\"idap-tb\">\n            <div class=\"idap-tr5 hd\"><span class=\"c-n\">Punto</span><span class=\"c-a\">Anterior</span><span class=\"c-b\">Actual</span><span class=\"c-c\">ΔT</span><span class=\"c-s\">Estado</span></div>\n            <div class=\"idap-tr5 hot\" data-k=\"trow\"><span class=\"c-n\">Rodamiento lado acople</span><span class=\"c-a\" data-l=\"Anterior\">53.1 °C</span><span class=\"c-b\" data-l=\"Actual\">71.4 °C</span><span class=\"c-c\" data-l=\"ΔT\">+18.3 °C</span><span class=\"c-s idap-st s-pre\">Precaución</span></div>\n            <div class=\"idap-tr5\" data-k=\"trow\"><span class=\"c-n\">Rodamiento lado libre</span><span class=\"c-a\" data-l=\"Anterior\">48.6 °C</span><span class=\"c-b\" data-l=\"Actual\">52.0 °C</span><span class=\"c-c\" data-l=\"ΔT\">+3.4 °C</span><span class=\"c-s idap-st s-ok\">Bueno</span></div>\n            <div class=\"idap-tr5\" data-k=\"trow\"><span class=\"c-n\">Carcasa del motor</span><span class=\"c-a\" data-l=\"Anterior\">44.2 °C</span><span class=\"c-b\" data-l=\"Actual\">45.0 °C</span><span class=\"c-c\" data-l=\"ΔT\">+0.8 °C</span><span class=\"c-s idap-st s-ok\">Bueno</span></div>\n            <div class=\"idap-tr5\" data-k=\"trow\"><span class=\"c-n\">Acoplamiento</span><span class=\"c-a\" data-l=\"Anterior\">39.8 °C</span><span class=\"c-b\" data-l=\"Actual\">41.1 °C</span><span class=\"c-c\" data-l=\"ΔT\">+1.3 °C</span><span class=\"c-s idap-st s-ok\">Bueno</span></div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- VIBRACIONES -->\n    <section class=\"idap-pane\" data-pane=\"vib\" role=\"tabpanel\" aria-label=\"Vibraciones\">\n      <div class=\"idap-vib\">\n        <div class=\"idap-p\">\n          <div class=\"idap-row\">\n            <h4 class=\"idap-h\">Velocidad global · mm/s · oct 2025 a sep 2026</h4>\n            <div class=\"idap-leg\"><span><i style=\"background:#ffc34d\"></i>Lado acople</span><span><i style=\"background:#94a3b8\"></i>Lado libre</span></div>\n          </div>\n          <div class=\"idap-vch\" data-k=\"vch\"></div>\n        </div>\n        <div class=\"idap-p\">\n          <h4 class=\"idap-h\">Espectro · lado acople</h4>\n          <div class=\"idap-spc\" data-k=\"spc\"></div>\n          <p class=\"idap-note\">Frecuencias de falla de rodamiento, lado acople</p>\n        </div>\n      </div>\n    </section>\n\n    <!-- ULTRASONIDO -->\n    <section class=\"idap-pane\" data-pane=\"ultra\" role=\"tabpanel\" aria-label=\"Ultrasonido\">\n      <div class=\"idap-ul\">\n        <div class=\"idap-p\">\n          <div class=\"idap-row\">\n            <h4 class=\"idap-h\">Forma de onda en tiempo real</h4>\n            <div class=\"idap-leg\"><span><i style=\"background:#22c55e\"></i>Línea base 15 dB</span><span><i style=\"background:#ef4444\"></i>Punto 1 · 47 dB</span></div>\n          </div>\n          <div class=\"idap-wv\" data-k=\"wv\"><canvas data-k=\"cvs\"></canvas></div>\n          <p class=\"idap-note\">Impactos periódicos, patrón típico de rodamiento dañado</p>\n        </div>\n        <div class=\"idap-u3\">\n          <div class=\"idap-p\">\n            <h4 class=\"idap-h\">Puntos medidos</h4>\n            <div class=\"idap-pt\">\n              <div><div class=\"top\"><span>Punto 1 · lado acople</span><b class=\"s-al\" data-k=\"u1\">47 dB</b></div><div class=\"idap-trk\"><i data-k=\"u1b\" style=\"width:78.3%;background:#ef4444\"></i><u></u></div><p class=\"sub\">Referencia 23 dB</p></div>\n              <div><div class=\"top\"><span>Punto 2 · lado libre</span><b class=\"s-al\" data-k=\"u2\">44 dB</b></div><div class=\"idap-trk\"><i data-k=\"u2b\" style=\"width:73.3%;background:#ef4444\"></i><u></u></div><p class=\"sub\">Referencia 23 dB</p></div>\n            </div>\n          </div>\n          <div class=\"idap-p\">\n            <h4 class=\"idap-h\">Indicadores principales</h4>\n            <div class=\"idap-kp\">\n              <div><span>Nivel máximo</span><b data-k=\"kmax\">47 dB</b></div>\n              <div><span>Línea base</span><b data-k=\"kbase\">15 dB</b></div>\n              <div><span>Puntos medidos</span><b data-k=\"kn\">2</b></div>\n              <div><span>Estado</span><b class=\"s-al\">Alarma</b></div>\n            </div>\n          </div>\n          <div class=\"idap-p idap-mt\">\n            <h4 class=\"idap-h\">Nivel</h4>\n            <p class=\"val\" data-k=\"mv\">47 dB</p>\n            <div class=\"idap-mtb\">\n              <div class=\"idap-mtl\"><span style=\"bottom:0%\">0</span><span style=\"bottom:25%\">15</span><span style=\"bottom:38.3%\">23</span><span style=\"bottom:51.7%\">31</span><span style=\"bottom:65%\">39</span><span style=\"bottom:100%\">60</span></div>\n              <div class=\"idap-mtt\"><i data-k=\"mf\" style=\"height:78.3%\"></i></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"idap-p\">\n          <h4 class=\"idap-h\">Criterios de severidad · dB</h4>\n          <div class=\"idap-sc\">\n            <div class=\"idap-mkr\"><div class=\"idap-mk s-al\" data-k=\"mk\" style=\"left:80%\"><span data-k=\"mkv\">47 dB</span></div></div>\n            <div class=\"idap-scb\"><i style=\"background:#22c55e\"></i><i style=\"background:#f59e0b\"></i><i style=\"background:#facc15\"></i><i style=\"background:#ef4444\"></i></div>\n            <div class=\"idap-scl\">\n              <div class=\"s-ok\">Bueno<span>15 a 23</span></div>\n              <div class=\"s-obs\">Observación<span>24 a 31</span></div>\n              <div class=\"s-pre\">Precaución<span>32 a 39</span></div>\n              <div class=\"s-al\">Alarma<span>más de 39</span></div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- ACEITE -->\n    <section class=\"idap-pane\" data-pane=\"aceite\" role=\"tabpanel\" aria-label=\"Aceite\">\n      <div class=\"idap-oil\">\n        <div class=\"idap-met\">\n          <div class=\"idap-p idap-mc\" data-m=\"fe\" data-vals=\"18,29,42\" data-max=\"50\" data-c=\"#f59e0b\">\n            <div class=\"top\"><span class=\"nm\">Hierro<small>Fe</small></span><span class=\"idap-st s-obs\">Observación</span></div>\n            <p class=\"idap-v\"><span data-v=\"\">42</span><small>ppm</small></p>\n            <div class=\"idap-sp\"><div><b>18</b><span class=\"bx\"><i></i></span>28/03</div><div><b>29</b><span class=\"bx\"><i></i></span>28/06</div><div><b>42</b><span class=\"bx\"><i></i></span>28/09</div></div>\n          </div>\n          <div class=\"idap-p idap-mc\" data-m=\"cu\" data-vals=\"6,7,9\" data-max=\"50\" data-c=\"#22c55e\">\n            <div class=\"top\"><span class=\"nm\">Cobre<small>Cu</small></span><span class=\"idap-st s-ok\">Bueno</span></div>\n            <p class=\"idap-v\"><span data-v=\"\">9</span><small>ppm</small></p>\n            <div class=\"idap-sp\"><div><b>6</b><span class=\"bx\"><i></i></span>28/03</div><div><b>7</b><span class=\"bx\"><i></i></span>28/06</div><div><b>9</b><span class=\"bx\"><i></i></span>28/09</div></div>\n          </div>\n          <div class=\"idap-p idap-mc\" data-m=\"cr\" data-vals=\"1,2,3\" data-max=\"50\" data-c=\"#22c55e\">\n            <div class=\"top\"><span class=\"nm\">Cromo<small>Cr</small></span><span class=\"idap-st s-ok\">Bueno</span></div>\n            <p class=\"idap-v\"><span data-v=\"\">3</span><small>ppm</small></p>\n            <div class=\"idap-sp\"><div><b>1</b><span class=\"bx\"><i></i></span>28/03</div><div><b>2</b><span class=\"bx\"><i></i></span>28/06</div><div><b>3</b><span class=\"bx\"><i></i></span>28/09</div></div>\n          </div>\n        </div>\n        <div class=\"idap-o3\">\n          <div class=\"idap-p\">\n            <div class=\"idap-row\" style=\"margin:0\"><h4 class=\"idap-h\">Viscosidad a 40 °C · ISO VG 68</h4></div>\n            <p class=\"idap-v\" style=\"margin-bottom:0\">68.2<small>cSt</small></p>\n            <span class=\"idap-st s-ok\">Dentro del rango</span>\n            <div class=\"idap-gauge\"><div class=\"band\" style=\"left:22.96%;width:50.37%\"></div><div class=\"mk\" data-k=\"vmk\" style=\"left:48.9%\"></div></div>\n            <div class=\"idap-gt\"><span style=\"left:22.96%\">61.2</span><span style=\"left:73.33%\">74.8</span></div>\n          </div>\n          <div class=\"idap-p\">\n            <h4 class=\"idap-h\">Agua</h4>\n            <p class=\"idap-v\" style=\"margin-bottom:0\"><span data-k=\"agua\">180</span><small>ppm</small></p>\n            <span class=\"idap-st s-ok\">Bueno</span>\n            <div class=\"idap-gauge\"><div class=\"fill\" data-k=\"wf\" style=\"width:18%\"></div><div class=\"lim\" style=\"left:50%\"></div></div>\n            <div class=\"idap-gt\"><span style=\"left:50%\">Límite 500 ppm</span></div>\n          </div>\n          <div class=\"idap-p\">\n            <h4 class=\"idap-h\">Limpieza ISO 4406</h4>\n            <p class=\"idap-v\" style=\"margin-bottom:0\">19/17/14</p>\n            <div class=\"idap-iso\">\n              <div data-k=\"iso\"><b>19</b><span>≥4 µm</span></div>\n              <div data-k=\"iso\"><b>17</b><span>≥6 µm</span></div>\n              <div data-k=\"iso\"><b>14</b><span>≥14 µm</span></div>\n            </div>\n          </div>\n        </div>\n        <p class=\"idap-cl\" data-k=\"ocl\">Desgaste metálico en aumento, consistente con el daño en rodamiento. <b>Observación:</b> repetir muestra en 30 días</p>\n      </div>\n    </section>\n\n    <!-- ELÉCTRICO -->\n    <section class=\"idap-pane\" data-pane=\"elec\" role=\"tabpanel\" aria-label=\"Eléctrico\">\n      <div class=\"idap-el\">\n        <div class=\"idap-p\"><h4 class=\"idap-h\">Desbalance de corriente</h4><p class=\"idap-v\" data-k=\"e1\">1.2 %</p><span class=\"idap-st s-ok\">Bueno</span></div>\n        <div class=\"idap-p\"><h4 class=\"idap-h\">THD</h4><p class=\"idap-v\" data-k=\"e2\">3.1 %</p><span class=\"idap-st s-ok\">Bueno</span></div>\n        <div class=\"idap-p\"><h4 class=\"idap-h\">Resistencia de aislamiento</h4><p class=\"idap-v\">Correcta</p><span class=\"idap-st s-ok\">Bueno</span></div>\n        <p class=\"idap-okb\" data-k=\"eb\"><b>Bueno</b><span>· El motor está sano; el problema es mecánico</span></p>\n      </div>\n    </section>\n\n  </div>\n</div>\n</div>";

export function montar(raiz, opciones) {
  opciones = opciones || {};
  var doc = raiz.ownerDocument, win = doc.defaultView;
  var qa = function (s) { return Array.prototype.slice.call(raiz.querySelectorAll(s)); };
  var R = {}; qa('[data-k]').forEach(function (e) { if (!R[e.dataset.k]) R[e.dataset.k] = e; });
  var offs = [];
  function on(el, ev, fn, o) { el.addEventListener(ev, fn, o); offs.push(function () { el.removeEventListener(ev, fn, o); }); }
  var uid = 'idap' + Math.random().toString(36).slice(2, 8);
  var NS = 'http://www.w3.org/2000/svg';

  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var eo = function (x) { return 1 - Math.pow(1 - x, 3); };
  var eio = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var k = function (lt, a, d) { return eo(cl((lt - a) / d)); };
  var f = function (v, d) { return v.toFixed(d); };
  var hsh = function (i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function show(el, p, dy) { el.style.opacity = p; el.style.transform = p >= 1 ? '' : 'translateY(' + ((1 - p) * (dy == null ? 8 : dy)) + 'px)'; }

  var mq = win.matchMedia('(prefers-reduced-motion: reduce)');
  var quieto = opciones.reducido != null ? !!opciones.reducido : mq.matches;

  var panes = qa('[data-pane]'), tabs = qa('.idap-tab'), cards = qa('.idap-card');

  /* Tarjetas */
  var CARD = [['termo', 71.4, 1], ['vib', 11.2, 1], ['ultra', 47, 0], ['aceite', 42, 0], ['elec', 1.2, 1]];
  function rCards(ct) {
    CARD.forEach(function (c, i) {
      show(R['card-' + c[0]], k(ct + .3, i * .1, .45));
      R['c-' + c[0]].textContent = f(c[1] * k(ct, i * .1 + .2, 1.3), c[2]);
    });
  }

  /* Resumen */
  var sem = qa('[data-k="sem"]');
  function rRes(lt) {
    show(R.band, k(lt, 0, .45));
    sem.forEach(function (e, i) { show(e, k(lt, .25 + i * .08, .35), 6); });
    show(R.hall, k(lt, .5, .45));
    show(R.cost, k(lt, .7, .45));
    var a = k(lt, 1, 1.6), b = k(lt, 1.15, 1.4), s = k(lt, 2.7, 1);
    R.cf.textContent = '$' + f(2.4 * a, 1) + ' M MXN';
    R.ch.textContent = '$' + Math.round(85 * b) + ' mil MXN';
    R.bf.style.width = (100 * a) + '%';
    R.bh.style.width = (3.54 * b) + '%';
    show(R.save, k(lt, 2.6, .4));
    R.cs.textContent = '$' + f(2.3 * s, 1) + ' M MXN';
    show(R.rec, k(lt, 3.3, .45));
    show(R.firma, k(lt, 3.9, .4), 4);
  }

  /* Termografía */
  var trows = qa('[data-k="trow"]'), manX = null;
  var g1 = function (x) { return Math.exp(-Math.pow((x - .62) / .1, 2)); }, g2 = function (x) { return Math.exp(-Math.pow((x - .3) / .14, 2)); };
  var Tant = function (x) { return 38 + 15.1 * g1(x) + 3 * g2(x); }, Tact = function (x) { return 38 + 33.4 * g1(x) + 3.8 * g2(x); };
  function rTer(lt) {
    var x = manX != null ? manX : lt < 2.2 ? .1 + .8 * eio(cl(lt / 2.2)) : .9 - .28 * eo(cl((lt - 2.2) / .9));
    R.curA.style.left = R.curB.style.left = (x * 100) + '%';
    R.rA.textContent = f(Tant(x), 1) + ' °C';
    R.rB.textContent = f(Tact(x), 1) + ' °C';
    trows.forEach(function (r, i) { show(r, k(lt, .3 + i * .12, .4), 6); });
  }

  /* Vibraciones */
  var VA = [1.9, 2.1, 2.0, 2.4, 3.1, 3.4, 3.9, 4.9, 5.6, 6.3, 7.8, 11.2];
  var VL = [1.4, 1.5, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.5, 2.6];
  var MES = ['oct', 'nov', 'dic', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep'];
  var MM = ['10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
  var LIM = [[2.8, 'Obs. 2.8', '#f59e0b'], [4.5, 'Prec. 4.5', '#facc15'], [7.1, 'Alarma 7.1', '#ef4444']];
  var V = null, S = null, WV = null;
  function el(tag, at, txt) { var e = doc.createElementNS(NS, tag); for (var a in at) e.setAttribute(a, at[a]); if (txt != null) e.textContent = txt; return e; }
  function buildVib() {
    var box = R.vch, W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
    var pl = 30, pr = 66, pt = 14, pb = 26, pw = W - pl - pr, ph = H - pt - pb;
    var X = function (i) { return pl + i * pw / 11; }, Y = function (v) { return pt + (1 - v / 12) * ph; };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, 'font-size': '10.5', 'font-weight': '700' });
    var cp = el('clipPath', { id: uid + 'c' }), cr = el('rect', { x: pl - 6, y: 0, width: 0, height: H });
    cp.appendChild(cr); var defs = el('defs', {}); defs.appendChild(cp); svg.appendChild(defs);
    [0, 4, 8, 12].forEach(function (v) {
      svg.appendChild(el('line', { x1: pl, x2: pl + pw, y1: Y(v), y2: Y(v), stroke: 'rgba(255,255,255,.07)' }));
      svg.appendChild(el('text', { x: pl - 8, y: Y(v) + 3.5, 'text-anchor': 'end', fill: '#94a3b8' }, v));
    });
    LIM.forEach(function (l) {
      svg.appendChild(el('line', { x1: pl, x2: pl + pw, y1: Y(l[0]), y2: Y(l[0]), stroke: l[2], 'stroke-dasharray': '5 4', 'stroke-opacity': '.75' }));
      svg.appendChild(el('text', { x: pl + pw + 8, y: Y(l[0]) + 3.5, fill: l[2] }, l[1]));
    });
    var step = pw < 330 ? 2 : 1;
    MES.forEach(function (m, i) { if (i % step === 0) svg.appendChild(el('text', { x: X(i), y: H - 6, 'text-anchor': 'middle', fill: '#94a3b8', 'font-weight': '600' }, m)); });
    var dL = VL.map(function (v, i) { return (i ? 'L' : 'M') + X(i) + ' ' + Y(v); }).join('');
    var lib = el('path', { d: dL, fill: 'none', stroke: '#94a3b8', 'stroke-width': 2, 'stroke-linejoin': 'round' });
    svg.appendChild(lib);
    var g = el('g', { 'clip-path': 'url(#' + uid + 'c)' });
    g.appendChild(el('path', { d: VA.map(function (v, i) { return (i ? 'L' : 'M') + X(i) + ' ' + Y(v); }).join(''), fill: 'none', stroke: '#ffc34d', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    svg.appendChild(g);
    var marks = [];
    LIM.forEach(function (l) {
      for (var i = 1; i < VA.length; i++) if (VA[i] >= l[0] && VA[i - 1] < l[0]) {
        var fr = (l[0] - VA[i - 1]) / (VA[i] - VA[i - 1]), cx = X(i - 1 + fr), cy = Y(l[0]);
        var mg = el('g', { opacity: 0 });
        mg.appendChild(el('circle', { cx: cx, cy: cy, r: 5, fill: l[2], stroke: '#111827', 'stroke-width': 2 }));
        mg.appendChild(el('text', { x: cx - 8, y: cy - 8, 'text-anchor': 'end', fill: '#f1f5f9' }, '28/' + MM[i]));
        svg.appendChild(mg); marks.push({ el: mg, frac: (i - 1 + fr) / 11 }); break;
      }
    });
    var head = el('circle', { r: 5, fill: '#ffc34d', stroke: '#111827', 'stroke-width': 2 });
    svg.appendChild(head);
    var endL = el('text', { x: X(11) - 10, y: Y(11.2) + 4, 'text-anchor': 'end', fill: '#ffc34d', 'font-size': '12', 'font-weight': '800', opacity: 0 }, '11.2 mm/s');
    svg.appendChild(endL);
    box.textContent = ''; box.appendChild(svg);
    V = { X: X, Y: Y, pw: pw, clip: cr, head: head, marks: marks, lib: lib, endL: endL };
  }
  function buildSpec() {
    var box = R.spc, W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
    var pl = 8, pr = 8, pt = 22, pb = 24, pw = W - pl - pr, ph = H - pt - pb, base = pt + ph;
    var X = function (fq) { return pl + fq / 400 * pw; };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, 'font-size': '10.5', 'font-weight': '700' });
    var d = '';
    for (var x = 0; x <= pw; x += 3) d += 'M' + (pl + x) + ' ' + base + 'v' + (-(.03 + hsh(x) * .07) * ph);
    var floor = el('path', { d: d, stroke: 'rgba(148,163,184,.55)', 'stroke-width': 1.2 });
    svg.appendChild(floor);
    svg.appendChild(el('line', { x1: pl, x2: pl + pw, y1: base, y2: base, stroke: 'rgba(255,255,255,.15)' }));
    [0, 100, 200, 300, 400].forEach(function (v, i) { svg.appendChild(el('text', { x: X(v), y: H - 6, 'text-anchor': i === 0 ? 'start' : i === 4 ? 'end' : 'middle', fill: '#94a3b8', 'font-weight': '600' }, v === 400 ? '400 Hz' : v)); });
    var P = [[29.7, .3, '1×', '#94a3b8'], [106.3, 1, 'BPFO', '#ef4444'], [212.6, .66, '2×', '#ef4444'], [318.9, .42, '3×', '#ef4444']];
    var peaks = P.map(function (p) {
      var ln = el('line', { x1: X(p[0]), x2: X(p[0]), y1: base, y2: base, stroke: p[3], 'stroke-width': 3, 'stroke-linecap': 'round' });
      var tx = el('text', { x: X(p[0]), y: base - p[1] * ph - 7, 'text-anchor': 'middle', fill: p[3], opacity: 0 }, p[2]);
      svg.appendChild(ln); svg.appendChild(tx);
      return { ln: ln, tx: tx, h: p[1] * ph, base: base };
    });
    box.textContent = ''; box.appendChild(svg);
    S = { peaks: peaks, floor: floor };
  }
  function rVib(lt) {
    if (V) {
      V.lib.style.opacity = k(lt, 0, .8);
      var p = eio(cl((lt - .3) / 2.6)), fi = p * 11, i = Math.min(10, Math.floor(fi)), fr = fi - i;
      V.clip.setAttribute('width', V.pw * p + 12);
      V.head.setAttribute('cx', V.X(fi)); V.head.setAttribute('cy', V.Y(VA[i] + (VA[i + 1] - VA[i]) * fr));
      V.head.style.opacity = lt > .3 ? 1 : 0;
      V.marks.forEach(function (m) { m.el.setAttribute('opacity', cl((p - m.frac) * 14)); });
      V.endL.setAttribute('opacity', cl((p - .97) * 30));
    }
    if (S) {
      S.floor.style.opacity = k(lt, .6, .6);
      S.peaks.forEach(function (pk, j) { var g = k(lt, 1 + j * .18, .7); pk.ln.setAttribute('y2', pk.base - pk.h * g); pk.tx.setAttribute('opacity', cl((g - .7) * 4)); });
    }
  }

  /* Ultrasonido */
  function buildWave() {
    var box = R.wv, W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
    var d = win.devicePixelRatio || 1, c = R.cvs;
    c.width = Math.round(W * d); c.height = Math.round(H * d);
    WV = { ctx: c.getContext('2d'), W: W, H: H, d: d };
  }
  function drawWave(tm) {
    if (!WV) return;
    var c = WV.ctx, W = WV.W, H = WV.H, pl = 2, pr = 78, pt = 10, pb = 10, pw = W - pl - pr, ph = H - pt - pb;
    var Y = function (v) { return pt + (1 - v / 60) * ph; };
    c.setTransform(WV.d, 0, 0, WV.d, 0, 0); c.clearRect(0, 0, W, H);
    c.font = '700 10.5px Manrope, system-ui, sans-serif';
    [[15, '#22c55e', '15 dB base'], [47, '#ef4444', '47 dB P1']].forEach(function (l) {
      c.setLineDash([4, 4]); c.strokeStyle = l[1]; c.globalAlpha = .45; c.lineWidth = 1;
      c.beginPath(); c.moveTo(pl, Y(l[0])); c.lineTo(pl + pw, Y(l[0])); c.stroke();
      c.setLineDash([]); c.globalAlpha = 1; c.fillStyle = l[1]; c.fillText(l[2], pl + pw + 8, Y(l[0]) + 3.5);
    });
    c.save(); c.beginPath(); c.rect(pl, 0, pw, H); c.clip();
    c.lineWidth = 1.6; c.lineJoin = 'round';
    var off = tm * 80, j, x, v;
    c.strokeStyle = '#22c55e'; c.beginPath();
    for (j = Math.floor(off / 3); ; j++) { x = pl + j * 3 - off; v = 15 + (hsh(j) - .5) * 3; c.lineTo(x, Y(v)); if (x > pl + pw) break; }
    c.stroke();
    off = tm * 110; c.strokeStyle = '#ef4444'; c.beginPath();
    for (j = Math.floor(off / 3); ; j++) {
      x = pl + j * 3 - off; var ph2 = j * 3, n = Math.floor(ph2 / 66), dd = ph2 - n * 66;
      v = Math.min(47, 26 + (hsh(j + 999) - .5) * 6 + 18 * Math.exp(-dd / 6) * (.9 + .1 * hsh(n)));
      c.lineTo(x, Y(v)); if (x > pl + pw) break;
    }
    c.stroke(); c.restore();
  }
  var ZC = function (v) { return v <= 23.5 ? '#22c55e' : v <= 31.5 ? '#f59e0b' : v <= 39.5 ? '#facc15' : '#ef4444'; };
  function rUl(lt) {
    var a = k(lt, .2, 1.1), b = k(lt, .35, 1.1), c = k(lt, .3, 1.2), m = k(lt, .4, 1.4), s = k(lt, .9, 1.7);
    R.u1b.style.width = (78.33 * a) + '%'; R.u1.textContent = Math.round(47 * a) + ' dB';
    R.u2b.style.width = (73.33 * b) + '%'; R.u2.textContent = Math.round(44 * b) + ' dB';
    R.kmax.textContent = Math.round(47 * c) + ' dB'; R.kbase.textContent = Math.round(15 * c) + ' dB'; R.kn.textContent = Math.round(2 * c);
    R.mf.style.height = (78.33 * m) + '%'; R.mv.textContent = Math.round(47 * m) + ' dB';
    var v = 15 + 32 * s; R.mk.style.left = ((v - 15) / 40 * 100) + '%'; R.mk.style.color = ZC(v); R.mkv.textContent = Math.round(v) + ' dB';
  }

  /* Aceite */
  var mets = qa('[data-m]').map(function (e) {
    return { vals: e.dataset.vals.split(',').map(Number), max: +e.dataset.max, c: e.dataset.c, v: e.querySelector('[data-v]'), bars: Array.prototype.slice.call(e.querySelectorAll('.bx>i')), lbl: Array.prototype.slice.call(e.querySelectorAll('.idap-sp b')) };
  });
  var isos = qa('[data-k="iso"]');
  function rOil(lt) {
    mets.forEach(function (m, mi) {
      m.bars.forEach(function (b, i) {
        var g = k(lt, .15 + i * .2 + mi * .08, .6);
        b.style.height = (Math.max(4, m.vals[i] / m.max * 100) * g) + '%';
        b.style.background = m.c; b.style.opacity = .45 + i * .275;
        m.lbl[i].textContent = Math.round(m.vals[i] * g);
      });
      m.v.textContent = Math.round(m.vals[2] * k(lt, .15 + mi * .08, 1.2));
    });
    R.vmk.style.left = (48.89 * k(lt, .6, 1.3)) + '%';
    var w = k(lt, .7, 1.2); R.wf.style.width = (18 * w) + '%'; R.agua.textContent = Math.round(180 * w);
    isos.forEach(function (e, i) { show(e, k(lt, 1 + i * .12, .35), 6); });
    show(R.ocl, k(lt, 2, .5));
  }
  function rElec(lt) {
    R.e1.textContent = f(1.2 * k(lt, .1, 1), 1) + ' %';
    R.e2.textContent = f(3.1 * k(lt, .2, 1), 1) + ' %';
    show(R.eb, k(lt, .7, .45));
  }
  var RENDER = { res: rRes, termo: rTer, vib: rVib, ultra: rUl, aceite: rOil, elec: rElec };

  /* Bucle */
  var SEG = [['res', 0, 7.5], ['vib', 7.5, 11.5], ['termo', 11.5, 15.5], ['ultra', 15.5, 19.5], ['aceite', 19.5, 23.5], ['res', 23.5, 26]];
  // opciones.pestana: en la página de una técnica, el bucle alterna solo el resumen y esa pestaña
  var PEST = opciones.pestana && RENDER[opciones.pestana] ? opciones.pestana : null;
  if (PEST) SEG = [['res', 0, 7.5], [PEST, 7.5, 19.5], ['res', 19.5, 22]];
  var DUR = SEG[SEG.length - 1][2], t = 0, ciclo = 0, cartasListas = false;
  var pausado = false, hoverTab = null, hoverT0 = 0, lastLt = 0, activo = null;
  var visible = true, docVis = !doc.hidden, raf = 0, last = 0, tReanudar = 0, tToque = 0, ultimoTipo = 'mouse';
  var now = function () { return win.performance.now(); };

  function mostrar(tab) {
    if (tab === activo) return;
    activo = tab; manX = null;
    panes.forEach(function (p) { p.classList.toggle('on', p.dataset.pane === tab); });
    tabs.forEach(function (b) { var o = b.dataset.tab === tab; b.classList.toggle('on', o); b.setAttribute('aria-selected', o); b.lastChild.style.width = '0'; });
    cards.forEach(function (c) { c.classList.toggle('on', c.dataset.tab === tab); });
  }
  function estatico(tab) {
    mostrar(tab);
    tabs.forEach(function (b) { b.classList.add('fijo'); });
    rCards(Infinity); RENDER[tab](Infinity);
    if (tab === 'ultra') drawWave(0);
    R.aviso.classList.remove('on'); R.est.textContent = '';
  }
  function frame(ts) {
    raf = 0;
    if (!visible || !docVis) return;
    var dt = Math.min(.1, Math.max(0, (ts - last) / 1000)); last = ts;
    if (!pausado) { t += dt; if (t >= DUR) { t -= DUR; ciclo++; } }
    var tab, lt, seg = null;
    if (pausado) { tab = hoverTab; lt = (ts - hoverT0) / 1000; }
    else {
      for (var i = 0; i < SEG.length; i++) if (t >= SEG[i][1] && t < SEG[i][2]) { seg = SEG[i]; break; }
      if (!seg) seg = SEG[0];
      tab = seg[0];
      if (tab === 'res') lt = seg === SEG[0] ? (ciclo === 0 ? t - 1.5 : t + 2.5) : t - seg[1];
      else lt = t - seg[1];
    }
    lastLt = lt;
    mostrar(tab);
    RENDER[tab](lt);
    if (tab === 'ultra') drawWave(ts / 1000);
    var ct = (ciclo > 0 || pausado || cartasListas) ? Infinity : t - .3;
    if (ct > 3) cartasListas = true;
    rCards(ct);
    R.aviso.classList.toggle('on', !pausado && t < 3.2);
    if (ciclo === 0 && !pausado) show(R.aviso, k(t, 0, .4), 6);
    R.est.textContent = pausado ? 'En pausa' : 'Recorrido automático';
    tabs.forEach(function (b) {
      b.classList.toggle('fijo', pausado && b.dataset.tab === tab);
      if (!pausado && b.dataset.tab === tab && seg) b.lastChild.style.width = (100 * (t - seg[1]) / (seg[2] - seg[1])) + '%';
    });
    pedir();
  }
  function pedir() { if (!raf && visible && docVis && !quieto) { raf = win.requestAnimationFrame(frame); } }
  function reanudar() {
    win.clearTimeout(tReanudar); win.clearTimeout(tToque);
    if (quieto) return;
    pausado = false; hoverTab = null; last = now(); pedir();
  }
  function entrar(tab) {
    win.clearTimeout(tReanudar);
    if (quieto) { estatico(tab); return; }
    if (!pausado || tab !== hoverTab) {
      var keep = tab === activo && isFinite(lastLt);
      hoverTab = tab; hoverT0 = now() - (keep ? Math.max(0, lastLt) * 1000 : 0);
    }
    pausado = true; pedir();
  }
  function salir() { win.clearTimeout(tReanudar); if (!quieto) tReanudar = win.setTimeout(reanudar, 220); }
  function toque() { win.clearTimeout(tToque); tToque = win.setTimeout(reanudar, 9000); }
  var esMouse = function (e) { return e.pointerType === 'mouse' || e.pointerType === 'pen'; };

  on(raiz, 'pointerdown', function (e) { ultimoTipo = e.pointerType; if (e.pointerType === 'touch' && pausado) toque(); });
  cards.concat(tabs).forEach(function (b) {
    var tab = b.dataset.tab;
    on(b, 'pointerenter', function (e) { if (esMouse(e)) entrar(tab); });
    on(b, 'pointerleave', function (e) { if (esMouse(e)) salir(); });
    on(b, 'click', function () { entrar(tab); if (ultimoTipo === 'touch') toque(); });
    on(b, 'focus', function () { entrar(tab); });
    on(b, 'blur', function () { if (ultimoTipo !== 'touch') salir(); });
  });
  on(R.stage, 'pointerenter', function (e) { if (esMouse(e) && activo) entrar(pausado ? hoverTab : activo); });
  on(R.stage, 'pointerleave', function (e) { if (esMouse(e)) salir(); });
  qa('[data-k="fr"]').forEach(function (fr) {
    var mover = function (e) {
      var r = fr.getBoundingClientRect(); manX = cl((e.clientX - r.left) / r.width);
      if (e.pointerType === 'touch') { if (!pausado) entrar(activo); toque(); }
      if (quieto) rTer(Infinity);
    };
    on(fr, 'pointermove', mover); on(fr, 'pointerdown', mover);
  });

  var ro = new win.ResizeObserver(function () { buildVib(); buildSpec(); buildWave(); if (quieto) estatico(activo || 'res'); });
  [R.vch, R.spc, R.wv].forEach(function (e) { ro.observe(e); });
  var io = new win.IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; if (visible) { last = now(); pedir(); } }, { threshold: .1 });
  io.observe(raiz);
  on(doc, 'visibilitychange', function () { docVis = !doc.hidden; if (docVis) { last = now(); pedir(); } });
  if (opciones.reducido == null) on(mq, 'change', function () {
    quieto = mq.matches;
    if (quieto) { if (raf) win.cancelAnimationFrame(raf); raf = 0; estatico(PEST || 'res'); }
    else { tabs.forEach(function (b) { b.classList.remove('fijo'); }); pausado = false; last = now(); pedir(); }
  });

  buildVib(); buildSpec(); buildWave();
  if (quieto) estatico(PEST || 'res');
  else { mostrar('res'); rCards(-1); rRes(-2); last = now(); pedir(); }

  return function limpiar() {
    if (raf) win.cancelAnimationFrame(raf); raf = 0; quieto = true;
    win.clearTimeout(tReanudar); win.clearTimeout(tToque);
    ro.disconnect(); io.disconnect();
    offs.forEach(function (o) { o(); }); offs = [];
  };
}
