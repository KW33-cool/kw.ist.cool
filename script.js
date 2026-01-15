/* Scroll-story logic + map layers (Leaflet)
   Fix for timing: active step is chosen by the element closest to the viewport center. */
(() => {
  const steps = Array.from(document.querySelectorAll('.step'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const map = L.map('map', { zoomControl: true, worldCopyJump: true, scrollWheelZoom: false, dragging: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 18
  }).addTo(map);

  const USA = {"type":"Feature","properties":{"name":"USA"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-124.7,48.8],[-124.7,32.5],[-114.1,32.5],[-111.0,31.3],[-104.0,29.3],[-97.0,25.6],[-80.0,24.3],[-66.9,44.8],[-75.2,45.1],[-83.1,46.2],[-95.2,49.0],[-110.8,49.0],[-124.7,48.8]]],[[[-168.0,71.0],[-168.0,54.0],[-140.0,54.0],[-130.0,60.0],[-141.0,70.0],[-168.0,71.0]]],[[[-161.0,22.6],[-161.0,18.9],[-154.5,18.9],[-154.5,22.6],[-161.0,22.6]]]]}};
  const GRN = {"type":"Feature","properties":{"name":"Grönland"},"geometry":{"type":"Polygon","coordinates":[[[-73.0,83.0],[-10.0,83.0],[-10.0,60.0],[-25.0,59.0],[-44.0,59.0],[-58.0,62.0],[-73.0,70.0],[-73.0,83.0]]]}};

  const usaLayer = L.geoJSON(USA, { style: () => ({ color: 'rgba(255,255,255,.0)', weight: 1, fillColor: '#2DD4BF', fillOpacity: .33 })}).addTo(map);
  const grnLayer = L.geoJSON(GRN, { style: () => ({ color: 'rgba(255,255,255,.0)', weight: 1, fillColor: '#A78BFA', fillOpacity: .33 })}).addTo(map);

  const pituffik = L.marker([76.54, -68.75], { title: 'Pituffik Space Base' })
    .bindPopup('<b>Pituffik Space Base</b><br/>US‑Radar &amp; Raumlage (Frühwarnung / UEWR).');

  const giuk = L.circle([64.5, -25.0], { radius: 520000, color: 'rgba(255,255,255,.18)', weight: 1, fillColor: '#60A5FA', fillOpacity: .12 })
    .bindPopup('<b>GIUK‑Gap</b><br/>Maritimes Nadelöhr zwischen Grönland–Island–UK.');

  const shipping = L.polyline([[40.7,-74.0],[65.0,-20.0],[72.0,-10.0],[55.7,12.6],[52.5,13.4]],
    { color: '#F59E0B', weight: 2, opacity: .7, dashArray: '6 8' })
    .bindPopup('<b>Nördliche Routen (schematisch)</b><br/>Kürzere Wege – aber neue Konflikte &amp; Regeln.');

  const minerals = L.circle([62.0, -45.0], { radius: 380000, color: 'rgba(255,255,255,.18)', weight: 1, fillColor: '#A78BFA', fillOpacity: .10 })
    .bindPopup('<b>Rohstoffe (schematisch)</b><br/>Seltene Erden &amp; kritische Mineralien.');

  const overlays = { pituffik, giuk, shipping, minerals };

  function clearOverlays(){ Object.values(overlays).forEach(l => map.hasLayer(l) && map.removeLayer(l)); }
  function setHighlight(u,g){ usaLayer.setStyle({ fillOpacity: u }); grnLayer.setStyle({ fillOpacity: g }); }
  function focus(boundsOrCenter, zoom){
    if(boundsOrCenter instanceof L.LatLngBounds){
      map.fitBounds(boundsOrCenter.pad(0.18), { animate: !prefersReduced, duration: 0.65 });
    } else {
      map.setView(boundsOrCenter, zoom, { animate: !prefersReduced, duration: 0.65 });
    }
  }

  const allBounds = L.latLngBounds([]);
  allBounds.extend(usaLayer.getBounds());
  allBounds.extend(grnLayer.getBounds());
  focus(allBounds);

  let activeIndex = -1;
  let ticking = false;

  function findActiveStep(){
    const centerY = window.innerHeight * 0.52;
    let bestIdx = 0;
    let bestDist = Infinity;
    steps.forEach((el, idx) => {
      const r = el.getBoundingClientRect();
      const c = r.top + r.height * 0.5;
      const d = Math.abs(c - centerY);
      if(d < bestDist){ bestDist = d; bestIdx = idx; }
    });
    return bestIdx;
  }

  function animateStep(el){
    if(prefersReduced || !window.gsap) return;
    gsap.fromTo(el, { y: 16, opacity: .0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' });
  }

  function updateMap(step){
    clearOverlays();
    switch(step){
      case 0: setHighlight(.32,.32); focus(allBounds); break;
      case 1: setHighlight(.22,.42); focus([63,-40],3); break;
      case 2: setHighlight(.18,.52); pituffik.addTo(map); focus([75.2,-60],4); break;
      case 3: setHighlight(.20,.42); giuk.addTo(map); focus([63.5,-25.0],4); break;
      case 4: setHighlight(.20,.36); shipping.addTo(map); focus([60.5,-20.0],3); break;
      case 5: setHighlight(.18,.46); minerals.addTo(map); focus([61.5,-42.0],3); break;
      case 6: setHighlight(.26,.40); pituffik.addTo(map); giuk.addTo(map); focus(allBounds); break;
      case 7: setHighlight(.26,.36); focus(allBounds); break;
      case 8: setHighlight(.22,.34); focus([66.5,-35.0],3); break;
      case 9: setHighlight(.20,.22); focus([67.0,-37.0],3); break;
      case 10: setHighlight(.24,.24); focus(allBounds); break;
      case 11: setHighlight(.30,.34); focus([66.5,-35.0],3); break;
      case 12: setHighlight(.22,.22); focus(allBounds); break;
      default: setHighlight(.30,.30); focus(allBounds);
    }
  }

  function setActive(idx){
    if(idx === activeIndex) return;
    activeIndex = idx;
    steps.forEach((s,i) => s.classList.toggle('active', i === idx));
    const step = Number(steps[idx].dataset.step || "0");
    updateMap(step);
    animateStep(steps[idx]);
  }

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActive(findActiveStep());
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  if(!prefersReduced && window.gsap){
    gsap.from('.badge', { y: 10, opacity: 0, duration: .6, ease: 'power3.out' });
    gsap.from('h1', { y: 18, opacity: 0, duration: .7, ease: 'power3.out', delay: .05 });
    gsap.from('.lead', { y: 18, opacity: 0, duration: .7, ease: 'power3.out', delay: .12 });
    gsap.from('.meta__chip', { y: 10, opacity: 0, duration: .6, ease: 'power3.out', stagger: .08, delay: .2 });
    gsap.from('.hero__actions .btn', { y: 10, opacity: 0, duration: .6, ease: 'power3.out', stagger: .08, delay: .28 });
  }

  onScroll();
})();
