(() => {
  // MASTER TEXT (used by BOTH website and print)
  const CONTENT = {
    lead: "Ich zeige heute, warum Grönland plötzlich ein Thema ist – und was Donald Trump damit zu tun hat. Ich erkläre es in 6 Aufgaben.",
    note: "Merksatz: Grönland gehört politisch zu Dänemark. Trotzdem entscheiden die Menschen auf Grönland bei vielen Dingen selbst.",
    steps: [
      {
        n: 1,
        title: "Warum ist Grönland wichtig?",
        blocks: [
          { p: "Grönland liegt ganz weit im Norden – zwischen Nordamerika und Europa. Genau diese Lage ist der Punkt: Von dort aus kann man im Norden sehr viel beobachten." },
          { sub: "Was passiert gerade (Stand Januar 2026)?" },
          { p: "Donald Trump sagt offen, die USA sollten Grönland „kaufen“ oder wenigstens mehr Kontrolle bekommen. Dänemark und Grönland sagen aber klar: Grönland steht nicht zum Verkauf – und die Menschen dort entscheiden selbst." }
        ]
      },
      {
        n: 2,
        title: "Warum ist das militärisch wichtig?",
        blocks: [
          { p: "Auf Grönland gibt es bei Pituffik (früher Thule) eine große US-Anlage. Dort kann man mit Radar früher sehen, wenn im Norden etwas in der Luft passiert. So kann man schneller reagieren." }
        ]
      },
      {
        n: 3,
        title: "Warum geht es auch um Wege und Rohstoffe?",
        blocks: [
          { p: "In der Arktis wird es wärmer. Wenn das Eis weniger wird, werden manche Schiffswege wichtiger. Außerdem gibt es in der Gegend Rohstoffe, die viele Länder haben wollen. Das macht Streit leider wahrscheinlicher." }
        ]
      },
      {
        n: 4,
        title: "Was ist die NATO? (ganz einfach)",
        blocks: [
          { p: "Die USA, Deutschland und Dänemark sind in der NATO. Das ist ein Bündnis. Die Länder haben versprochen: Wenn eines angegriffen wird, helfen die anderen." }
        ]
      },
      {
        n: 5,
        title: "Und wenn sich zwei NATO-Länder streiten?",
        blocks: [
          { p: "Dann wird es kompliziert. Eigentlich sollen NATO-Länder zusammenhalten. Wenn es Streit gibt, müssen sie reden und Lösungen finden – sonst gibt es Ärger im Bündnis und alle fühlen sich unsicherer." }
        ]
      },
      {
        n: 6,
        title: "Fazit",
        blocks: [
          { p: "Grönland ist wichtig wegen seiner Lage im Norden. Aber Drohen oder „kaufen wollen“ macht alles schlimmer. Am besten lösen Länder so etwas durch Gespräche – sonst wird das schnell ein Albtraum." }
        ]
      }
    ]
  };

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderSite() {
    const lead = document.getElementById("lead");
    const note = document.getElementById("note");
    const container = document.getElementById("sections");
    if (!container) return;

    if (lead) lead.textContent = CONTENT.lead;
    if (note) note.textContent = CONTENT.note;

    container.innerHTML = "";
    for (const s of CONTENT.steps) {
      const sec = el("section", "step", "");
      sec.dataset.step = String(s.n);

      const badge = el("div", "badge", String(s.n));
      const h = el("h3", "", s.title);
      sec.appendChild(badge);
      sec.appendChild(h);

      for (const b of s.blocks) {
        if (b.sub) sec.appendChild(el("div", "subhead", b.sub));
        if (b.p) sec.appendChild(el("p", "", b.p));
      }
      container.appendChild(sec);
    }
  }

  function renderPrint() {
    const lead = document.getElementById("printLead");
    const wrap = document.getElementById("printSections");
    if (!wrap) return;

    if (lead) lead.textContent = CONTENT.lead;

    wrap.innerHTML = "";
    wrap.appendChild(el("h2", "", "Kurz gesagt"));
    wrap.appendChild(el("p", "", CONTENT.lead));
    wrap.appendChild(el("p", "", CONTENT.note));
    wrap.appendChild(el("hr", "", ""));

    for (const s of CONTENT.steps) {
      wrap.appendChild(el("h2", "", `Aufgabe ${s.n}: ${s.title}`));
      for (const b of s.blocks) {
        if (b.sub) wrap.appendChild(el("h3", "", b.sub));
        if (b.p) wrap.appendChild(el("p", "", b.p));
      }
    }
  }

  renderSite();
  renderPrint();

  // Map only on site
  const mapDiv = document.getElementById("map");
  if (!mapDiv || typeof L === "undefined") return;

  const stepsEls = Array.from(document.querySelectorAll(".step"));

  const map = L.map("map", {
    zoomControl: false,
    worldCopyJump: true,
    scrollWheelZoom: false
  }).setView([57, -30], 2);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 8,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  const usaStyle = { color: "#60a5fa", weight: 2, fillColor: "#60a5fa", fillOpacity: 0.18 };
  const grlStyle = { color: "#34d399", weight: 2, fillColor: "#34d399", fillOpacity: 0.18 };

  const GEO_USA = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA.geo.json";
  const GEO_GRL = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/GRL.geo.json";

  let usaLayer = null;
  let grlLayer = null;

  function rect(boundsLngLat) {
    const [[w,s],[e,n]] = boundsLngLat;
    return L.polygon([[s,w],[s,e],[n,e],[n,w]], { interactive: false });
  }

  function addFallback() {
    if (!usaLayer) {
      usaLayer = L.featureGroup([
        rect([[-125,24],[-66,49]]).setStyle(usaStyle),
        rect([[-170,51],[-130,72]]).setStyle(usaStyle),
        rect([[-161,18],[-154,23]]).setStyle(usaStyle),
      ]).addTo(map);
    }
    if (!grlLayer) {
      grlLayer = L.featureGroup([
        rect([[-74,59],[-11,83]]).setStyle(grlStyle)
      ]).addTo(map);
    }
  }

  async function loadCountry(url, styleObj) {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    const gj = await res.json();
    return L.geoJSON(gj, { style: styleObj, interactive: false });
  }

  const pituffik = L.circleMarker([76.5, -68.7], { radius: 7, color: "#34d399", weight: 2, fillOpacity: 0.25 });
  const pituffikTip = L.tooltip({ permanent: true, direction: "top", offset: [0,-8], className: "labelTip" })
    .setContent("Pituffik").setLatLng([76.5, -68.7]);

  const style = document.createElement("style");
  style.textContent = `
    .labelTip{
      background: rgba(0,0,0,.45);
      border: 1px solid rgba(255,255,255,.18);
      color: rgba(229,231,235,.98);
      border-radius: 10px;
      padding: 6px 8px;
      font-size: 12px;
      box-shadow: 0 18px 40px rgba(0,0,0,.35);
      backdrop-filter: blur(8px);
    }
    .leaflet-tooltip-top:before{ display:none; }
  `;
  document.head.appendChild(style);

  function setMarkers(showPituffik) {
    [pituffik, pituffikTip].forEach(x => { if (map.hasLayer(x)) map.removeLayer(x); });
    if (showPituffik) { pituffik.addTo(map); pituffikTip.addTo(map); }
  }

  function boundsOf(layer, fallback) {
    try { if (layer && layer.getBounds) return layer.getBounds(); } catch {}
    return fallback;
  }

  function flyToStep(stepNum) {
    const usaFallback = L.latLngBounds([24,-170],[72,-66]);
    const grlFallback = L.latLngBounds([59,-75],[84,-10]);
    const northB = L.latLngBounds([30,-170],[85,40]);

    const grlB = boundsOf(grlLayer, grlFallback);

    const cfg = {
      1: { b: grlB.pad(0.22), pit: false },
      2: { b: grlB.pad(0.18), pit: true },
      3: { b: northB, pit: true },
      4: { b: northB, pit: false },
      5: { b: northB, pit: false },
      6: { b: northB, pit: true },
    }[stepNum];

    if (!cfg) return;
    map.flyToBounds(cfg.b, { padding: [24,24], duration: 1.05 });
    setMarkers(cfg.pit);
  }

  function computeActiveStep() {
    const mid = window.innerHeight * 0.5;
    let best = null, bestDist = Infinity;
    for (const el of stepsEls) {
      const r = el.getBoundingClientRect();
      const elMid = r.top + r.height * 0.5;
      const d = Math.abs(elMid - mid);
      if (d < bestDist) { bestDist = d; best = el; }
    }
    return best;
  }

  let activeStep = null;
  let rafPending = false;

  function update() {
    rafPending = false;
    const best = computeActiveStep();
    if (!best) return;
    if (best !== activeStep) {
      if (activeStep) activeStep.classList.remove("is-active");
      activeStep = best;
      activeStep.classList.add("is-active");
      flyToStep(parseInt(activeStep.dataset.step, 10));
    }
  }

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  Promise.allSettled([
    loadCountry(GEO_USA, usaStyle),
    loadCountry(GEO_GRL, grlStyle),
  ]).then((results) => {
    const [usaRes, grlRes] = results;
    if (usaRes.status === "fulfilled") usaLayer = usaRes.value.addTo(map);
    if (grlRes.status === "fulfilled") grlLayer = grlRes.value.addTo(map);
    if (!usaLayer || !grlLayer) addFallback();

    stepsEls[0]?.classList.add("is-active");
    flyToStep(1);
  }).catch(() => {
    addFallback();
    stepsEls[0]?.classList.add("is-active");
    flyToStep(1);
  });
})();