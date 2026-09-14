/**
 * Lógica de la animación "Así se ve la misma inspección en IDAP".
 *
 * Portada casi verbatim del diseño hecho en Claude Diseño
 * (docs/designs/IDAP inspeccion.html). Se mantiene en JavaScript plano
 * para no reescribir con tipos un guion de doscientas líneas que ya
 * funciona; el componente de React (EscenaIdap) solo lo monta y lo limpia.
 *
 * Cambios respecto al original: todo se busca dentro de `root` en lugar
 * de en `document`, para poder tener la escena en cualquier página; la
 * disciplina que se abre en el bucle es configurable; las imágenes
 * térmicas reales se colocan en los huecos data-slot; y devuelve una
 * función de limpieza que detiene el bucle y quita los oyentes.
 *
 * @param {HTMLElement} root  El div .idap ya insertado en el DOM.
 * @param {{ disciplina?: "term"|"vib"|"us", imagenes?: { principal?: string, miniaturas?: string[], visual?: string } }} opciones
 * @returns {() => void} limpieza
 */
export function montarIdap(root, opciones) {
  var DISC = (opciones && opciones.disciplina) || "vib";
  var imgs = (opciones && opciones.imagenes) || {};
  var $ = function (id) { return root.querySelector("#" + id); };

  /* Imágenes reales en los huecos del diseño */
  var slots = { "termica-principal": imgs.principal, visual: imgs.visual };
  (imgs.miniaturas || []).forEach(function (src, i) { slots["termica-" + (i + 1)] = src; });
  Object.keys(slots).forEach(function (k) {
    var el = root.querySelector('img[data-slot="' + k + '"]');
    if (el && slots[k]) el.setAttribute("src", slots[k]);
  });

  var toast = $("toast"), reco = $("reco"), panel = $("panel"), tabsEl = $("tabs");
  var cards = [].slice.call(root.querySelectorAll(".card")), tabs = [].slice.call(root.querySelectorAll(".tab")), panes = [].slice.call(root.querySelectorAll(".pane"));
  var counts = cards.map(function (c) { return [].slice.call(c.querySelectorAll("[data-count]")); });
  var badges = cards.map(function (c) { return c.querySelector(".st .badge"); });
  var vel = [].slice.call(root.querySelectorAll("[data-vel]")), acc1 = $("acc1"), acc2 = $("acc2");
  var usPane = root.querySelector("[data-pane=us]"), scope = $("scope"), cv = $("cv"), ctx = cv.getContext("2d");
  var thVis = $("thVis"), visImg = thVis.querySelector("img");
  var specV = $("specV"), specA = $("specA");

  (function buildSpectra() {
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var NS = "http://www.w3.org/2000/svg";
    function rect(g, x, w, h, fill, cls, idx, prop) { var r = document.createElementNS(NS, "rect"); r.setAttribute("x", x); r.setAttribute("y", 100 - h); r.setAttribute("width", w); r.setAttribute("height", h); r.setAttribute("fill", fill); r.setAttribute("class", cls); r.style.setProperty(prop, idx); g.appendChild(r); }
    function fill(spec, peaks, pkClass) {
      var g = spec.querySelector(".bars"), pg = spec.querySelector(".pks") || g;
      if (g.childElementCount) return; // ya construido (StrictMode monta dos veces)
      for (var i = 0; i < 40; i++) {
        var at = peaks.filter(function (p) { return p.i === i; })[0];
        if (at && pkClass === "bar") { rect(g, i * 10 + 2, 6, at.h, at.fill, "bar", i, "--i"); }
        else { rect(g, i * 10 + 2, 6, 6 + rnd() * 16, "#334155", "bar", i, "--i"); }
      }
      if (pkClass === "pk") peaks.forEach(function (p, j) { rect(pg, p.i * 10 + 2, 6, p.h, p.fill, "pk", j, "--j"); });
    }
    fill(specV, [{ i: 6, h: 58, fill: "#22c55e" }, { i: 12, h: 40, fill: "#22c55e" }, { i: 18, h: 28, fill: "#22c55e" }], "bar");
    fill(specA, [{ i: 7, h: 78, fill: "#facc15" }, { i: 14, h: 52, fill: "rgba(250,204,21,.65)" }, { i: 21, h: 40, fill: "rgba(250,204,21,.6)" }, { i: 28, h: 30, fill: "rgba(250,204,21,.55)" }], "pk");
  })();

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = 12, HOLD = 9;
  var TL = { toastIn: 0.7, toastOut: 2.3, count: [2.4, 2.65, 2.9], countDur: 1, tab: 4.2, vel: 4.5, velStep: 0.2, acc1: 5.9, acc2: 6.2, spec: 5.6, pk: 6.9, reco: 7.4, fade: 11.2 };
  var t = reduce ? HOLD : 0, paused = false, forced = null, last = null, lastPointer = "mouse", phase = 0, scopeHov = false;
  function ease(p) { return 1 - Math.pow(1 - p, 3); }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  function render() {
    var op = t < 0.4 ? t / 0.4 : t > TL.fade ? 1 - (t - TL.fade) / (DUR - TL.fade) : 1;
    root.style.opacity = (reduce || forced) ? 1 : Math.max(0, op);
    toast.classList.toggle("in", !reduce && t >= TL.toastIn && t < TL.toastOut);
    cards.forEach(function (c, i) {
      var p = clamp((t - TL.count[i]) / TL.countDur), on = t >= TL.count[i];
      c.classList.toggle("on", on);
      counts[i].forEach(function (b) { var f = parseFloat(b.dataset.count), d = +b.dataset.dec; b.textContent = (f * ease(p)).toFixed(d); });
      badges[i].classList.toggle("pop", p >= 1);
    });
    // La pestaña que se abre sola es la disciplina de la página.
    var tab = forced || (t >= TL.tab ? DISC : "res");
    tabs.forEach(function (b) { b.classList.toggle("active", b.dataset.tab === tab); });
    var pane = tab === "res" ? DISC : tab;
    panes.forEach(function (p) { p.classList.toggle("show", p.dataset.pane === pane); });
    cards.forEach(function (c) { c.classList.toggle("active", forced === c.dataset.tab); });
    var fin = !!forced || DISC !== "vib";
    vel.forEach(function (el, k) { el.classList.toggle("on", fin || t >= TL.vel + k * TL.velStep); });
    acc1.classList.toggle("on", fin || t >= TL.acc1);
    acc2.classList.toggle("on", fin || t >= TL.acc2);
    acc2.classList.toggle("pulse", !fin && t >= TL.acc2 && t < TL.acc2 + 1.4);
    reco.classList.toggle("in", fin || t >= TL.reco);
    [specV, specA].forEach(function (s) { s.classList.toggle("on", fin || t >= TL.spec); s.classList.toggle("pk-on", fin || t >= TL.pk); });
    thVis.classList.toggle("has", !!visImg.getAttribute("src"));
  }

  /* osciloscopio */
  function drawScope() {
    var w = scope.clientWidth, h = scope.clientHeight, dpr = window.devicePixelRatio || 1;
    if (!w || !h) return;
    var W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1; ctx.beginPath();
    var i, x, y;
    for (i = 1; i < 12; i++) { x = Math.round(i * w / 12) + 0.5; ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (i = 1; i < 4; i++) { y = Math.round(i * h / 4) + 0.5; ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    var mid = h / 2, A = h * 0.07, P = w / 4.5, k = 200 / w;
    function green(s) { return mid + A * Math.sin(s * 0.11 * k * 3) + A * 0.35 * Math.sin(s * 0.27 * k * 3 + 1); }
    function red(s) {
      var base = 3 * A * (Math.sin(s * 0.09 * k * 3) * 0.55 + Math.sin(s * 0.23 * k * 3 + 2) * 0.3 + Math.sin(s * 0.61 * k * 3 + 0.7) * 0.15);
      var d = ((s % P) + P) % P; if (d > P / 2) d -= P;
      var spike = Math.exp(-Math.abs(d) / (P * 0.014)) * 4.5 * A;
      return mid + base - spike;
    }
    ctx.lineJoin = "round";
    ctx.strokeStyle = scopeHov ? "rgba(34,197,94,.25)" : "#22c55e"; ctx.lineWidth = 1.5; ctx.beginPath();
    for (x = 0; x <= w; x += 2) { y = green(x + phase); if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    var first = 0;
    if (scopeHov) {
      first = ((P - (phase % P)) % P + P) % P;
      ctx.strokeStyle = "rgba(239,68,68,.28)"; ctx.lineWidth = 1; ctx.beginPath();
      for (x = first; x <= w; x += P) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      ctx.stroke();
    }
    ctx.strokeStyle = scopeHov ? "#f87171" : "#ef4444"; ctx.lineWidth = scopeHov ? 2 : 1.5; ctx.beginPath();
    for (x = 0; x <= w; x += 1) { y = red(x + phase); if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    if (scopeHov) {
      ctx.fillStyle = "#fff";
      for (x = first; x <= w; x += P) { ctx.beginPath(); ctx.arc(x, red(x + phase), 2.5, 0, Math.PI * 2); ctx.fill(); }
    }
  }

  var vivo = true, raf = 0;
  function frame(now) {
    if (!vivo) return;
    var dt = last == null ? 0 : Math.min(0.1, (now - last) / 1000);
    if (!reduce) {
      if (!paused) { t += dt; if (t >= DUR) { t -= DUR; root.classList.add("noanim"); render(); void root.offsetWidth; root.classList.remove("noanim"); } }
      phase += dt * 70;
    }
    last = now; render();
    if (usPane.classList.contains("show")) drawScope();
    raf = requestAnimationFrame(frame);
  }

  var ac = new AbortController(), sig = { signal: ac.signal };
  function setForced(tab) { forced = tab; paused = !!tab; render(); }
  function inLower(el) { return !!el && (panel.contains(el) || tabsEl.contains(el)); }
  cards.forEach(function (c) {
    c.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType; }, sig);
    c.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") setForced(c.dataset.tab); }, sig);
    c.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" && !inLower(e.relatedTarget)) setForced(null); }, sig);
    c.addEventListener("click", function (e) { if (lastPointer !== "mouse") { e.stopPropagation(); setForced(forced === c.dataset.tab ? null : c.dataset.tab); } }, sig);
    c.addEventListener("focus", function () { setForced(c.dataset.tab); }, sig);
    c.addEventListener("blur", function () { setForced(null); }, sig);
  });
  [panel, tabsEl].forEach(function (el) {
    el.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "mouse" && forced && !inLower(e.relatedTarget) && !cards.some(function (c) { return c.contains(e.relatedTarget); })) setForced(null);
    }, sig);
  });
  tabs.forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); setForced(forced === b.dataset.tab ? null : b.dataset.tab); }, sig); });
  root.addEventListener("click", function (e) { if (forced && !inLower(e.target)) setForced(null); }, sig);
  var hlT;
  specA.addEventListener("pointerenter", function () { reco.classList.add("hl"); clearTimeout(hlT); hlT = setTimeout(function () { reco.classList.remove("hl"); }, 900); }, sig);
  reco.addEventListener("pointerenter", function () { specA.classList.add("hl"); }, sig);
  reco.addEventListener("pointerleave", function () { specA.classList.remove("hl"); }, sig);
  scope.addEventListener("pointerenter", function () { scopeHov = true; }, sig);
  scope.addEventListener("pointerleave", function () { scopeHov = false; }, sig);

  render();
  raf = requestAnimationFrame(frame);

  return function limpiar() {
    vivo = false;
    cancelAnimationFrame(raf);
    clearTimeout(hlT);
    ac.abort();
  };
}
