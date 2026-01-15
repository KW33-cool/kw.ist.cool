/*
  USA & Grönland – interaktive Klick-/Scroll-Story (GitHub Pages)
  Version: v10

  - 5 Aufgaben (Buttons anklickbar), jede Aufgabe mind. 5 Sätze
  - Karte reagiert beim Klicken UND beim Scrollen
  - Druckseite zeigt exakt dieselben Inhalte
*/

(() => {
  const VERSION = 'v10';

  // -------------------- TEXT (6. Klasse, vorlesbar) --------------------
  const LEAD =
    'Heute geht es um Grönland und darum, warum gerade darüber gestritten wird. ' +
    'Ich erkläre das in fünf Aufgaben – so, dass man es in der 6. Klasse gut verstehen und vorlesen kann.';

  const NOTE =
    'Wichtig: Auf vielen flachen Karten wirkt Grönland riesig. Das liegt an der Karten-Art (Projektion) – dazu sage ich in Aufgabe 5 etwas.';

  const tasks = [
    {
      key: 'a1',
      short: 'Was passiert gerade?',
      title: '1) Was passiert gerade (Januar 2026)?',
      text: [
        'Im Januar 2026 sorgt ein Thema für viel Streit: Grönland. Donald Trump sagt, die USA sollten mehr Einfluss oder Kontrolle über Grönland bekommen.',
        'Grönland gehört zu Dänemark, aber die Menschen in Grönland wollen selbst entscheiden, was mit ihrer Insel passiert.',
        'Darum sagen Dänemark und Grönland: „Grönland steht nicht zum Verkauf.“',
        'In den Nachrichten fällt dabei manchmal sogar das Wort „Eroberung“ – das klingt hart und macht vielen Angst.',
        'Für uns ist wichtig: Es geht nicht um einen Film, sondern um echte Politik und um die Frage, wer über ein Land bestimmen darf.'
      ],
      map: 'overview'
    },
    {
      key: 'a2',
      short: 'Warum ist Grönland wichtig?',
      title: '2) Warum Grönland überhaupt wichtig ist',
      text: [
        'Grönland liegt weit im Norden – zwischen Nordamerika und Europa. Genau diese Lage macht die Insel interessant.',
        'Wenn Länder dort Stützpunkte haben, können sie den Himmel und den Ozean besser beobachten.',
        'Außerdem verändern sich im Norden durch das Klima manche Eisschichten, und dadurch werden neue Wege über das Meer wichtiger.',
        'Und: In Grönland gibt es viele Rohstoffe, die man für Handys, Batterien und Technik brauchen kann.',
        'Kurz gesagt: Grönland ist nicht „nur Eis“, sondern ein Ort, der für Sicherheit, Wege und Rohstoffe eine Rolle spielt.'
      ],
      map: 'greenland'
    },
    {
      key: 'a3',
      short: 'Militär & Radar',
      title: '3) Militär: Radar, Frühwarnung und Weltraum',
      text: [
        'Im Nordwesten von Grönland gibt es eine US-Basis, die heute Pituffik Space Base heißt (früher Thule).',
        'Dort stehen Radare, die helfen sollen, früh zu merken, wenn irgendwo Raketen oder Flugkörper unterwegs wären.',
        'So ein „Frühwarnen“ kann im Ernstfall Minuten bringen – und das ist bei großen Entfernungen entscheidend.',
        'Außerdem geht es um Satelliten und darum, was im Weltraum passiert, weil viele Geräte über Satelliten funktionieren.',
        'Darum schauen die USA und auch andere Länder sehr genau auf diesen Teil von Grönland.'
      ],
      map: 'pituffik'
    },
    {
      key: 'a4',
      short: 'Wege & Rohstoffe',
      title: '4) Neue Seewege und Rohstoffe',
      text: [
        'Wenn im Sommer im Norden weniger Eis liegt, können Schiffe manchmal weiter nördlich fahren als früher.',
        'Das kann Wege zwischen Europa, Amerika und Asien verkürzen – also Zeit und Geld sparen.',
        'Gleichzeitig wird dann wichtiger, wer dort Regeln macht und wer im Notfall hilft oder kontrolliert.',
        'Zusätzlich interessieren viele Länder die Rohstoffe in Grönland, zum Beispiel seltene Metalle für Technik.',
        'Genau deshalb reden Politik und Wirtschaft so viel über Grönland – weil es um Wege, Regeln und Ressourcen geht.'
      ],
      map: 'routes'
    },
    {
      key: 'a5',
      short: 'Warum wirkt Grönland so groß?',
      title: '5) Warum wirkt Grönland auf der Karte so groß?',
      text: [
        'Auf meinem Globus sieht Grönland viel kleiner aus als auf vielen Weltkarten – und das ist kein Fehler vom Globus.',
        'Eine Weltkarte ist flach, aber die Erde ist rund. Wenn man eine Kugel „platt drückt“, werden Formen und Größen verzerrt.',
        'Viele Karten machen Länder in der Nähe der Pole größer, als sie wirklich sind – deshalb wirkt Grönland oft riesig.',
        'Afrika ist in echt viel größer als Grönland, aber auf manchen Karten sieht es anders aus.',
        'Für meinen Vortrag heißt das: Ich zeige die Karte, aber ich sage dazu, dass Karten manchmal tricksen – und der Globus zeigt die Größen besser.'
      ],
      map: 'projection'
    }
  ];

  // -------------------- Seite erkennen --------------------
  const isPrint = document.body.classList.contains('print') || !!document.getElementById('printSections');

  // -------------------- Render Text (index + print) --------------------
  function renderText() {
    // Version in Footer
    document.querySelectorAll('[data-version]').forEach((el) => (el.textContent = VERSION));

    // Lead
    const leadEl = document.getElementById('lead') || document.getElementById('printLead');
    if (leadEl) leadEl.textContent = LEAD;

    // Note (nur Startseite)
    const noteEl = document.getElementById('note');
    if (noteEl) noteEl.textContent = NOTE;

    // Sections
    const sectionsWrap = document.getElementById('sections') || document.getElementById('printSections');
    if (!sectionsWrap) return;

    sectionsWrap.innerHTML = '';

    tasks.forEach((t, i) => {
      const sec = document.createElement('section');
      sec.className = 'section';
      sec.id = t.key;
      sec.dataset.step = String(i);

      const h = document.createElement('h3');
      h.textContent = t.title;
      sec.appendChild(h);

      t.text.forEach((pText) => {
        const p = document.createElement('p');
        p.textContent = pText;
        sec.appendChild(p);
      });

      sectionsWrap.appendChild(sec);
    });
  }

  // -------------------- Aufgaben-Buttons (nur Startseite) --------------------
  function renderTaskbar(onSelect) {
    const bar = document.getElementById('taskbar');
    if (!bar) return;

    bar.innerHTML = '';
    tasks.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.step = String(i);
      btn.textContent = `${i + 1}) ${t.short}`;
      btn.addEventListener('click', () => onSelect(i, true));
      bar.appendChild(btn);
    });
  }

  function setActiveButton(idx) {
    const bar = document.getElementById('taskbar');
    if (!bar) return;
    bar.querySelectorAll('button').forEach((b) => b.classList.toggle('active', Number(b.dataset.step) === idx));
  }

  // -------------------- Karte --------------------
  let map = null;
  let overlays = [];

  function clearOverlays() {
    overlays.forEach((l) => {
      try { map.removeLayer(l); } catch (_) {}
    });
    overlays = [];
  }

  function addOverlay(layer) {
    overlays.push(layer);
    layer.addTo(map);
    return layer;
  }

  function makeMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return null;

    // Karte
    map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true
    });

    // Basemap (hell, weil Text dunkel)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 18
    }).addTo(map);

    // Startansicht: Nordatlantik
    map.setView([60, -35], 2);

    return map;
  }

  // „Markierungen“ (einfach & stabil, ohne schwere GeoJSON-Grenzen)
  const BOUNDS = {
    greenland: L.latLngBounds([59, -74], [83, -10]),
    usa: L.latLngBounds([24, -125], [50, -66])
  };

  function updateMapFor(taskIndex) {
    if (!map) return;

    clearOverlays();

    const t = tasks[taskIndex];
    const style = {
      color: '#2d6cdf',
      weight: 3,
      fillColor: '#2d6cdf',
      fillOpacity: 0.12
    };

    // Grund-Highlights: USA + Grönland (wie „eingekreist“)
    const usaRect = addOverlay(L.rectangle(BOUNDS.usa, style));
    const grnRect = addOverlay(L.rectangle(BOUNDS.greenland, { ...style, color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.12 }));

    // Je nach Aufgabe zusätzliche Marker
    if (t.map === 'overview') {
      map.fitBounds(BOUNDS.greenland.pad(0.35));
      usaRect.bindPopup('<b>USA</b><br>weit weg – aber politisch beteiligt.');
      grnRect.bindPopup('<b>Grönland</b><br>gehört zu Dänemark, entscheidet aber auch selbst mit.');
    }

    if (t.map === 'greenland') {
      map.fitBounds(BOUNDS.greenland.pad(0.25));
      addOverlay(L.marker([64.18, -51.72]).bindPopup('<b>Nuuk</b><br>Hauptstadt von Grönland.'));
    }

    if (t.map === 'pituffik') {
      map.fitBounds(BOUNDS.greenland.pad(0.22));
      const pit = addOverlay(L.marker([76.54, -68.75]).bindPopup('<b>Pituffik Space Base</b><br>Radar / Frühwarnung.'));
      const ring = addOverlay(L.circle([76.54, -68.75], { radius: 900000, color: '#f59e0b', weight: 2, fillOpacity: 0.08 }));
      pit.openPopup();
      ring.bindPopup('Nur eine grobe Darstellung (Radius).');
    }

    if (t.map === 'routes') {
      map.fitBounds(BOUNDS.greenland.pad(0.30));
      const route = addOverlay(
        L.polyline(
          [
            [60.17, 24.94],  // Helsinki (ungefähr)
            [64.18, -51.72], // Nuuk
            [69.65, -18.95], // Island (ungefähr)
            [51.51, -0.12]   // London
          ],
          { color: '#7c3aed', weight: 3, opacity: 0.9 }
        ).bindPopup('Beispiel-Route: Nur zur Erklärung (nicht exakt).')
      );
      addOverlay(L.circleMarker([62.0, -45.0], { radius: 8, color: '#111827', fillColor: '#111827', fillOpacity: 1 }).bindPopup('Rohstoffe (schematisch)'));
      route.openPopup();
    }

    if (t.map === 'projection') {
      map.fitBounds(L.latLngBounds([0, -120], [85, 40]).pad(0.08));
      // „Vergleichsflächen“ grob und bewusst schematisch
      const note = addOverlay(
        L.popup({ closeButton: false, autoClose: false })
          .setLatLng([8, -10])
          .setContent('<b>Karten-Trick:</b><br>Nahe am Pol wirkt alles größer. Ein Globus zeigt Größen besser.')
      );
      note.openOn(map);
    }
  }

  // -------------------- Scroll-/Klick-Sync --------------------
  let activeIndex = 0;

  function setActive(idx, scrollIntoView) {
    activeIndex = idx;
    setActiveButton(idx);
    updateMapFor(idx);

    if (scrollIntoView) {
      const sec = document.querySelector(`.section[data-step="${idx}"]`);
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setupScrollObserver() {
    const secs = Array.from(document.querySelectorAll('.section'));
    if (!secs.length) return;

    // Beobachte, welche Section im Viewport „dominiert“
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (!visible.length) return;
        const idx = Number(visible[0].target.dataset.step || 0);
        if (idx !== activeIndex) setActive(idx, false);
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65]
      }
    );

    secs.forEach((s) => obs.observe(s));
  }

  // -------------------- Start --------------------
  renderText();

  // Druckseite: nur Text, keine Karte
  if (isPrint) {
    return;
  }

  // Startseite
  renderTaskbar(setActive);
  makeMap();
  setupScrollObserver();

  // Initial
  setActive(0, false);

  // Print Button (falls vorhanden): kleine Sicherheit, dass er funktioniert
  const printBtn = document.querySelector('a.btn[href$="print.html"]');
  if (printBtn) {
    printBtn.addEventListener('click', (e) => {
      // Standard: neue Seite öffnen
      // (kein window.print() hier, weil GitHub Pages manchmal Popups blockt)
    });
  }
})();
