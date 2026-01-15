(() => {
const CONTENT = {
  lead: "Ich erkläre heute, warum Grönland plötzlich ein wichtiges Thema ist und was Donald Trump damit zu tun hat.",
  note: "Grönland gehört zu Dänemark. Die Menschen dort entscheiden bei vielen Dingen selbst.",
  steps: [
    {n:1,title:"Warum ist Grönland wichtig?",text:"Grönland liegt zwischen Amerika und Europa. Diese Lage ist wichtig für Flugzeuge, Schiffe und Sicherheit."},
    {n:2,title:"Was sagt Donald Trump?",text:"Donald Trump sagt, dass die USA mehr Kontrolle über Grönland haben sollten. Das sorgt für Streit."},
    {n:3,title:"Warum ist das militärisch wichtig?",text:"Auf Grönland gibt es eine US-Basis. Von dort kann man Gefahren früh erkennen."},
    {n:4,title:"Was ist die NATO?",text:"Die USA, Deutschland und Dänemark sind in der NATO. Sie helfen sich gegenseitig."},
    {n:5,title:"Warum ist das schwierig?",text:"Alle Länder sollen friedlich bleiben. Streit zwischen Partnern ist kompliziert."},
    {n:6,title:"Fazit",text:"Grönland ist wichtig, aber Probleme sollten durch Gespräche gelöst werden."}
  ]
};

document.getElementById("lead").textContent = CONTENT.lead;
document.getElementById("note").textContent = CONTENT.note;

const sec = document.getElementById("sections");
CONTENT.steps.forEach(s=>{
  const d=document.createElement("div");
  d.className="step";
  d.innerHTML=`<h3>${s.n}. ${s.title}</h3><p>${s.text}</p>`;
  sec.appendChild(d);
});

// print
const pl=document.getElementById("printLead");
if(pl){pl.textContent=CONTENT.lead;}
const ps=document.getElementById("printSections");
if(ps){
  CONTENT.steps.forEach(s=>{
    ps.innerHTML+=`<h2>${s.n}. ${s.title}</h2><p>${s.text}</p>`;
  });
}

// Map
if(typeof L==="undefined") return;
const map=L.map("map",{scrollWheelZoom:false}).setView([60,-30],2);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
const grl=L.circle([72,-40],{radius:1200000,color:"#34d399"}).addTo(map);
})();